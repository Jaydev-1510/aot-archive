/**
 * titans — Phase 3.3 of the architecture doc.
 */

import { sql } from "drizzle-orm";
import { check, index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { canonStatusColumn } from "./shared";

export const titanClassValues = [
  "nine_titans",
  "pure_titan",
  "abnormal_titan",
  "named_titan",
] as const;

export type TitanClass = (typeof titanClassValues)[number];

export const titans = sqliteTable(
  "titans",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    titanClass: text("titan_class", { enum: titanClassValues }).notNull(),
    description: text("description"),
    canonStatus: canonStatusColumn(),
    notes: text("notes"),
  },
  (table) => [
    index("idx_titans_class").on(table.titanClass),
    check(
      "chk_titans_titan_class",
      sql`${table.titanClass} IN ('nine_titans','pure_titan','abnormal_titan','named_titan')`,
    ),
  ],
);
