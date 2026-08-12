/**
 * Shared enum vocab + reusable column builders.
 *
 * These are not architecture decisions — they're implementation DRY-ing.
 * `canon_status` and the `*_date_precision` columns are defined identically
 * on every table that has them in the architecture doc (Phases 6 & 7); rather
 * than repeat the `text(..., { enum: [...] }).notNull().default(...)` call
 * verbatim in every file, we centralize the value lists and the canon_status
 * builder here. The DB-level CHECK constraints are still declared explicitly
 * in each table (see note in the Phase 9 write-up about the drizzle-kit
 * push/check/partial-index caveat) — this file only removes duplication in
 * the *value lists*, not the constraints themselves.
 */

import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// canon_status — Phase 7 of the architecture doc
// ---------------------------------------------------------------------------
export const canonStatusValues = [
  "manga",
  "anime",
  "anime-only",
  "guidebook",
  "inferred",
  "disputed",
  "unknown",
] as const;

export type CanonStatus = (typeof canonStatusValues)[number];

/** Every fact-bearing table gets this column, defaulting to 'manga' per the architecture doc. */
export const canonStatusColumn = () =>
  text("canon_status", { enum: canonStatusValues }).notNull().default("manga");

// ---------------------------------------------------------------------------
// date_precision — Phase 6 of the architecture doc
// ---------------------------------------------------------------------------
export const datePrecisionValues = [
  "exact",
  "circa",
  "year-only",
  "decade",
  "era",
  "unknown",
] as const;

export type DatePrecision = (typeof datePrecisionValues)[number];

/** dbName varies per table (birth_date_precision, death_date_precision, date_precision, ...) */
export const datePrecisionColumn = (dbName: string) =>
  text(dbName, { enum: datePrecisionValues });

// ---------------------------------------------------------------------------
// Timestamp helper — D1/SQLite-friendly (TEXT, ISO-8601-ish, set by SQLite itself)
// ---------------------------------------------------------------------------
export const createdAtColumn = () =>
  text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`);
