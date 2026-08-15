/**
 * Stable ID strategy for AOT Archive seed data.
 *
 * WHY THIS FILE EXISTS
 * ---------------------
 * For every entity-backed table (people, titans, events, locations,
 * factions, objects, families), the architecture already uses a
 * human-readable TEXT primary key (Phase 3 of the architecture doc:
 * "IDs are slugs, not autoincrement integers"). That means a stable ID
 * is not a seed-layer invention we need to map to a database ID — it
 * IS the database ID. `eren_yeager` written in seed data is written
 * verbatim into `entities.id` and `people.id`.
 *
 * This file exists to make that fact type-safe: without branding, a
 * `PersonId` and a `TitanId` are both just `string`, and nothing stops
 * a seed author from accidentally putting a Titan's ID where a
 * `titan_holders.personId` is expected. Branded types catch that at
 * compile time, before the seed runner (a later phase) ever touches D1.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT DO
 * -----------------------------------------
 * It does not check that a referenced ID actually exists in the seed
 * dataset, and it does not resolve subject/object kinds for the generic
 * `relationships` table at runtime (TypeScript brands are erased at
 * runtime — a plain string carries no kind information once the seed
 * runner reads it back). That resolution requires building a lookup map
 * from every declared entity's ID -> its kind, which is a seed RUNNER
 * concern (dependency-ordered insertion, existence validation), not a
 * TYPES concern. This file only makes authoring seed data type-safe;
 * the next phase makes running it safe.
 */

// Naming convention
/**
 * Stable IDs: lowercase snake_case, ASCII only, no leading digit, no
 * leading/trailing/double underscores. Examples from the project brief:
 * eren_yeager, attack_titan, shiganshina_district.
 *
 * Chosen over UUIDs per your instruction — a human-authored archive
 * benefits far more from IDs that are readable and diffable in git and
 * directly usable as Astro route params (`/people/[id]`) than from
 * collision-proof randomness we don't need at this scale.
 */
export const STABLE_ID_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

export function isValidStableId(value: string): boolean {
  return STABLE_ID_PATTERN.test(value);
}

// Branded ID types — one per entity kind that lives in the `entities` table
declare const brand: unique symbol;

/** A stable ID scoped to a specific entity kind at the type level. */
export type StableId<Kind extends string> = string & { readonly [brand]: Kind };

function makeIdFactory<Kind extends string>(kind: Kind) {
  return (value: string): StableId<Kind> => {
    if (!isValidStableId(value)) {
      throw new Error(
        `Invalid stable id "${value}" for kind "${kind}": must match ${STABLE_ID_PATTERN} ` +
          `(lowercase snake_case, e.g. "eren_yeager").`,
      );
    }
    return value as StableId<Kind>;
  };
}

export type PersonId = StableId<"person">;
export type TitanId = StableId<"titan">;
export type EventId = StableId<"event">;
export type LocationId = StableId<"location">;
export type FactionId = StableId<"faction">;
export type ObjectId = StableId<"object">;
export type FamilyId = StableId<"family">;

export const personId = makeIdFactory("person");
export const titanId = makeIdFactory("titan");
export const eventId = makeIdFactory("event");
export const locationId = makeIdFactory("location");
export const factionId = makeIdFactory("faction");
export const objectId = makeIdFactory("object");
export const familyId = makeIdFactory("family");

/**
 * Any entity-backed stable ID. This is the type used by `relationships`
 * (subject/object) and by `aliases`/`media_links` (entityId) in the seed
 * layer, since those tables' `entity_id` can point at any of the seven
 * kinds. Runtime kind resolution happens in the seed runner (next phase).
 */
export type EntityStableId =
  PersonId | TitanId | EventId | LocationId | FactionId | ObjectId | FamilyId;

export const ENTITY_ID_FACTORIES = {
  person: personId,
  titan: titanId,
  event: eventId,
  location: locationId,
  faction: factionId,
  object: objectId,
  family: familyId,
} as const;

// Seed-only keys for autoincrement-PK tables (sources, abilities, media)
/**
 * These are NOT database columns. `sources.id` / `abilities.id` / `media.id`
 * are `INTEGER PRIMARY KEY AUTOINCREMENT` — SQLite assigns them at insert
 * time, so seed data can't reference the real value in advance. A
 * `SourceSeedKey` exists only in seed data and in the seed runner's
 * in-memory resolution map built during insertion; it is never written to
 * D1. This directly implements your principle #7: "Database-generated IDs
 * should not become the canonical references in source data."
 *
 * `abilities` is the one exception worth noting: `abilities.name` is
 * already UNIQUE in the schema, so it doubles as a natural seed key with
 * no synthetic key needed — see AbilitySeedKey below, which is just a
 * branded alias of `name`, not a separate field.
 */
export type SourceSeedKey = StableId<"source">;
export type MediaSeedKey = StableId<"media">;
export type AbilitySeedKey = StableId<"ability">; // == abilities.name

export const sourceSeedKey = makeIdFactory("source");
export const mediaSeedKey = makeIdFactory("media");
export const abilitySeedKey = makeIdFactory("ability");
