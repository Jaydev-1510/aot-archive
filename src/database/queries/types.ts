import type {
  abilities,
  aliases,
  entities,
  events,
  factions,
  families,
  locations,
  objects,
  people,
  relationshipTypes,
  relationships,
  sources,
  titanHolders,
  titans,
} from "../schema";

/** Entity IDs are stable text primary keys; route parameters enter as strings. */
export type EntityId = string;

export type EntityRecord = typeof entities.$inferSelect;
export type PersonRecord = typeof people.$inferSelect;
export type TitanRecord = typeof titans.$inferSelect;
export type FamilyRecord = typeof families.$inferSelect;
export type FactionRecord = typeof factions.$inferSelect;
export type LocationRecord = typeof locations.$inferSelect;
export type EventRecord = typeof events.$inferSelect;
export type ObjectRecord = typeof objects.$inferSelect;
export type AliasRecord = typeof aliases.$inferSelect;
export type SourceRecord = typeof sources.$inferSelect;
export type AbilityRecord = typeof abilities.$inferSelect;
export type RelationshipRecord = typeof relationships.$inferSelect;
export type RelationshipTypeRecord = typeof relationshipTypes.$inferSelect;
export type TitanHolderRecord = typeof titanHolders.$inferSelect;

export interface PersonWithSource {
  person: PersonRecord;
  primarySource: SourceRecord | null;
}

export interface EntityRelationship {
  relationship: RelationshipRecord;
  relationshipType: RelationshipTypeRecord;
  source: SourceRecord | null;
  direction: "outgoing" | "incoming";
  /** Predicate as seen from the requested entity, after inverse resolution. */
  predicate: string;
  relatedEntity: EntityRecord;
  /** The display name of the related entity, resolved across supertypes. */
  relatedEntityName: string;
}

export interface TitanAbility {
  ability: AbilityRecord;
  notes: string | null;
}

export interface TitanHolder {
  holder: TitanHolderRecord;
  titan: TitanRecord;
  person: PersonRecord;
  predecessor: PersonRecord | null;
  successor: PersonRecord | null;
  source: SourceRecord | null;
}

export interface PersonDetail extends PersonWithSource {
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
  titanHolders: TitanHolder[];
}

export type TimelineEntry =
  | {
      kind: "event";
      id: string;
      name: string;
      yearStart: number | null;
      yearEnd: number | null;
      datePrecision: EventRecord["datePrecision"];
      source: SourceRecord | null;
    }
  | {
      kind: "birth" | "death";
      id: string;
      name: string;
      yearStart: number | null;
      yearEnd: number | null;
      datePrecision: PersonRecord["birthDatePrecision"];
      source: SourceRecord | null;
    };

export interface SearchResult {
  entityId: string;
  entityType: "person" | "titan" | "event" | "location" | "faction";
  name: string;
  /** Lower FTS5 BM25 scores rank before higher scores. */
  rank: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  metadata?: Record<string, any>;
}

export interface GraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TitanDetail {
  titan: TitanRecord;
  aliases: AliasRecord[];
  abilities: TitanAbility[];
  holders: TitanHolder[];
  currentHolder: TitanHolder | null;
  relationships: EntityRelationship[];
}

export interface EventDetail {
  event: EventRecord;
  primarySource: SourceRecord | null;
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
}

export interface LocationDetail {
  location: LocationRecord;
  parentLocation: LocationRecord | null;
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
}

export interface FactionDetail {
  faction: FactionRecord;
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
}

export interface ObjectDetail {
  object: ObjectRecord;
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
}

export interface FamilyDetail {
  family: FamilyRecord;
  aliases: AliasRecord[];
  relationships: EntityRelationship[];
}

export interface AbilityDetail {
  ability: AbilityRecord;
  titans: Array<{ titan: TitanRecord; notes: string | null }>;
}
