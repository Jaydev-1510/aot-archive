import type { Database } from "../index";
import type { EntityId, SearchResult } from "./types";

const SEARCHABLE_ENTITY_TYPES = new Set([
  "person",
  "titan",
  "event",
  "location",
  "faction",
]);

function toFtsQuery(query: string): string | null {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return null;
  return terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(" AND ");
}

/** Queries the existing FTS5 projection through the same Worker D1 binding. */
export async function searchArchive(
  db: Database,
  query: string,
  limit = 20,
): Promise<SearchResult[]> {
  const ftsQuery = toFtsQuery(query);
  if (!ftsQuery) return [];

  const result = await db.$client
    .prepare(
      "SELECT entity_id, entity_type, name, bm25(search_index) AS rank FROM search_index WHERE search_index MATCH ? ORDER BY rank ASC, name ASC LIMIT ?",
    )
    .bind(ftsQuery, Math.min(Math.max(limit, 1), 100))
    .all<{
      entity_id: string;
      entity_type: string;
      name: string;
      rank: number;
    }>();

  return result.results.flatMap((row) =>
    SEARCHABLE_ENTITY_TYPES.has(row.entity_type)
      ? [
          {
            entityId: row.entity_id,
            entityType: row.entity_type as SearchResult["entityType"],
            name: row.name,
            rank: row.rank,
          },
        ]
      : [],
  );
}

/** Statements future writers can include in the same D1 batch as entity changes. */
export function getSearchIndexSyncStatements(
  d1: D1Database,
  entityId: EntityId,
): D1PreparedStatement[] {
  return [
    d1.prepare("DELETE FROM search_index WHERE entity_id = ?").bind(entityId),
    d1
      .prepare(
        `INSERT INTO search_index (name, aliases, summary, entity_id, entity_type)
       SELECT record.name, COALESCE((SELECT group_concat(alias, ' ') FROM aliases WHERE entity_id = entities.id), ''), record.summary, entities.id, entities.entity_type
       FROM entities
       INNER JOIN (
         SELECT id, name, summary FROM people
         UNION ALL SELECT id, name, description AS summary FROM titans
         UNION ALL SELECT id, name, summary FROM events
         UNION ALL SELECT id, name, description AS summary FROM locations
         UNION ALL SELECT id, name, description AS summary FROM factions
       ) AS record ON record.id = entities.id
       WHERE entities.id = ?`,
      )
      .bind(entityId),
  ];
}

/** Rebuilds one derived FTS row without modifying authoritative entity data. */
export async function syncSearchIndex(
  db: Database,
  entityId: EntityId,
): Promise<void> {
  await db.$client.batch(getSearchIndexSyncStatements(db.$client, entityId));
}
