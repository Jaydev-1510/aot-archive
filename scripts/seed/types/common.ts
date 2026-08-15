/**
 * Shared seed sub-shapes.
 *
 * WHY EMBEDDED, NOT TOP-LEVEL ARRAYS
 * ------------------------------------
 * `aliases` and `media_links` both have an `entity_id` column pointing at
 * whichever entity they belong to. We could model seed aliases as a
 * top-level `aliases: SeedAlias[]` array (mirroring the DB table 1:1,
 * each entry carrying its own `entityId`), but that separates a
 * character's nicknames from the character's own seed record, which is
 * worse to author and worse to review in a diff. Instead, `aliases?` and
 * `media?` are optional fields embedded directly on each entity seed type
 * (SeedPerson, SeedTitan, ...); the entityId is implied by the parent
 * object and filled in by the seed runner at insert time, not authored
 * by hand. This is a seed-layer ergonomics choice, not a database
 * change — the underlying `aliases` and `media_links` tables are
 * untouched.
 */

import type {
  AliasType,
  CanonStatus,
  DatePrecision,
} from "../../../src/database/schema";
// NOTE: adjust this import to wherever your `src/database/` barrel
// re-exports the enum value arrays (entityTypeValues, canonStatusValues,
// etc.) from schema/index.ts — see the Phase 9 handoff for why those
// live in schema/shared.ts and get re-exported from the barrel.
import type { MediaSeedKey } from "../ids";

// Chronology — Phase 6 of the architecture doc, reused verbatim
export interface SeedChronology {
  yearStart?: number;
  yearEnd?: number;
  /** Omit entirely for "we don't even know approximately" rather than guessing an enum value. */
  datePrecision?: DatePrecision;
}

// Canon / provenance — Phase 7, reused verbatim
export interface SeedProvenance {
  /** Defaults to 'manga' at the DB level if omitted — do not set this unless the seed data actually warrants a different status. */
  canonStatus?: CanonStatus;
  /** References a SourceSeedKey declared in the top-level `sources` collection (see provenance.ts). */
  source?: string;
  notes?: string;
}

// Embedded aliases
export interface SeedAliasInput {
  alias: string;
  aliasType: AliasType;
  language?: string;
  notes?: string;
}

// Embedded media links
export interface SeedMediaLinkInput {
  /** References a MediaSeedKey declared in the top-level `media` collection. */
  mediaKey: MediaSeedKey;
  isPrimary?: boolean;
  displayOrder?: number;
}

/** Fields every entity-backed seed type shares, beyond its own domain fields. */
export interface SeedEntityCommon {
  name: string;
  /**
   * URL-friendly slug for routing. If omitted, the seed runner derives it
   * from the stable ID by replacing underscores with hyphens
   * (eren_yeager -> eren-yeager). Override only when that default is
   * wrong (e.g. two people who'd collide on the derived slug).
   */
  slug?: string;
  notes?: string;
  aliases?: SeedAliasInput[];
  media?: SeedMediaLinkInput[];
}
