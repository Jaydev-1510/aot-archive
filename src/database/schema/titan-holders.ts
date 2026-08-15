/**
 * titan_holders — Phase 3.4 / Phase 5 of the architecture doc.
 *
 * The one deliberate exception to "use the generic relationships table":
 * inheritance needs holder_order + predecessor/successor + a current-holder
 * flag, none of which a generic labeled edge expresses well. Must NOT be
 * replaced with generic relationships rows (explicit instruction).
 *
 * `idxTitanHoldersOneCurrent` is a PARTIAL unique index (titan_id) WHERE
 * is_current = 1. IMPORTANT CAVEAT (see Phase 9 write-up): there is a known
 * drizzle-kit issue where `drizzle-kit push` against SQLite/D1 does not
 * reliably diff the WHERE clause of a partial index, which can cause
 * spurious "no changes" / drift on repeated pushes. The index is declared
 * here for schema-as-documentation and for `drizzle-kit generate`, but the
 * generated migration SQL for this specific index should be hand-verified
 * in Phase 10 rather than trusted blindly from `push`.
 */

import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { people } from "./people";
import { titans } from "./titans";
import { sources } from "./provenance";
import { canonStatusColumn, datePrecisionColumn } from "./shared";

export const inheritanceMethodValues = [
  "combat",
  "death_bite",
  "injection",
  "birth",
  "unknown",
  "other",
] as const;

export type InheritanceMethod = (typeof inheritanceMethodValues)[number];

export const titanHolders = sqliteTable(
  "titan_holders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titanId: text("titan_id")
      .notNull()
      .references(() => titans.id, { onDelete: "cascade" }),
    personId: text("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),

    holderOrder: integer("holder_order"), // NULL = unknown position in the chain

    predecessorPersonId: text("predecessor_person_id").references(
      () => people.id,
      {
        onDelete: "set null",
      },
    ),
    successorPersonId: text("successor_person_id").references(() => people.id, {
      onDelete: "set null",
    }),

    periodStartYear: integer("period_start_year"),
    periodEndYear: integer("period_end_year"),
    datePrecision: datePrecisionColumn("date_precision"),

    isCurrent: integer("is_current", { mode: "boolean" })
      .notNull()
      .default(false),
    inheritanceMethod: text("inheritance_method", {
      enum: inheritanceMethodValues,
    }),

    canonStatus: canonStatusColumn(),
    sourceId: integer("source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
  },
  (table) => [
    index("idx_titan_holders_titan_order").on(table.titanId, table.holderOrder),
    index("idx_titan_holders_person").on(table.personId),
    unique("uq_titan_holders_titan_person_order").on(
      table.titanId,
      table.personId,
      table.holderOrder,
    ),
    // Partial unique index: at most one is_current=1 row per Titan.
    // See caveat in the file header re: drizzle-kit push behavior on D1.
    uniqueIndex("idx_titan_holders_one_current")
      .on(table.titanId)
      .where(sql`${table.isCurrent} = 1`),
    check(
      "chk_titan_holders_inheritance_method",
      sql`${table.inheritanceMethod} IN ('combat','death_bite','injection','birth','unknown','other')`,
    ),
  ],
);
