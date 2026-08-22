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
  UNION ALL SELECT id, name, description AS summary FROM objects
  UNION ALL SELECT id, name, description AS summary FROM abilities
  UNION ALL SELECT id, name, description AS summary FROM families
) AS record ON record.id = entities.id;`,
  ];
}
