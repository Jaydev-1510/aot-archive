/**
 * abilities / titan_abilities — Phase 3.3 of the architecture doc.
 *
 * `abilities` is deliberately NOT part of the entities supertype (Phase 2:
 * "not every generalize-able thing needs to be generalized") — nothing in
 * the requirements needs a person-to-ability graph edge with predicate
 * semantics, so a plain many-to-many junction table is sufficient.
 */

import { sql } from "drizzle-orm";
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { titans } from "./titans";

export const abilityCategoryValues = [
  "titan_power",
  "combat_skill",
  "other",
] as const;
export type AbilityCategory = (typeof abilityCategoryValues)[number];

export const abilities = sqliteTable(
  "abilities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    category: text("category", { enum: abilityCategoryValues })
      .notNull()
      .default("titan_power"),
    description: text("description"),
  },
  (table) => [
    check(
      "chk_abilities_category",
      sql`${table.category} IN ('titan_power','combat_skill','other')`,
    ),
  ],
);

export const titanAbilities = sqliteTable(
  "titan_abilities",
  {
    titanId: text("titan_id")
      .notNull()
      .references(() => titans.id, { onDelete: "cascade" }),
    abilityId: integer("ability_id")
      .notNull()
      .references(() => abilities.id, { onDelete: "cascade" }),
    notes: text("notes"),
  },
  (table) => [primaryKey({ columns: [table.titanId, table.abilityId] })],
);
