/**
 * Seed types for the three tables with autoincrement integer PKs:
 * sources, abilities, media. Each carries a seed-only key (see ids.ts)
 * that the runner resolves to the real DB-assigned integer id — these
 * keys are never written to D1 themselves.
 */

import type { SourceType, AbilityCategory, MediaType } from "../../../src/database/schema";
import type { SourceSeedKey, MediaSeedKey } from "../ids";

// sources
export interface SeedSource {
  key: SourceSeedKey;
  title: string;
  sourceType: SourceType;
  chapter?: number;
  episode?: number;
  volume?: number;
  page?: number;
  url?: string;
  notes?: string;
}

// abilities — name is UNIQUE in the schema, so it IS the natural key.
// No synthetic AbilitySeedKey field on this type; `name` fills that role.
export interface SeedAbility {
  name: string;
  category?: AbilityCategory;
  description?: string;
}

// media
export interface SeedMedia {
  key: MediaSeedKey;
  mediaType: MediaType;
  url: string;
  caption?: string;
  /** References a SourceSeedKey from the top-level `sources` collection. */
  source?: string;
  licenseNotes?: string;
}
