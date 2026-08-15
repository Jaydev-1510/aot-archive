/**
 * relationship_types structural checks. Duplicate `slug` detection
 * already lives in ids.ts (it's a seed-key uniqueness problem, same
 * category as source/ability/media keys). This file covers the one
 * thing specific to relationship_types: `inverseSlug`, when given, is a
 * REAL foreign key in the schema (relationship_types.inverse_slug
 * REFERENCES relationship_types.slug) — if it's set but doesn't resolve,
 * the insert will fail at the database, so we catch it here instead.
 */

import type { SeedDataset } from "../../types";
import type { ValidationError } from "../errors";

export function validateRelationshipTypes(
  dataset: SeedDataset,
  errors: ValidationError[],
): void {
  const declaredSlugs = new Set(
    (dataset.relationshipTypes ?? []).map((rt) => rt.slug),
  );

  (dataset.relationshipTypes ?? []).forEach((rt, index) => {
    if (rt.inverseSlug !== undefined && !declaredSlugs.has(rt.inverseSlug)) {
      errors.push({
        section: "relationshipTypes",
        identifier: `relationshipTypes[${index}] (${rt.slug})`,
        message: `inverseSlug "${rt.inverseSlug}" does not match any declared relationship_types.slug.`,
      });
    }
  });
}
