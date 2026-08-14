/**
 * Statement builders for entities + subtype tables.
 *
 * Each entity emits its `entities` upsert followed immediately by its
 * subtype upsert. `entities.created_at` is intentionally excluded from
 * the update columns — a rerun should update entity_type but never
 * overwrite the original creation timestamp. `updated_at` is left NULL
 * by this ingestion layer: the approved schema has no trigger to stamp
 * it automatically, and fabricating a value here would be inventing
 * behavior the schema doesn't define.
 *
 * `locations.parent_location_id` is set in a SECOND pass across the
 * whole array, after every location id is guaranteed to exist — the
 * same self-referential-FK ordering problem relationship_types.
 * inverse_slug has (see statements.ts).
 */

import type {
  SeedPerson,
  SeedTitan,
  SeedFamily,
  SeedEvent,
  SeedLocation,
  SeedFaction,
  SeedObject,
} from "../types";
import { buildUpsertOnConflict, raw, sqlValue } from "./sql";
import { DEFAULT_GENDER, DEFAULT_SPECIES, DEFAULT_LIFE_STATUS, DEFAULT_CANON_STATUS } from "./defaults";
import { sourceIdSubquery } from "./identity";

function deriveSlug(id: string, explicitSlug?: string): string {
  return explicitSlug ?? id.replace(/_/g, "-");
}

function entityUpsert(id: string, entityType: string): string {
  return buildUpsertOnConflict("entities", ["id", "entity_type"], [id, entityType], ["id"], ["entity_type"]);
}

function sourceRef(seedKey: string | undefined) {
  return seedKey === undefined ? null : raw(sourceIdSubquery(seedKey));
}

export function buildPeopleStatements(people: SeedPerson[]): string[] {
  const statements: string[] = [];
  for (const p of people) {
    statements.push(entityUpsert(p.id, "person"));
    statements.push(
      buildUpsertOnConflict(
        "people",
        [
          "id", "name", "slug", "japanese_name", "gender", "species", "status",
          "birth_year_start", "birth_year_end", "birth_date_precision",
          "death_year_start", "death_year_end", "death_date_precision",
          "summary", "canon_status", "primary_source_id", "notes",
        ],
        [
          p.id, p.name, deriveSlug(p.id, p.slug), p.japaneseName, p.gender ?? DEFAULT_GENDER, p.species ?? DEFAULT_SPECIES, p.status ?? DEFAULT_LIFE_STATUS,
          p.birth?.yearStart, p.birth?.yearEnd, p.birth?.datePrecision,
          p.death?.yearStart, p.death?.yearEnd, p.death?.datePrecision,
          p.summary, p.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, sourceRef(p.provenance?.source), p.notes,
        ],
        ["id"],
        [
          "name", "slug", "japanese_name", "gender", "species", "status",
          "birth_year_start", "birth_year_end", "birth_date_precision",
          "death_year_start", "death_year_end", "death_date_precision",
          "summary", "canon_status", "primary_source_id", "notes",
        ],
      ),
    );
  }
  return statements;
}

export function buildTitanStatements(titans: SeedTitan[]): string[] {
  const statements: string[] = [];
  for (const t of titans) {
    statements.push(entityUpsert(t.id, "titan"));
    statements.push(
      buildUpsertOnConflict(
        "titans",
        ["id", "name", "slug", "titan_class", "description", "canon_status", "notes"],
        [t.id, t.name, deriveSlug(t.id, t.slug), t.titanClass, t.description, t.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, t.notes],
        ["id"],
        ["name", "slug", "titan_class", "description", "canon_status", "notes"],
      ),
    );
  }
  return statements;
}

export function buildFamilyStatements(families: SeedFamily[]): string[] {
  const statements: string[] = [];
  for (const f of families) {
    statements.push(entityUpsert(f.id, "family"));
    statements.push(
      buildUpsertOnConflict(
        "families",
        ["id", "name", "slug", "is_royal_bloodline", "description", "notes"],
        [f.id, f.name, deriveSlug(f.id, f.slug), f.isRoyalBloodline ?? false, f.description, f.notes],
        ["id"],
        ["name", "slug", "is_royal_bloodline", "description", "notes"],
      ),
    );
  }
  return statements;
}

export function buildEventStatements(events: SeedEvent[]): string[] {
  const statements: string[] = [];
  for (const e of events) {
    statements.push(entityUpsert(e.id, "event"));
    statements.push(
      buildUpsertOnConflict(
        "events",
        [
          "id", "name", "slug", "event_type", "year_start", "year_end", "date_precision",
          "summary", "canon_status", "source_id", "notes",
        ],
        [
          e.id, e.name, deriveSlug(e.id, e.slug), e.eventType,
          e.chronology?.yearStart, e.chronology?.yearEnd, e.chronology?.datePrecision,
          e.summary, e.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, sourceRef(e.provenance?.source), e.notes,
        ],
        ["id"],
        [
          "name", "slug", "event_type", "year_start", "year_end", "date_precision",
          "summary", "canon_status", "source_id", "notes",
        ],
      ),
    );
  }
  return statements;
}

export function buildLocationStatements(locations: SeedLocation[]): string[] {
  const statements: string[] = [];

  for (const l of locations) {
    statements.push(entityUpsert(l.id, "location"));
    statements.push(
      buildUpsertOnConflict(
        "locations",
        ["id", "name", "slug", "location_type", "parent_location_id", "description", "canon_status", "notes"],
        [l.id, l.name, deriveSlug(l.id, l.slug), l.locationType, null, l.description, l.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, l.notes],
        ["id"],
        ["name", "slug", "location_type", "description", "canon_status", "notes"], // parent_location_id excluded — see phase 2
      ),
    );
  }

  for (const l of locations) {
    if (l.parentLocation === undefined) continue;
    statements.push(
      `UPDATE locations SET parent_location_id = ${sqlValue(l.parentLocation)} WHERE id = ${sqlValue(l.id)};`,
    );
  }

  return statements;
}

export function buildFactionStatements(factions: SeedFaction[]): string[] {
  const statements: string[] = [];
  for (const f of factions) {
    statements.push(entityUpsert(f.id, "faction"));
    statements.push(
      buildUpsertOnConflict(
        "factions",
        ["id", "name", "slug", "faction_type", "description", "canon_status", "notes"],
        [f.id, f.name, deriveSlug(f.id, f.slug), f.factionType, f.description, f.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, f.notes],
        ["id"],
        ["name", "slug", "faction_type", "description", "canon_status", "notes"],
      ),
    );
  }
  return statements;
}

export function buildObjectStatements(objects: SeedObject[]): string[] {
  const statements: string[] = [];
  for (const o of objects) {
    statements.push(entityUpsert(o.id, "object"));
    statements.push(
      buildUpsertOnConflict(
        "objects",
        ["id", "name", "slug", "object_type", "description", "canon_status", "notes"],
        [o.id, o.name, deriveSlug(o.id, o.slug), o.objectType, o.description, o.provenance?.canonStatus ?? DEFAULT_CANON_STATUS, o.notes],
        ["id"],
        ["name", "slug", "object_type", "description", "canon_status", "notes"],
      ),
    );
  }
  return statements;
}
