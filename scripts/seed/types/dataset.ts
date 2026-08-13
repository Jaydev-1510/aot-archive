/**
 * SeedDataset — the canonical top-level seed data format.
 *
 * One dataset can span as many or as few TypeScript files as convenient
 * (e.g. `scripts/seed/data/people/yeager-family.ts` exporting a partial
 * `SeedDataset`, merged with others by a small aggregator) — this type
 * only defines the SHAPE, not the file layout, since that's a Phase 5+
 * (seed runner) concern once we know how large the dataset gets.
 *
 * Array order here does NOT need to match insertion dependency order
 * (sources -> relationship_types -> entities -> ... per your brief's
 * section 6) — the seed runner is responsible for sequencing inserts
 * correctly regardless of what order they're authored in. Forcing seed
 * AUTHORS to think about FK dependency order while writing lore data
 * would be a bad ergonomic trade for a problem the runner should solve
 * once, centrally.
 */

import type {
  SeedPerson,
  SeedTitan,
  SeedFamily,
  SeedEvent,
  SeedLocation,
  SeedFaction,
  SeedObject,
} from "./entities";
import type { SeedRelationshipType, SeedRelationship } from "./relationships";
import type { SeedTitanHolder } from "./titan-holders";
import type { SeedSource, SeedAbility, SeedMedia } from "./provenance";

export interface SeedDataset {
  sources?: SeedSource[];
  abilities?: SeedAbility[];
  media?: SeedMedia[];

  relationshipTypes?: SeedRelationshipType[];

  people?: SeedPerson[];
  titans?: SeedTitan[];
  families?: SeedFamily[];
  events?: SeedEvent[];
  locations?: SeedLocation[];
  factions?: SeedFaction[];
  objects?: SeedObject[];

  relationships?: SeedRelationship[];
  titanHolders?: SeedTitanHolder[];
}

/**
 * Merges multiple partial datasets (e.g. one per source file) into one.
 * Pure array concatenation — no dedup, no validation. Deliberately dumb:
 * duplicate-ID detection is a validation-layer concern (Phase 4), not
 * something this merge utility should silently paper over or silently
 * enforce. Kept here (not in a later "validation" file) because it's
 * part of what "the seed data format" means — how multiple authored
 * files compose into one dataset — not part of checking correctness.
 */
export function mergeSeedDatasets(...datasets: SeedDataset[]): SeedDataset {
  const merged: Required<SeedDataset> = {
    sources: [],
    abilities: [],
    media: [],
    relationshipTypes: [],
    people: [],
    titans: [],
    families: [],
    events: [],
    locations: [],
    factions: [],
    objects: [],
    relationships: [],
    titanHolders: [],
  };

  for (const dataset of datasets) {
    for (const key of Object.keys(merged) as Array<keyof SeedDataset>) {
      const values = dataset[key];
      if (values) {
        (merged[key] as unknown[]).push(...(values as unknown[]));
      }
    }
  }

  return merged;
}
