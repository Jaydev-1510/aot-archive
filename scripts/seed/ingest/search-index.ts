/**
 * search_index — Phase 11 / Phase 8 FTS5 indexing statements.
 *
 * Appends full search index rebuild statements to the seed ingestion plan,
 * keeping the FTS5 virtual table synchronized with canonical people, titans,
 * events, locations, and factions, along with their consolidated aliases.
 */

export function buildSearchIndexStatements(): string[] {
  return [
    `DELETE FROM search_index;`,
    `INSERT INTO search_index (name, aliases, summary, entity_id, entity_type)
SELECT record.name, COALESCE((SELECT group_concat(alias, ' ') FROM aliases WHERE entity_id = entities.id), ''), record.summary, entities.id, entities.entity_type
FROM entities
INNER JOIN (
  SELECT id, name, summary FROM people
  UNION ALL SELECT id, name, description AS summary FROM titans
  UNION ALL SELECT id, name, summary FROM events
  UNION ALL SELECT id, name, description AS summary FROM locations
  UNION ALL SELECT id, name, description AS summary FROM factions
) AS record ON record.id = entities.id;`
  ];
}
