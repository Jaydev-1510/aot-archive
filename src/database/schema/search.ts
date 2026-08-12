/**
 * search_index — Phase 8 of the architecture doc.
 *
 * NOT a Drizzle-managed table. Drizzle's `sqlite-core` schema DSL has no
 * builder for `CREATE VIRTUAL TABLE ... USING fts5(...)` — virtual tables
 * aren't part of its table/column model, and `drizzle-kit` cannot diff or
 * migrate them. Per the task's instruction ("use the appropriate SQL
 * migration/custom SQL mechanism rather than changing the underlying
 * architecture"), this is implemented as a raw SQL statement applied via a
 * custom migration in Phase 10 (e.g. a `.sql` file dropped into the
 * drizzle-kit migrations folder, or executed once via `wrangler d1 execute`),
 * NOT as an export from this schema module.
 *
 * The constant below is the authoritative DDL for that migration — kept
 * here, next to the rest of the schema, so it stays reviewable alongside
 * schema changes even though drizzle-kit will never generate or manage it.
 */

export const SEARCH_INDEX_FTS5_DDL = `
CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
  name,
  aliases,
  summary,
  entity_id   UNINDEXED,
  entity_type UNINDEXED,
  tokenize = 'porter unicode61'
);
`.trim();

/**
 * Shape of a row synced INTO search_index (from people/titans/events/
 * locations/factions + their aliases). Used for typing the repository
 * layer's sync function in a later phase — not a Drizzle table type.
 */
export interface SearchIndexRow {
  name: string;
  aliases: string; // space-joined denormalization of the `aliases` table
  summary: string | null;
  entityId: string;
  entityType: "person" | "titan" | "event" | "location" | "faction";
}
