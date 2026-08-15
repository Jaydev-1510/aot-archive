/**
 * Section 2: Entity consistency.
 *
 * Because this seed model creates an `entities` row and its subtype row
 * from a single seed object (see entities.ts's file header), most of the
 * failure modes your brief lists — "no subtype without its parent
 * entity," "no entity declares an incompatible subtype" — literally
 * cannot occur here; they're prevented by the seed shape itself, not by
 * a check.
 *
 * The one failure mode that CAN still occur, and is exactly the scenario
 * from your brief's example: the same raw id string declared under two
 * DIFFERENT kind arrays (e.g. "eren_yeager" accidentally present in both
 * `people` and `locations`). `entities.id` is one shared primary-key
 * space across every kind, so that's a real conflict — one of the two
 * inserts would violate the entities table's PRIMARY KEY.
 */

import type { SeedDataset } from "../../types";
import type { ValidationContext } from "../context";
import type { ValidationError } from "../errors";

type EntityArrayKey =
  | "people"
  | "titans"
  | "events"
  | "locations"
  | "factions"
  | "objects"
  | "families";

const ENTITY_ARRAY_KEYS: EntityArrayKey[] = [
  "people",
  "titans",
  "events",
  "locations",
  "factions",
  "objects",
  "families",
];

const ARRAY_KEY_TO_KIND: Record<EntityArrayKey, string> = {
  people: "person",
  titans: "titan",
  events: "event",
  locations: "location",
  factions: "faction",
  objects: "object",
  families: "family",
};

export function validateEntities(
  dataset: SeedDataset,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  // Cross-kind collisions: walk every array ourselves (not context, which
  // is last-write-wins) so both declaration sites get reported.
  const firstSeenAt = new Map<string, { key: EntityArrayKey; index: number }>();

  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    records.forEach((record, index) => {
      const id = (record as { id: string }).id;
      const prior = firstSeenAt.get(id);
      if (prior && prior.key !== key) {
        errors.push({
          section: "entities",
          identifier: `${key}[${index}] (${id})`,
          message:
            `Entity id "${id}" is declared as both "${ARRAY_KEY_TO_KIND[prior.key]}" ` +
            `(${prior.key}[${prior.index}]) and "${ARRAY_KEY_TO_KIND[key]}" (${key}[${index}]) — ` +
            `entities.id is a single shared primary key across all entity kinds; each id may ` +
            `belong to exactly one kind.`,
          details: {
            id,
            firstKind: ARRAY_KEY_TO_KIND[prior.key],
            secondKind: ARRAY_KEY_TO_KIND[key],
          },
        });
      } else if (!prior) {
        firstSeenAt.set(id, { key, index });
      }
    });
  }

  // Self-referential kind check: locations.parentLocation must exist and be a location.
  (dataset.locations ?? []).forEach((location, index) => {
    if (!location.parentLocation) return;
    const kind = context.entityKindById.get(location.parentLocation);
    if (kind === undefined) {
      errors.push({
        section: "entities",
        identifier: `locations[${index}] (${location.id})`,
        message: `parentLocation "${location.parentLocation}" does not exist.`,
      });
    } else if (kind !== "location") {
      errors.push({
        section: "entities",
        identifier: `locations[${index}] (${location.id})`,
        message: `parentLocation "${location.parentLocation}" exists but is a "${kind}", not a "location".`,
      });
    } else if (location.parentLocation === location.id) {
      errors.push({
        section: "entities",
        identifier: `locations[${index}] (${location.id})`,
        message: `A location cannot be its own parentLocation.`,
      });
    }
  });
}
