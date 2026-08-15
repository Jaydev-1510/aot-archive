/**
 * events — Phase 3.6 of the architecture doc.
 */

import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { sources } from "./provenance";
import { canonStatusColumn, datePrecisionColumn } from "./shared";

export const eventTypeValues = [
  "war",
  "battle",
  "expedition",
  "political",
  "disaster",
  "other",
] as const;

export type EventType = (typeof eventTypeValues)[number];

export const events = sqliteTable(
  "events",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    eventType: text("event_type", { enum: eventTypeValues }),
    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    datePrecision: datePrecisionColumn("date_precision"),
    summary: text("summary"),
    canonStatus: canonStatusColumn(),
    sourceId: integer("source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
  },
  (table) => [
    index("idx_events_year").on(table.yearStart),
    check(
      "chk_events_event_type",
      sql`${table.eventType} IN ('war','battle','expedition','political','disaster','other')`,
    ),
  ],
);
