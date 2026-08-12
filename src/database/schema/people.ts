/**
 * people — Phase 3.2 of the architecture doc.
 *
 * Note what is deliberately NOT here: no `nationality` column, no
 * `is_royal` flag. Both are represented as `relationships` rows per the
 * architecture's Cross-Cutting Decisions #2 and #3. See the Phase 9
 * write-up's "Nationality / Subject of Ymir" section for confirmation that
 * this requires no additional schema.
 */

import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { entities } from "./entities";
import { sources } from "./provenance";
import { canonStatusColumn, datePrecisionColumn } from "./shared";

export const genderValues = ["male", "female", "unknown"] as const;
export type Gender = (typeof genderValues)[number];

export const speciesValues = ["human", "pure_titan", "unknown"] as const;
export type Species = (typeof speciesValues)[number];

export const lifeStatusValues = ["alive", "deceased", "unknown"] as const;
export type LifeStatus = (typeof lifeStatusValues)[number];

export const people = sqliteTable(
  "people",
  {
    id: text("id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    japaneseName: text("japanese_name"),
    gender: text("gender", { enum: genderValues }).notNull().default("unknown"),
    species: text("species", { enum: speciesValues }).notNull().default("human"),
    status: text("status", { enum: lifeStatusValues }).notNull().default("unknown"),

    // In-universe year numbers — see Phase 6 of the architecture doc.
    // Deliberately plain INTEGER, not a "date" type: SQLite/D1 has none,
    // and these are era-relative year numbers, not real-world dates.
    birthYearStart: integer("birth_year_start"),
    birthYearEnd: integer("birth_year_end"),
    birthDatePrecision: datePrecisionColumn("birth_date_precision"),

    deathYearStart: integer("death_year_start"),
    deathYearEnd: integer("death_year_end"),
    deathDatePrecision: datePrecisionColumn("death_date_precision"),

    summary: text("summary"),
    canonStatus: canonStatusColumn(),
    primarySourceId: integer("primary_source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
  },
  (table) => [
    index("idx_people_status").on(table.status),
    index("idx_people_birth_year").on(table.birthYearStart),
    check("chk_people_gender", sql`${table.gender} IN ('male','female','unknown')`),
    check(
      "chk_people_species",
      sql`${table.species} IN ('human','pure_titan','unknown')`,
    ),
    check(
      "chk_people_status",
      sql`${table.status} IN ('alive','deceased','unknown')`,
    ),
  ],
);
