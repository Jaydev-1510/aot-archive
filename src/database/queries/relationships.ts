import { eq } from "drizzle-orm";
import type { Database } from "../index";
import { entities, relationshipTypes, relationships, sources } from "../schema";
import type { EntityId, EntityRelationship } from "./types";

function resolveRelationship(
  row: Omit<EntityRelationship, "direction" | "predicate">,
  direction: "outgoing" | "incoming",
): EntityRelationship {
  const { relationshipType } = row;
  const predicate =
    direction === "outgoing" || relationshipType.isSymmetric
      ? relationshipType.slug
      : (relationshipType.inverseSlug ?? relationshipType.slug);

  return { ...row, direction, predicate };
}

/**
 * Returns every stored relationship touching an entity. Incoming edges expose
 * their inverse predicate (when defined), without mirrored database rows.
 */
export async function getRelationshipsForEntity(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  const [outgoing, incoming] = await Promise.all([
    db
      .select({
        relationship: relationships,
        relationshipType: relationshipTypes,
        source: sources,
        relatedEntity: entities,
      })
      .from(relationships)
      .innerJoin(
        relationshipTypes,
        eq(relationships.predicate, relationshipTypes.slug),
      )
      .leftJoin(sources, eq(relationships.sourceId, sources.id))
      .innerJoin(entities, eq(relationships.objectId, entities.id))
      .where(eq(relationships.subjectId, id)),
    db
      .select({
        relationship: relationships,
        relationshipType: relationshipTypes,
        source: sources,
        relatedEntity: entities,
      })
      .from(relationships)
      .innerJoin(
        relationshipTypes,
        eq(relationships.predicate, relationshipTypes.slug),
      )
      .leftJoin(sources, eq(relationships.sourceId, sources.id))
      .innerJoin(entities, eq(relationships.subjectId, entities.id))
      .where(eq(relationships.objectId, id)),
  ]);

  return [
    ...outgoing.map((row) => resolveRelationship(row, "outgoing")),
    ...incoming.map((row) => resolveRelationship(row, "incoming")),
  ].sort((left, right) => left.relationship.id - right.relationship.id);
}

export async function getParents(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.direction === "incoming" &&
      relationship.relationship.predicate === "parent-of" &&
      relationship.relatedEntity.entityType === "person",
  );
}

export async function getChildren(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.direction === "outgoing" &&
      relationship.relationship.predicate === "parent-of" &&
      relationship.relatedEntity.entityType === "person",
  );
}

export async function getSpouses(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.relationship.predicate === "spouse-of" &&
      relationship.relatedEntity.entityType === "person",
  );
}

export async function getFactionMemberships(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.direction === "outgoing" &&
      relationship.relationship.predicate === "member-of" &&
      relationship.relatedEntity.entityType === "faction",
  );
}

export async function getSiblings(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.relationship.predicate === "sibling-of" &&
      relationship.relatedEntity.entityType === "person",
  );
}

export async function getEventParticipation(
  db: Database,
  id: EntityId,
): Promise<EntityRelationship[]> {
  return (await getRelationshipsForEntity(db, id)).filter(
    (relationship) =>
      relationship.relationship.predicate === "participant-in" &&
      relationship.relatedEntity.entityType === "event",
  );
}

/** Alias for consumers that need all normalized graph neighbours. */
export const getRelatedEntities = getRelationshipsForEntity;
