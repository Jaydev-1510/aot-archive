/**
 * SQL generation primitives.
 *
 * WHY SQL-FILE GENERATION INSTEAD OF A DRIZZLE CLIENT
 * -----------------------------------------------------
 * `src/database/index.ts`'s `createDb(d1: D1Database)` requires a real
 * `D1Database` binding, which only exists inside the Workers runtime (or
 * Miniflare simulating one). A standalone script — which is what this
 * ingestion tool is — has no such object available, for local OR remote
 * D1. This is a genuine constraint, not a design preference: it's why a
 * different mechanism is needed here rather than reusing the existing
 * client factory (per your instruction not to build a second connection
 * abstraction "unless the current implementation genuinely requires it").
 *
 * The mechanism used instead: generate a plain .sql file, then hand it to
 * `wrangler d1 execute --file=` (see d1-client.ts), the same tool this
 * project already uses and trusts for migrations. This works identically
 * for local and remote (one flag difference) and needs no additional
 * credentials.
 *
 * WHY UPDATE-THEN-INSERT-WHERE-NOT-EXISTS, NOT ONLY ON CONFLICT
 * -----------------------------------------------------------------
 * `ON CONFLICT` upserts require a NOT NULL unique index to conflict on.
 * That works cleanly for entities/subtypes, abilities, relationship_types,
 * media_links, titan_abilities. It does NOT work reliably for
 * relationships (nullable `qualifier`), titan_holders (nullable
 * `holder_order`), or aliases (no unique index at all) — SQLite's `IS`
 * operator is NULL-safe equality, so a two-statement
 * `UPDATE ... WHERE <identity via IS>` followed by
 * `INSERT ... SELECT ... WHERE NOT EXISTS (<same identity>)` gives correct
 * upsert-with-update semantics regardless of NULLs, with no JS-side
 * pre-read of the database required.
 *
 * WHY CORRELATED SUBQUERIES INSTEAD OF RESOLVING AUTOINCREMENT IDs IN JS
 * ---------------------------------------------------------------------
 * `sources`, `abilities`, `media` have autoincrement integer PKs unknown
 * until insert time. Rather than inserting, reading back
 * `lastInsertRowid`, and threading that value into later statements
 * (which requires a stateful connection this tool doesn't have), later
 * statements resolve those IDs with a subquery, e.g.
 * `(SELECT id FROM abilities WHERE name = 'Titan Hardening')`. Every
 * statement is self-contained; correctness only depends on dependency
 * ORDER in the generated file (abilities before titan_abilities, etc.),
 * not on any value being fed back into the generator.
 */

export type SqlExpr =
  { raw: string } | string | number | boolean | null | undefined;

/** Wrap a raw SQL fragment (e.g. a correlated subquery) so it's emitted verbatim, not quoted. */
export function raw(sql: string): { raw: string } {
  return { raw: sql };
}

function isRawExpr(v: SqlExpr): v is { raw: string } {
  return typeof v === "object" && v !== null && "raw" in v;
}

export function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

export function sqlValue(v: SqlExpr): string {
  if (isRawExpr(v)) return v.raw;
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "1" : "0";
  if (typeof v === "number") {
    if (!Number.isFinite(v))
      throw new Error(`Refusing to emit non-finite numeric SQL value: ${v}`);
    return String(v);
  }
  return sqlString(v);
}

/** Full upsert: works only when `conflictColumns` form a real NOT NULL unique index/PK. */
export function buildUpsertOnConflict(
  table: string,
  columns: string[],
  values: SqlExpr[],
  conflictColumns: string[],
  updateColumns: string[],
): string {
  const cols = columns.join(", ");
  const vals = values.map(sqlValue).join(", ");
  const conflict = conflictColumns.join(", ");
  if (updateColumns.length === 0) {
    return `INSERT INTO ${table} (${cols}) VALUES (${vals}) ON CONFLICT (${conflict}) DO NOTHING;`;
  }
  const updates = updateColumns.map((c) => `${c} = excluded.${c}`).join(", ");
  return `INSERT INTO ${table} (${cols}) VALUES (${vals}) ON CONFLICT (${conflict}) DO UPDATE SET ${updates};`;
}

/**
 * NULL-safe upsert for tables where the identity columns may include NULLs
 * (or where no DB unique index exists at all). Returns TWO statements:
 * an UPDATE for the case a matching row already exists, and an
 * INSERT ... WHERE NOT EXISTS for the case it doesn't. `updateColumns`
 * may be empty (insert-only / immutable — see sources.ts / media.ts).
 */
export function buildUpdateThenInsert(
  table: string,
  columns: string[],
  values: SqlExpr[],
  identityColumns: string[],
  updateColumns: string[],
): string[] {
  const valueByColumn = new Map(columns.map((c, i) => [c, values[i]]));
  const whereClause = identityColumns
    .map((col) => `${col} IS ${sqlValue(valueByColumn.get(col))}`)
    .join(" AND ");

  const statements: string[] = [];

  if (updateColumns.length > 0) {
    const setClause = updateColumns
      .map((col) => `${col} = ${sqlValue(valueByColumn.get(col))}`)
      .join(", ");
    statements.push(`UPDATE ${table} SET ${setClause} WHERE ${whereClause};`);
  }

  const cols = columns.join(", ");
  const vals = values.map(sqlValue).join(", ");
  statements.push(
    `INSERT INTO ${table} (${cols}) SELECT ${vals} WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE ${whereClause});`,
  );

  return statements;
}
