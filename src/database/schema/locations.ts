/**
 * locations — Phase 3.6 of the architecture doc.
 *
 * `parentLocationId` is self-referential (district -> city -> wall region ->
 * island), giving free hierarchical queries via a recursive CTE at the
 * repository layer without a separate closure table.
 */

import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  check,
  index,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { canonStatusColumn } from "./shared";

export const locationTypeValues = [
  "nation",
  "region",
  "city",
  "district",
  "wall",
  "island",
  "landmark",
  "other",
] as const;

export type LocationType = (typeof locationTypeValues)[number];

export const locations = sqliteTable(
  "locations",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    locationType: text("location_type", { enum: locationTypeValues }),
    parentLocationId: text("parent_location_id").references(
      (): AnySQLiteColumn => locations.id,
      { onDelete: "set null" },
    ),
    description: text("description"),
    canonStatus: canonStatusColumn(),
    notes: text("notes"),
  },
  (table) => [
    index("idx_locations_parent").on(table.parentLocationId),
    check(
      "chk_locations_location_type",
      sql`${table.locationType} IN ('nation','region','city','district','wall','island','landmark','other')`,
    ),
  ],
);
