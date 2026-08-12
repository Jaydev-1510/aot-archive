/**
 * entities — Phase 2 & 3.1 of the architecture doc.
 *
 * The supertype table. Every "graph node" type (people, titans, events,
 * locations, factions, objects, families) has a primary key that IS an
 * entities.id — this is what lets `relationships.subject_id` /
 * `relationships.object_id` carry a real, DB-enforced foreign key even
 * though they can point at any of those seven types. See Phase 2 of the
 * architecture doc for the full rationale.
 */

import { sql } from "drizzle-orm";
import { check, index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtColumn } from "./shared";

export const entityTypeValues = [
  "person",
  "titan",
  "event",
  "location",
  "faction",
  "object",
  "family",
] as const;

export type EntityType = (typeof entityTypeValues)[number];

export const entities = sqliteTable(
  "entities",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type", { enum: entityTypeValues }).notNull(),
    createdAt: createdAtColumn(),
    updatedAt: text("updated_at"),
  },
  (table) => [
    index("idx_entities_type").on(table.entityType),
    check(
      "chk_entities_entity_type",
      sql`${table.entityType} IN ('person','titan','event','location','faction','object','family')`,
    ),
  ],
);
