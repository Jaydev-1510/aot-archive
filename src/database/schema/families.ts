/**
 * families — Phase 3.5 of the architecture doc.
 *
 * Family MEMBERSHIP is not a table here — it's a `relationships` row
 * (predicate = 'member-of', qualifier = 'birth' | 'marriage' | 'adopted').
 * See Phase 5 for why this didn't get promoted to a dedicated table.
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { entities } from "./entities";

export const families = sqliteTable("families", {
  id: text("id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  isRoyalBloodline: integer("is_royal_bloodline", { mode: "boolean" })
    .notNull()
    .default(false),
  description: text("description"),
  notes: text("notes"),
});
