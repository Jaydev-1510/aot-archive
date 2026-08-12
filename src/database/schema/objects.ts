/**
 * objects — Phase 3.6 of the architecture doc.
 */

import { sql } from "drizzle-orm";
import { check, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { canonStatusColumn } from "./shared";

export const objectTypeValues = [
  "equipment",
  "artifact",
  "weapon",
  "document",
  "other",
] as const;

export type ObjectType = (typeof objectTypeValues)[number];

export const objects = sqliteTable(
  "objects",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    objectType: text("object_type", { enum: objectTypeValues }),
    description: text("description"),
    canonStatus: canonStatusColumn(),
    notes: text("notes"),
  },
  (table) => [
    check(
      "chk_objects_object_type",
      sql`${table.objectType} IN ('equipment','artifact','weapon','document','other')`,
    ),
  ],
);
