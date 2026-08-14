/**
 * aliases / media_links — both are embedded on each entity's seed object
 * (see common.ts's file header), so these builders walk all seven entity
 * arrays rather than a single top-level collection.
 */

import type { SeedDataset } from "../types";
import { buildUpdateThenInsert, buildUpsertOnConflict, raw } from "./sql";
import { mediaIdSubquery } from "./identity";

type EntityArrayKey = "people" | "titans" | "events" | "locations" | "factions" | "objects" | "families";
const ENTITY_ARRAY_KEYS: EntityArrayKey[] = [
  "people", "titans", "events", "locations", "factions", "objects", "families",
];

/**
 * `aliases` has no unique index in the approved schema (see ids.ts's
 * validator comment — this is a known, flagged gap, not an oversight
 * introduced here). update-then-insert with a NULL-safe identity match
 * is the only way to get idempotent behavior without a schema change.
 */
export function buildAliasStatements(dataset: SeedDataset): string[] {
  const statements: string[] = [];
  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    for (const record of records) {
      const { id, aliases } = record as {
        id: string;
        aliases?: Array<{ alias: string; aliasType: string; language?: string; notes?: string }>;
      };
      for (const a of aliases ?? []) {
        statements.push(
          ...buildUpdateThenInsert(
            "aliases",
            ["entity_id", "alias", "alias_type", "language", "notes"],
            [id, a.alias, a.aliasType, a.language ?? null, a.notes],
            ["entity_id", "alias", "alias_type", "language"],
            ["notes"],
          ),
        );
      }
    }
  }
  return statements;
}

/** media_links has a real UNIQUE(entity_id, media_id) — true upsert applies. */
export function buildMediaLinkStatements(dataset: SeedDataset): string[] {
  const statements: string[] = [];
  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    for (const record of records) {
      const { id, media } = record as {
        id: string;
        media?: Array<{ mediaKey: string; isPrimary?: boolean; displayOrder?: number }>;
      };
      for (const link of media ?? []) {
        statements.push(
          buildUpsertOnConflict(
            "media_links",
            ["entity_id", "media_id", "is_primary", "display_order"],
            [id, raw(mediaIdSubquery(link.mediaKey)), link.isPrimary ?? false, link.displayOrder],
            ["entity_id", "media_id"],
            ["is_primary", "display_order"],
          ),
        );
      }
    }
  }
  return statements;
}
