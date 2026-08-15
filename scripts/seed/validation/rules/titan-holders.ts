/**
 * Section 4: Titan holders.
 */

import type { SeedDataset } from "../../types";
import type { ValidationContext } from "../context";
import type { ValidationError } from "../errors";

export function validateTitanHolders(
  dataset: SeedDataset,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  const holders = dataset.titanHolders ?? [];

  holders.forEach((holder, index) => {
    const identifier = `titanHolders[${index}] (${holder.titan} <- ${holder.person})`;

    checkKind(holder.titan, "titan", "titan", identifier, context, errors);
    checkKind(holder.person, "person", "person", identifier, context, errors);
    if (holder.predecessor !== undefined) {
      checkKind(
        holder.predecessor,
        "predecessor",
        "person",
        identifier,
        context,
        errors,
      );
    }
    if (holder.successor !== undefined) {
      checkKind(
        holder.successor,
        "successor",
        "person",
        identifier,
        context,
        errors,
      );
    }

    if (holder.holderOrder !== undefined) {
      if (!Number.isInteger(holder.holderOrder) || holder.holderOrder < 1) {
        errors.push({
          section: "titanHolders",
          identifier,
          message: `holderOrder must be a positive integer (>= 1); got ${holder.holderOrder}.`,
        });
      }
    }

    // Cross-check ordering against the predecessor's/successor's own
    // declared order for the SAME titan, when both are known. Skips
    // silently if either side's order wasn't declared — we don't invent
    // an order that wasn't stated.
    if (holder.holderOrder !== undefined && holder.predecessor !== undefined) {
      const predecessorOrder = context.titanHolderOrderByTitanAndPerson.get(
        `${holder.titan}::${holder.predecessor}`,
      );
      if (
        predecessorOrder !== undefined &&
        predecessorOrder >= holder.holderOrder
      ) {
        errors.push({
          section: "titanHolders",
          identifier,
          message:
            `predecessor "${holder.predecessor}" has holderOrder ${predecessorOrder}, which is not ` +
            `before this holder's order (${holder.holderOrder}).`,
        });
      }
    }
    if (holder.holderOrder !== undefined && holder.successor !== undefined) {
      const successorOrder = context.titanHolderOrderByTitanAndPerson.get(
        `${holder.titan}::${holder.successor}`,
      );
      if (
        successorOrder !== undefined &&
        successorOrder <= holder.holderOrder
      ) {
        errors.push({
          section: "titanHolders",
          identifier,
          message:
            `successor "${holder.successor}" has holderOrder ${successorOrder}, which is not after ` +
            `this holder's order (${holder.holderOrder}).`,
        });
      }
    }
  });

  // At most one is_current per titan — mirrors idx_titan_holders_one_current,
  // but catching it here means the whole seed batch doesn't fail at D1
  // insert time with a much less specific error.
  const currentHolderIndexByTitan = new Map<string, number>();
  holders.forEach((holder, index) => {
    if (!holder.isCurrent) return;
    const prior = currentHolderIndexByTitan.get(holder.titan);
    if (prior !== undefined) {
      errors.push({
        section: "titanHolders",
        identifier: `titanHolders[${index}] (${holder.titan} <- ${holder.person})`,
        message:
          `Titan "${holder.titan}" already has a current holder declared at titanHolders[${prior}]. ` +
          `At most one holder per titan may have isCurrent: true.`,
      });
    } else {
      currentHolderIndexByTitan.set(holder.titan, index);
    }
  });

  // holderOrder uniqueness within a titan (two different people can't
  // both be, say, the 3rd holder of the same titan).
  const orderSeenByTitan = new Map<string, Map<number, number>>();
  holders.forEach((holder, index) => {
    if (holder.holderOrder === undefined) return;
    let ordersForTitan = orderSeenByTitan.get(holder.titan);
    if (!ordersForTitan) {
      ordersForTitan = new Map();
      orderSeenByTitan.set(holder.titan, ordersForTitan);
    }
    const priorIndex = ordersForTitan.get(holder.holderOrder);
    if (priorIndex !== undefined) {
      errors.push({
        section: "titanHolders",
        identifier: `titanHolders[${index}] (${holder.titan} <- ${holder.person})`,
        message:
          `Duplicate holderOrder ${holder.holderOrder} for titan "${holder.titan}" — already used at ` +
          `titanHolders[${priorIndex}].`,
      });
    } else {
      ordersForTitan.set(holder.holderOrder, index);
    }
  });
}

function checkKind(
  id: string,
  fieldLabel: string,
  expectedKind: string,
  identifier: string,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  const kind = context.entityKindById.get(id);
  if (kind === undefined) {
    errors.push({
      section: "titanHolders",
      identifier,
      message: `${fieldLabel} "${id}" does not exist.`,
    });
  } else if (kind !== expectedKind) {
    errors.push({
      section: "titanHolders",
      identifier,
      message: `${fieldLabel} "${id}" exists but is a "${kind}", not a "${expectedKind}".`,
    });
  }
}
