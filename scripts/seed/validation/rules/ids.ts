/**
 * Section 1: Stable IDs.
 *
 * Format validation here is defense-in-depth: the id*() factories in
 * ids.ts already throw at authoring time for malformed input, so a
 * dataset assembled entirely through those factories can't reach this
 * point with a bad format. This check exists for the case where a
 * dataset arrives some other way (a future JSON import path, or an
 * unsafe `as PersonId` cast) — the validator should not trust that
 * authoring-time safety was actually used.
 *
 * Cross-kind ID collisions (the same string used as e.g. both a person
 * and a titan) are NOT checked here — see entities.ts, since that
 * specifically maps to "entity type mismatch," which is section 2's
 * concern in your brief, not section 1's.
 */

import type { SeedDataset } from "../../types";
import { STABLE_ID_PATTERN } from "../../ids";
import type { ValidationError } from "../errors";

type EntityArrayKey = "people" | "titans" | "events" | "locations" | "factions" | "objects" | "families";

const ENTITY_ARRAY_KEYS: EntityArrayKey[] = [
  "people",
  "titans",
  "events",
  "locations",
  "factions",
  "objects",
  "families",
];

export function validateIds(dataset: SeedDataset, errors: ValidationError[]): void {
  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    const seen = new Map<string, number>(); // id -> first index seen

    records.forEach((record, index) => {
      const id = (record as { id: string }).id;

      if (!STABLE_ID_PATTERN.test(id)) {
        errors.push({
          section: "ids",
          identifier: `${key}[${index}] (${id})`,
          message: `Malformed stable id "${id}": must be lowercase snake_case matching ${STABLE_ID_PATTERN}.`,
        });
      }

      if (seen.has(id)) {
        errors.push({
          section: "ids",
          identifier: `${key}[${index}] (${id})`,
          message: `Duplicate id "${id}" — already declared at ${key}[${seen.get(id)}].`,
        });
      } else {
        seen.set(id, index);
      }
    });
  }

  checkDuplicateKeys(dataset.sources ?? [], (s) => s.key, "sources", errors);
  checkDuplicateKeys(dataset.abilities ?? [], (a) => a.name, "abilities", errors);
  checkDuplicateKeys(dataset.media ?? [], (m) => m.key, "media", errors);
  checkDuplicateKeys(dataset.relationshipTypes ?? [], (rt) => rt.slug, "relationshipTypes", errors);
}

function checkDuplicateKeys<T>(
  records: T[],
  getKey: (record: T) => string,
  arrayName: string,
  errors: ValidationError[],
): void {
  const seen = new Map<string, number>();
  records.forEach((record, index) => {
    const key = getKey(record);
    if (seen.has(key)) {
      errors.push({
        section: "ids",
        identifier: `${arrayName}[${index}] (${key})`,
        message: `Duplicate seed key "${key}" — already declared at ${arrayName}[${seen.get(key)}].`,
      });
    } else {
      seen.set(key, index);
    }
  });
}
