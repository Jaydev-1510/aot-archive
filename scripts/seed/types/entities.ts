/**
 * Seed types for entity-backed tables.
 *
 * Each of these implies BOTH an `entities` row (entityType set
 * automatically by the runner from which array the object appears in)
 * AND the corresponding subtype row — never authored as two separate
 * objects. This mirrors the architecture doc's Cross-Cutting Decision #1:
 * entities + subtype inserts are always batched together, so they're
 * always authored together too.
 *
 * Enum unions (Gender, Species, LifeStatus, TitanClass, ...) are imported
 * from the schema, not redeclared — see common.ts for why.
 */

import type {
  Gender,
  Species,
  LifeStatus,
  TitanClass,
  EventType,
  LocationType,
  FactionType,
  ObjectType,
} from "../../../src/database/schema";
import type {
  PersonId,
  TitanId,
  FamilyId,
  EventId,
  LocationId,
  FactionId,
  ObjectId,
} from "../ids";
import type { SeedChronology, SeedEntityCommon, SeedProvenance } from "./common";

// People
export interface SeedPerson extends SeedEntityCommon {
  id: PersonId;
  japaneseName?: string;
  gender?: Gender;
  species?: Species;
  status?: LifeStatus;
  birth?: SeedChronology;
  death?: SeedChronology;
  summary?: string;
  provenance?: Pick<SeedProvenance, "canonStatus" | "source">; // people use `primary_source_id`, singular
}

// Titans
export interface SeedTitan extends SeedEntityCommon {
  id: TitanId;
  titanClass: TitanClass; // required — Phase 3 has no default for this column
  description?: string;
  /**
   * References ability names declared in the top-level `abilities`
   * collection (provenance.ts) — abilities.name is UNIQUE and doubles as
   * the natural key, per the stable-ID strategy.
   */
  abilities?: Array<{ ability: string; notes?: string }>;
  provenance?: Pick<SeedProvenance, "canonStatus">; // titans table has no source_id column
}

// Families
export interface SeedFamily extends SeedEntityCommon {
  id: FamilyId;
  isRoyalBloodline?: boolean;
  description?: string;
  // No canonStatus/source — the `families` table doesn't carry those
  // columns in the approved architecture (only the fact-bearing tables
  // and the seven entity subtypes with explicit canon_status do).
}

// Events
export interface SeedEvent extends SeedEntityCommon {
  id: EventId;
  eventType?: EventType;
  chronology?: SeedChronology;
  summary?: string;
  provenance?: Pick<SeedProvenance, "canonStatus" | "source">;
}

// Locations
export interface SeedLocation extends SeedEntityCommon {
  id: LocationId;
  locationType?: LocationType;
  /** References another location's stable ID. Self-referential hierarchy per Phase 3.6. */
  parentLocation?: LocationId;
  description?: string;
  provenance?: Pick<SeedProvenance, "canonStatus">;
}

// Factions
export interface SeedFaction extends SeedEntityCommon {
  id: FactionId;
  factionType?: FactionType;
  description?: string;
  provenance?: Pick<SeedProvenance, "canonStatus">;
}

// Objects
export interface SeedObject extends SeedEntityCommon {
  id: ObjectId;
  objectType?: ObjectType;
  description?: string;
  provenance?: Pick<SeedProvenance, "canonStatus">;
}
