/**
 * relationships — Phase 3.7 / Phase 5 of the architecture doc.
 *
 * The generic knowledge-graph edge table. Default home for every family,
 * social, political, faction, location, and historical relationship —
 * everything except Titan inheritance (titan_holders, which needs
 * sequencing this table intentionally does not provide).
 *
 * `subjectType`/`objectType` are a deliberate denormalization of
 * entities.entity_type, written at insert time, so the repository layer
 * can filter "all person-to-person relationships" without a join back to
 * `entities`. Keeping these in sync is a write-time / seed-validation
 * concern (Phase 11/14), not something enforced by a DB trigger — see the
 * architecture doc's Cross-Cutting Decisions.
 *
 * Only ONE direction of a relationship is ever stored (e.g. 'parent-of'
 * from parent to child, never also 'child-of' from child to parent) — the
 * repository layer resolves the reverse direction via
 * relationship_types.inverse_slug. See Phase 5.
 */

import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { entities, entityTypeValues } from "./entities";
import { relationshipTypes } from "./relationship-types";
import { sources } from "./provenance";
import { canonStatusColumn, datePrecisionColumn } from "./shared";

export const relationships = sqliteTable(
  "relationships",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    subjectId: text("subject_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    subjectType: text("subject_type", { enum: entityTypeValues }).notNull(),

    predicate: text("predicate")
      .notNull()
      .references(() => relationshipTypes.slug),

    objectId: text("object_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    objectType: text("object_type", { enum: entityTypeValues }).notNull(),

    // role/rank/title, e.g. 'king', 'commander', 'marriage'
    qualifier: text("qualifier"),

    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    datePrecision: datePrecisionColumn("date_precision"),

    canonStatus: canonStatusColumn(),
    sourceId: integer("source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  },
  (table) => [
    index("idx_rel_subject").on(table.subjectId, table.predicate),
    index("idx_rel_object").on(table.objectId, table.predicate),
    index("idx_rel_predicate").on(table.predicate),
    unique("uq_relationships_edge").on(
      table.subjectId,
      table.predicate,
      table.objectId,
      table.qualifier,
    ),
    check(
      "chk_relationships_subject_type",
      sql`${table.subjectType} IN ('person','titan','event','location','faction','object','family')`,
    ),
    check(
      "chk_relationships_object_type",
      sql`${table.objectType} IN ('person','titan','event','location','faction','object','family')`,
    ),
  ],
);
