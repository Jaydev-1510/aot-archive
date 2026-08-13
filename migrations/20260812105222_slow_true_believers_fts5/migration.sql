CREATE VIRTUAL TABLE search_index USING fts5(
  name,
  aliases,
  summary,
  entity_id UNINDEXED,
  entity_type UNINDEXED,
  tokenize = 'porter unicode61'
);