/**
 * factions — Phase 3.6 of the architecture doc.
 */

import { sql } from "drizzle-orm";
import { check, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { canonStatusColumn } from "./shared";

export const factionTypeValues = [
  "military",
  "political",
  "nation",
  "militia",
  "other",
] as const;

export type FactionType = (typeof factionTypeValues)[number];

export const factions = sqliteTable(
  "factions",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    factionType: text("faction_type", { enum: factionTypeValues }),
    description: text("description"),
    canonStatus: canonStatusColumn(),
    notes: text("notes"),
  },
  (table) => [
    check(
      "chk_factions_faction_type",
      sql`${table.factionType} IN ('military','political','nation','militia','other')`,
    ),
  ],
);
