import type { SeedRelationshipType, SeedAbility } from "../types";
import { buildUpsertOnConflict, sqlValue } from "./sql";
import { DEFAULT_ABILITY_CATEGORY } from "./defaults";

/**
 * Two-phase, same reasoning as locations.parent_location_id: `inverse_slug`
 * is a real FK to another row in this same table, so phase 1 inserts every
 * type with inverse_slug left NULL (regardless of what's declared),
 * guaranteeing every slug exists before phase 2 sets inverse_slug from
 * the seed data.
 */
export function buildRelationshipTypeStatements(types: SeedRelationshipType[]): string[] {
  const statements: string[] = [];

  for (const t of types) {
    statements.push(
      buildUpsertOnConflict(
        "relationship_types",
        ["slug", "category", "inverse_slug", "is_symmetric", "description"],
        [t.slug, t.category, null, t.isSymmetric ?? false, t.description],
        ["slug"],
        ["category", "is_symmetric", "description"], // inverse_slug excluded — see phase 2
      ),
    );
  }

  for (const t of types) {
    if (t.inverseSlug === undefined) continue;
    statements.push(
      `UPDATE relationship_types SET inverse_slug = ${sqlValue(t.inverseSlug)} WHERE slug = ${sqlValue(t.slug)};`,
    );
  }

  return statements;
}

/** `abilities.name` is UNIQUE — the natural key IS the conflict target, no synthetic key needed. */
export function buildAbilityStatements(abilities: SeedAbility[]): string[] {
  return abilities.map((a) =>
    buildUpsertOnConflict(
      "abilities",
      ["name", "category", "description"],
      [a.name, a.category ?? DEFAULT_ABILITY_CATEGORY, a.description],
      ["name"],
      ["category", "description"],
    ),
  );
}
