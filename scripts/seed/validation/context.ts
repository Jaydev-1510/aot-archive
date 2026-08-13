/**
 * Builds lookup structures from a SeedDataset for reference-resolution
 * checks. Deliberately does NOT emit validation errors itself — it's pure
 * indexing (last-write-wins on collisions), so that duplicate/collision
 * detection stays owned by the specific rule files (ids.ts, entities.ts)
 * that are responsible for reporting them. Every other rule file just
 * reads from this index.
 */

import type { SeedDataset } from "../types";

export type EntityKind =
  | "person"
  | "titan"
  | "event"
  | "location"
  | "faction"
  | "object"
  | "family";

export interface ValidationContext {
  /** raw stable-id string -> the kind it was declared as. */
  entityKindById: Map<string, EntityKind>;
  sourceKeys: Set<string>;
  abilityNames: Set<string>;
  mediaKeys: Set<string>;
  relationshipTypeBySlug: Map<string, { slug: string; inverseSlug?: string; isSymmetric?: boolean }>;
  /** (titanId, personId) -> holderOrder, for titan_holders ordering cross-checks. Only present when holderOrder was given. */
  titanHolderOrderByTitanAndPerson: Map<string, number>;
}

export function buildContext(dataset: SeedDataset): ValidationContext {
  const entityKindById = new Map<string, EntityKind>();
  const register = (id: string, kind: EntityKind) => entityKindById.set(id, kind);

  for (const p of dataset.people ?? []) register(p.id, "person");
  for (const t of dataset.titans ?? []) register(t.id, "titan");
  for (const e of dataset.events ?? []) register(e.id, "event");
  for (const l of dataset.locations ?? []) register(l.id, "location");
  for (const f of dataset.factions ?? []) register(f.id, "faction");
  for (const o of dataset.objects ?? []) register(o.id, "object");
  for (const fam of dataset.families ?? []) register(fam.id, "family");

  const sourceKeys = new Set((dataset.sources ?? []).map((s) => s.key));
  const abilityNames = new Set((dataset.abilities ?? []).map((a) => a.name));
  const mediaKeys = new Set((dataset.media ?? []).map((m) => m.key));

  const relationshipTypeBySlug = new Map<
    string,
    { slug: string; inverseSlug?: string; isSymmetric?: boolean }
  >();
  for (const rt of dataset.relationshipTypes ?? []) {
    relationshipTypeBySlug.set(rt.slug, rt);
  }

  const titanHolderOrderByTitanAndPerson = new Map<string, number>();
  for (const h of dataset.titanHolders ?? []) {
    if (h.holderOrder !== undefined) {
      titanHolderOrderByTitanAndPerson.set(`${h.titan}::${h.person}`, h.holderOrder);
    }
  }

  return {
    entityKindById,
    sourceKeys,
    abilityNames,
    mediaKeys,
    relationshipTypeBySlug,
    titanHolderOrderByTitanAndPerson,
  };
}
