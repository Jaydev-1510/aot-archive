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
  return terms.map((term) => `"${term.replaceAll('"', '""')}"*`).join(" AND ");
}

/** Queries the existing FTS5 projection through the same Worker D1 binding. */
export async function searchArchive(
  db: Database,
  query: string,
  limit = 20,
): Promise<SearchResult[]> {
  const cleanQuery = query.trim().replace(/\s+/g, " ");
  if (!cleanQuery) return [];

  const ftsQuery = toFtsQuery(cleanQuery);
  if (!ftsQuery) return [];

  const terms = cleanQuery.split(" ");
  const isMultiToken = terms.length > 1;

  const binds: any[] = [
    ftsQuery,
    cleanQuery,
    `% ${cleanQuery} %`,
    `${cleanQuery}%`,
    `% ${cleanQuery}%`,
    `%${cleanQuery}%`,
  ];

  let tokenAllName = "";
  let tokenAnyName = "";
  let tokenAnyAlias = "";

  if (isMultiToken) {
    const allNameChecks = terms.map((term) => {
      binds.push(`%${term}%`);
      return `name COLLATE NOCASE LIKE ?${binds.length}`;
    });
    tokenAllName = `WHEN ${allNameChecks.join(" AND ")} THEN 750`;
    tokenAnyName = `WHEN ${allNameChecks.join(" OR ")} THEN 250`;

    const anyAliasChecks = terms.map(
      (_, i) =>
        `aliases COLLATE NOCASE LIKE ?${binds.length - terms.length + i + 1}`,
    );
    tokenAnyAlias = `WHEN ${anyAliasChecks.join(" OR ")} THEN 150`;
  } else {
    tokenAnyName = `WHEN name COLLATE NOCASE LIKE ?6 THEN 250`;
    tokenAnyAlias = `WHEN aliases COLLATE NOCASE LIKE ?6 THEN 150`;
  }

  const sql = `
    SELECT 
      entity_id, 
      entity_type, 
      name, 
      bm25(search_index, 10.0, 5.0, 1.0) AS fts_rank,
      (
        CASE
          WHEN name COLLATE NOCASE = ?2 THEN 1000
          WHEN ' ' || aliases || ' ' COLLATE NOCASE LIKE ?3 THEN 950
          WHEN ' ' || name || ' ' COLLATE NOCASE LIKE ?3 THEN 800
          ${tokenAllName}
          WHEN name COLLATE NOCASE LIKE ?4 THEN 650
          WHEN ' ' || aliases COLLATE NOCASE LIKE ?5 THEN 550
          WHEN aliases COLLATE NOCASE LIKE ?6 THEN 400
          ${tokenAnyName}
          ${tokenAnyAlias}
          ELSE 50
        END
      ) AS deterministic_score
    FROM search_index 
    WHERE search_index MATCH ?1 
    ORDER BY deterministic_score DESC, fts_rank ASC, name ASC 
    LIMIT ?${binds.length + 1}
  `;

  binds.push(Math.min(Math.max(limit, 1), 100));

  const result = await db.$client
    .prepare(sql)
    .bind(...binds)
    .all<{
      entity_id: string;
      entity_type: string;
      name: string;
      fts_rank: number;
    }>();

  return result.results.flatMap((row) =>
    SEARCHABLE_ENTITY_TYPES.has(row.entity_type)
      ? [
          {
            entityId: row.entity_id,
            entityType: row.entity_type as SearchResult["entityType"],
            name: row.name,
            rank: row.fts_rank,
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
