/**
 * relationship_types — Phase 5 of the architecture doc.
 *
 * A lookup table, not a hardcoded CHECK list, so new predicates can be added
 * with an INSERT rather than a migration. Self-referential `inverse_slug`
 * lets the query layer label the reverse direction of a stored edge without
 * ever storing both directions (Phase 5: "storing one direction only").
 */

import { sql } from "drizzle-orm";
import {
  check,
  type AnySQLiteColumn,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const relationshipCategoryValues = [
  "family",
  "social",
  "political",
  "faction",
  "location",
  "historical",
  "ownership",
] as const;

export type RelationshipCategory = (typeof relationshipCategoryValues)[number];

export const relationshipTypes = sqliteTable(
  "relationship_types",
  {
    slug: text("slug").primaryKey(),
    category: text("category", { enum: relationshipCategoryValues }).notNull(),
    inverseSlug: text("inverse_slug").references(
      (): AnySQLiteColumn => relationshipTypes.slug,
    ),
    isSymmetric: integer("is_symmetric", { mode: "boolean" }).notNull().default(false),
    description: text("description"),
  },
  (table) => [
    check(
      "chk_relationship_types_category",
      sql`${table.category} IN ('family','social','political','faction','location','historical','ownership')`,
    ),
  ],
);
