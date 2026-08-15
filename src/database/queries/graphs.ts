import { eq, or, and } from "drizzle-orm";
import type { Database } from "../index";
import { families, people, relationships, relationshipTypes, titans } from "../schema";
import { getRelationshipsForEntity } from "./relationships";
import { getTitanHolders } from "./titans";
import type { EntityId, GraphResult, GraphNode, GraphEdge } from "./types";

/**
 * Traverses family and lineage relationships recursively from a root person.
 * Returns a GraphResult containing nodes (people and families) and edges (predicates).
 */
export async function getBloodlineGraph(
  db: Database,
  rootPersonId: EntityId,
): Promise<GraphResult> {
  // 1. Resolve root person first
  const rootPerson = await db.select().from(people).where(eq(people.id, rootPersonId)).limit(1);
  if (rootPerson.length === 0) {
    return { nodes: [], edges: [] };
  }

  // 2. Fetch all family relationships from the database.
  const familyEdges = await db
    .select({
      relationship: relationships,
      relType: relationshipTypes,
    })
    .from(relationships)
    .innerJoin(relationshipTypes, eq(relationships.predicate, relationshipTypes.slug))
    .where(
      or(
        eq(relationshipTypes.category, "family"),
        and(eq(relationships.predicate, "member-of"), eq(relationships.objectType, "family"))
      )
    );

  // Build helper maps of family relationships
  const parentToChildren = new Map<string, string[]>();
  const childToParents = new Map<string, string[]>();
  const siblingsMap = new Map<string, string[]>();
  const spousesMap = new Map<string, string[]>();
  const edgesList: Array<{ subject: string; object: string; predicate: string; qualifier?: string | null }> = [];

  for (const row of familyEdges) {
    const rel = row.relationship;
    const pred = rel.predicate;
    const subj = rel.subjectId;
    const obj = rel.objectId;
    const qual = rel.qualifier;

    edgesList.push({ subject: subj, object: obj, predicate: pred, qualifier: qual });

    if (pred === "parent-of" || pred === "adopted-parent-of") {
      if (!parentToChildren.has(subj)) parentToChildren.set(subj, []);
      parentToChildren.get(subj)!.push(obj);

      if (!childToParents.has(obj)) childToParents.set(obj, []);
      childToParents.get(obj)!.push(subj);
    } else if (pred === "child-of" || pred === "adopted-child-of") {
      if (!parentToChildren.has(obj)) parentToChildren.set(obj, []);
      parentToChildren.get(obj)!.push(subj);

      if (!childToParents.has(subj)) childToParents.set(subj, []);
      childToParents.get(subj)!.push(obj);
    } else if (pred === "spouse-of") {
      if (!spousesMap.has(subj)) spousesMap.set(subj, []);
      spousesMap.get(subj)!.push(obj);

      if (!spousesMap.has(obj)) spousesMap.set(obj, []);
      spousesMap.get(obj)!.push(subj);
    } else if (pred === "sibling-of") {
      if (!siblingsMap.has(subj)) siblingsMap.set(subj, []);
      siblingsMap.get(subj)!.push(obj);

      if (!siblingsMap.has(obj)) siblingsMap.set(obj, []);
      siblingsMap.get(obj)!.push(subj);
    }
  }

  // Traverse ancestors (upwards)
  const ancestorsQueue = [rootPersonId];
  const ancestorsVisited = new Set<string>([rootPersonId]);
  const bloodlineMembers = new Set<string>([rootPersonId]);

  while (ancestorsQueue.length > 0) {
    const current = ancestorsQueue.shift()!;
    const parents = childToParents.get(current) ?? [];
    for (const parent of parents) {
      if (!ancestorsVisited.has(parent)) {
        ancestorsVisited.add(parent);
        bloodlineMembers.add(parent);
        ancestorsQueue.push(parent);
      }
    }
  }

  // Traverse descendants (downwards)
  const descendantsQueue = [rootPersonId];
  const descendantsVisited = new Set<string>([rootPersonId]);
  while (descendantsQueue.length > 0) {
    const current = descendantsQueue.shift()!;
    const children = parentToChildren.get(current) ?? [];
    for (const child of children) {
      if (!descendantsVisited.has(child)) {
        descendantsVisited.add(child);
        bloodlineMembers.add(child);
        descendantsQueue.push(child);
      }
    }
  }

  // For each bloodline member, add their spouses and siblings
  const allPeopleInGraph = new Set<string>(bloodlineMembers);
  for (const member of bloodlineMembers) {
    const spouses = spousesMap.get(member) ?? [];
    for (const spouse of spouses) {
      allPeopleInGraph.add(spouse);
    }
    const siblings = siblingsMap.get(member) ?? [];
    for (const sibling of siblings) {
      allPeopleInGraph.add(sibling);
    }
  }

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  // Fetch names/metadata for all people in the graph
  const peopleRecords = await db
    .select()
    .from(people)
    .where(or(...Array.from(allPeopleInGraph).map((id) => eq(people.id, id))));

  for (const person of peopleRecords) {
    nodesMap.set(person.id, {
      id: person.id,
      label: person.name,
      type: "person",
      metadata: {
        gender: person.gender,
        status: person.status,
        birthYear: person.birthYearStart,
        deathYear: person.deathYearStart,
      },
    });
  }

  // Collect all families connected to the people in the graph
  const allFamiliesInGraph = new Set<string>();
  const memberOfEdges: Array<{ subject: string; object: string; predicate: string; qualifier?: string | null }> = [];

  for (const row of familyEdges) {
    const rel = row.relationship;
    if (rel.predicate === "member-of") {
      if (allPeopleInGraph.has(rel.subjectId)) {
        allFamiliesInGraph.add(rel.objectId);
        memberOfEdges.push({
          subject: rel.subjectId,
          object: rel.objectId,
          predicate: rel.predicate,
          qualifier: rel.qualifier,
        });
      }
    }
  }

  // Fetch family names/metadata
  if (allFamiliesInGraph.size > 0) {
    const familiesRecords = await db
      .select()
      .from(families)
      .where(or(...Array.from(allFamiliesInGraph).map((id) => eq(families.id, id))));

    for (const family of familiesRecords) {
      nodesMap.set(family.id, {
        id: family.id,
        label: family.name,
        type: "family",
        metadata: {
          isRoyalBloodline: family.isRoyalBloodline,
          description: family.description,
        },
      });
    }

    for (const edge of memberOfEdges) {
      const edgeId = `${edge.subject}::${edge.predicate}::${edge.object}`;
      edgesMap.set(edgeId, {
        source: edge.subject,
        target: edge.object,
        label: edge.predicate,
        metadata: {
          qualifier: edge.qualifier ?? undefined,
        },
      });
    }
  }

  // Collect all family edges connecting people who are in the graph
  for (const edge of edgesList) {
    if (allPeopleInGraph.has(edge.subject) && allPeopleInGraph.has(edge.object)) {
      const edgeId = `${edge.subject}::${edge.predicate}::${edge.object}`;
      const reverseEdgeId = `${edge.object}::${edge.predicate}::${edge.subject}`;

      if (edge.predicate === "spouse-of" || edge.predicate === "sibling-of") {
        if (edgesMap.has(edgeId) || edgesMap.has(reverseEdgeId)) continue;
      }

      edgesMap.set(edgeId, {
        source: edge.subject,
        target: edge.object,
        label: edge.predicate,
        metadata: {
          qualifier: edge.qualifier ?? undefined,
        },
      });
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}

/**
 * Builds a succession graph of shifter holders for a given Titan.
 * Returns a GraphResult containing nodes (titan and shifters) and inheritance edges.
 */
export async function getTitanInheritanceGraph(
  db: Database,
  titanId: EntityId,
): Promise<GraphResult> {
  const titanRecord = await db.select().from(titans).where(eq(titans.id, titanId)).limit(1);
  if (titanRecord.length === 0) {
    return { nodes: [], edges: [] };
  }

  const holders = await getTitanHolders(db, titanId);
  if (holders.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  // Add Titan node
  nodesMap.set(titanId, {
    id: titanId,
    label: titanRecord[0].name,
    type: "titan",
    metadata: {
      titanClass: titanRecord[0].titanClass,
    },
  });

  // Add shifter people as nodes
  for (const h of holders) {
    const person = h.person;
    nodesMap.set(person.id, {
      id: person.id,
      label: person.name,
      type: "person",
      metadata: {
        gender: person.gender,
        status: person.status,
      },
    });

    // Add "holder-of" edge from person to Titan
    const edgeId = `${person.id}::holder-of::${titanId}`;
    edgesMap.set(edgeId, {
      source: person.id,
      target: titanId,
      label: "holder-of",
      metadata: {
        holderOrder: h.holder.holderOrder ?? undefined,
        isCurrent: h.holder.isCurrent,
        periodStartYear: h.holder.periodStartYear ?? undefined,
        periodEndYear: h.holder.periodEndYear ?? undefined,
        inheritanceMethod: h.holder.inheritanceMethod ?? undefined,
      },
    });
  }

  // Add succession edges between shifters
  for (const h of holders) {
    if (h.predecessor) {
      const predId = h.predecessor.id;
      const succId = h.person.id;
      const edgeId = `${predId}::inherited-by::${succId}`;
      edgesMap.set(edgeId, {
        source: predId,
        target: succId,
        label: "inherited-by",
        metadata: {
          inheritanceMethod: h.holder.inheritanceMethod ?? undefined,
        },
      });
    }
    if (h.successor) {
      const predId = h.person.id;
      const succId = h.successor.id;
      const edgeId = `${predId}::inherited-by::${succId}`;
      edgesMap.set(edgeId, {
        source: predId,
        target: succId,
        label: "inherited-by",
        metadata: {
          inheritanceMethod: h.holder.inheritanceMethod ?? undefined,
        },
      });
    }
  }

  // Connect sequentially ordered holders if no predecessor/successor edge exists
  for (let i = 0; i < holders.length - 1; i++) {
    const currentHolder = holders[i];
    const nextHolder = holders[i + 1];
    if (
      currentHolder.holder.holderOrder !== null &&
      nextHolder.holder.holderOrder !== null &&
      nextHolder.holder.holderOrder === currentHolder.holder.holderOrder + 1
    ) {
      const edgeId = `${currentHolder.person.id}::inherited-by::${nextHolder.person.id}`;
      if (!edgesMap.has(edgeId)) {
        edgesMap.set(edgeId, {
          source: currentHolder.person.id,
          target: nextHolder.person.id,
          label: "inherited-by",
          metadata: {
            note: "Inferred sequential succession",
          },
        });
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}
