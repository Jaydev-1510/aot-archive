/**
 * Seed types for relationship_types (the predicate vocabulary) and
 * relationships (the generic knowledge-graph edges).
 *
 * `subject`/`object` are typed as EntityStableId — a union of all seven
 * branded entity-kind IDs — because a relationship can connect any two
 * entity kinds per Phase 2 of the architecture doc. This file does NOT
 * validate that subject/object actually exist, or resolve their kind for
 * the DB's denormalized subject_type/object_type columns; both require a
 * full-dataset lookup map, which belongs to the seed runner (next phase),
 * not the type layer.
 */

import type { RelationshipCategory } from "../../../src/database/schema";
import type { EntityStableId } from "../ids";
import type { SeedChronology, SeedProvenance } from "./common";

// relationship_types — the predicate lookup table
export interface SeedRelationshipType {
  /** e.g. 'parent-of'. This IS relationship_types.slug — no separate key. */
  slug: string;
  category: RelationshipCategory;
  /** slug of the reverse predicate, e.g. 'parent-of' <-> 'child-of'. Omit for asymmetric predicates with no defined inverse yet. */
  inverseSlug?: string;
  isSymmetric?: boolean;
  description?: string;
}

// relationships — the generic edge table
export interface SeedRelationship extends SeedChronology, SeedProvenance {
  subject: EntityStableId;
  /** Must match a `slug` declared in the relationship_types seed collection. */
  predicate: string;
  object: EntityStableId;
  /** role/rank/title on this specific edge, e.g. 'king', 'commander', 'marriage'. */
  qualifier?: string;
}
