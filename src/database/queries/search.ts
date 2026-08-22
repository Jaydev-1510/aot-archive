import type { Database } from "../index";
import type { EntityId, SearchResult } from "./types";

const SEARCHABLE_ENTITY_TYPES = new Set([
  "person",
  "titan",
  "event",
  "location",
  "faction",
  "object",
  "ability",
  "family",
]);

export type SearchFilterType =
  | "all"
  | "people"
  | "titans"
  | "events"
  | "locations"
  | "factions"
  | "objects"
  | "abilities"
  | "families";

function toFtsQuery(query: string): string | null {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return null;
  return terms.map((term) => `"${term.replaceAll('"', '""')}"*`).join(" AND ");
}

const TYPE_MAPPING: Record<SearchFilterType, string | null> = {
  all: null,
  people: "person",
  titans: "titan",
  events: "event",
  locations: "location",
  factions: "faction",
  objects: "object",
  abilities: "ability",
  families: "family",
};

export async function searchArchive(
  db: Database,
  query: string,
  limit = 20,
  typeFilter: SearchFilterType = "all",
  page = 1,
): Promise<{ results: SearchResult[]; total: number; hasMore: boolean }> {
  const cleanQuery = query.trim().replace(/\s+/g, " ");
  if (!cleanQuery) return { results: [], total: 0, hasMore: false };

  const ftsQuery = toFtsQuery(cleanQuery);
  if (!ftsQuery) return { results: [], total: 0, hasMore: false };

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

  let typeCondition = "";
  if (typeFilter !== "all" && TYPE_MAPPING[typeFilter]) {
    typeCondition = `AND entity_type = ?${binds.length + 1}`;
    binds.push(TYPE_MAPPING[typeFilter]);
  }

  const offset = (Math.max(1, page) - 1) * limit;

  // We need to run two queries: one for total count, one for paginated results.
  // Using a CTE simplifies this or we just run them sequentially or in a batch.
  // Since it's D1, we can batch them.

  `;

  `;

  const resultsBinds = [...binds, Math.min(Math.max(limit, 1), 100), offset];

  // Create count binds that only include what the count query needs:
  // countSql uses ?1 and optionally the typeFilter which is the last element in `binds`.
  // Wait, D1 bindings are positional based on array order. The countSql only uses ?1 and the type filter.
  // We can just pass the full `binds` array since SQLite ignores extra bindings if they aren't referenced,
  // but to be safe we should just build a proper count bind array.
  const countBinds = [ftsQuery];
  if (typeCondition) {
    countBinds.push(TYPE_MAPPING[typeFilter]!);
    // Fix the placeholder for typeCondition in count query: it needs to be ?2
    typeCondition = `AND entity_type = ?2`;
  }

  // Refix typeCondition for results query because we mutated it
  let resultTypeCondition = "";
  if (typeFilter !== "all" && TYPE_MAPPING[typeFilter]) {
    resultTypeCondition = `AND entity_type = ?${binds.length}`; // type filter is already at the end of binds array
  }

  const finalCountSql = `
    SELECT COUNT(*) as total
    FROM search_index 
    WHERE search_index MATCH ?1 ${typeCondition}
  `;

  const finalResultsSql = `
    SELECT 
      entity_id, 
      entity_type, 
      name, 
      summary,
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
    WHERE search_index MATCH ?1 ${resultTypeCondition}
    ORDER BY deterministic_score DESC, fts_rank ASC, name ASC 
    LIMIT ?${binds.length + 1} OFFSET ?${binds.length + 2}
  `;

  const batch = await db.$client.batch([
    db.$client.prepare(finalCountSql).bind(...countBinds),
    db.$client.prepare(finalResultsSql).bind(...resultsBinds),
  ]);

  const total = (batch[0].results[0] as { total: number }).total;
  const rows = batch[1].results as {
    entity_id: string;
    entity_type: string;
    name: string;
    summary: string | null;
    fts_rank: number;
  }[];

  const results = rows.flatMap((row) =>
    SEARCHABLE_ENTITY_TYPES.has(row.entity_type)
      ? [
          {
            entityId: row.entity_id,
            entityType: row.entity_type as SearchResult["entityType"],
            name: row.name,
            summary: row.summary,
            rank: row.fts_rank,
          },
        ]
      : [],
  );

  return {
    results,
    total,
    hasMore: offset + results.length < total,
  };
}

export function getSearchIndexSyncStatements(
  d1: any, // using any to avoid type issues if D1Database is not imported properly
  entityId: EntityId,
): any[] {
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
         UNION ALL SELECT id, name, description AS summary FROM objects
         UNION ALL SELECT id, name, description AS summary FROM abilities
         UNION ALL SELECT id, name, description AS summary FROM families
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
