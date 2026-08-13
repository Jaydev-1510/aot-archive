/**
 * Section 6: Abilities. `abilities.name` uniqueness already lives in
 * ids.ts (name is the natural seed key for this table — see ids.ts on
 * PersonId/etc for why). This file validates the titan_abilities side:
 * every ability a Titan references must actually be declared in the
 * top-level `abilities` collection.
 */

import type { SeedDataset } from "../../types";
import type { ValidationContext } from "../context";
import type { ValidationError } from "../errors";

export function validateAbilities(
  dataset: SeedDataset,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  (dataset.titans ?? []).forEach((titan, titanIndex) => {
    (titan.abilities ?? []).forEach((entry, abilityIndex) => {
      if (!context.abilityNames.has(entry.ability)) {
        errors.push({
          section: "abilities",
          identifier: `titans[${titanIndex}].abilities[${abilityIndex}] (${titan.id} -> ${entry.ability})`,
          message: `Ability "${entry.ability}" referenced by titan "${titan.id}" is not declared in the abilities collection.`,
        });
      }
    });
  });
}
