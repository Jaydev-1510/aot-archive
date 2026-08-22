import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import type { Database } from "../index";
import {
  entities,
  events,
  people,
  relationships,
  relationshipTypes,
  sources,
} from "../schema";
import { getEntityNames } from "./entities";
import type { SourceRecord, TimelineEntry } from "./types";

export interface GetTimelineEventsOptions {
  type?: string;
  fromYear?: number;
  toYear?: number;
  search?: string;
  order?: "asc" | "desc";
}

export interface TimelineRelatedEntity {
  id: string;
  name: string;
  type: string;
  predicate: string;
}

export interface TimelineEventItem {
  id: string;
  name: string;
  slug: string;
  eventType: string | null;
  yearStart: number | null;
  yearEnd: number | null;
  datePrecision: string | null;
  summary: string | null;
  canonStatus: string | null;
  code: string;
  source: SourceRecord | null;
  participants: TimelineRelatedEntity[];
  locations: TimelineRelatedEntity[];
  factions: TimelineRelatedEntity[];
  titans: TimelineRelatedEntity[];
}

export interface TimelineGroup {
  yearLabel: string;
  yearNumeric: number | null;
  events: TimelineEventItem[];
}

export async function getTimelineEvents(
  db: Database,
  options: GetTimelineEventsOptions = {},
): Promise<{
  groups: TimelineGroup[];
  events: TimelineEventItem[];
  total: number;
  yearRange: { min: number | null; max: number | null };
}> {
  const { type, fromYear, toYear, search, order = "asc" } = options;

  const conditions = [];

  if (type && type !== "all") {
    conditions.push(eq(events.eventType, type as any));
  }
  if (fromYear !== undefined && !isNaN(fromYear)) {
    conditions.push(gte(events.yearStart, fromYear));
  }
  if (toYear !== undefined && !isNaN(toYear)) {
    conditions.push(lte(events.yearStart, toYear));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(events.name, `%${search.trim()}%`),
        like(events.summary, `%${search.trim()}%`),
        like(events.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByClauses =
    order === "desc"
      ? [
          sql`${events.yearStart} IS NULL`,
          desc(events.yearStart),
          desc(events.id),
        ]
      : [
          sql`${events.yearStart} IS NULL`,
          asc(events.yearStart),
          asc(events.id),
        ];

  const [eventRows, minMaxRes] = await Promise.all([
    db
      .select({ event: events, source: sources })
      .from(events)
      .leftJoin(sources, eq(events.sourceId, sources.id))
      .where(whereClause)
      .orderBy(...orderByClauses),
    db
      .select({
        minYear: sql<number>`min(${events.yearStart})`,
        maxYear: sql<number>`max(${events.yearStart})`,
      })
      .from(events),
  ]);

  const eventIds = eventRows.map((r) => r.event.id);

  // Fetch relationships for these events in batch if any events matched
  const relatedMap = new Map<
    string,
    {
      participants: TimelineRelatedEntity[];
      locations: TimelineRelatedEntity[];
      factions: TimelineRelatedEntity[];
      titans: TimelineRelatedEntity[];
    }
  >();

  for (const id of eventIds) {
    relatedMap.set(id, {
      participants: [],
      locations: [],
      factions: [],
      titans: [],
    });
  }

  if (eventIds.length > 0) {
    const [incomingRels, outgoingRels] = await Promise.all([
      db
        .select({
          rel: relationships,
          type: relationshipTypes,
          related: entities,
        })
        .from(relationships)
        .innerJoin(
          relationshipTypes,
          eq(relationships.predicate, relationshipTypes.slug),
        )
        .innerJoin(entities, eq(relationships.subjectId, entities.id))
        .where(inArray(relationships.objectId, eventIds)),
      db
        .select({
          rel: relationships,
          type: relationshipTypes,
          related: entities,
        })
        .from(relationships)
        .innerJoin(
          relationshipTypes,
          eq(relationships.predicate, relationshipTypes.slug),
        )
        .innerJoin(entities, eq(relationships.objectId, entities.id))
        .where(inArray(relationships.subjectId, eventIds)),
    ]);

    const allRelatedIds = [
      ...incomingRels.map((r) => r.related.id),
      ...outgoingRels.map((r) => r.related.id),
    ];
    const names = await getEntityNames(db, allRelatedIds);

    for (const { rel, type: relType, related } of incomingRels) {
      const target = relatedMap.get(rel.objectId);
      if (target) {
        const item: TimelineRelatedEntity = {
          id: related.id,
          name: names.get(related.id) || related.id,
          type: related.entityType,
          predicate: relType.slug,
        };
        if (related.entityType === "person") target.participants.push(item);
        else if (related.entityType === "faction") target.factions.push(item);
        else if (related.entityType === "location") target.locations.push(item);
        else if (related.entityType === "titan") target.titans.push(item);
      }
    }

    for (const { rel, type: relType, related } of outgoingRels) {
      const target = relatedMap.get(rel.subjectId);
      if (target) {
        const item: TimelineRelatedEntity = {
          id: related.id,
          name: names.get(related.id) || related.id,
          type: related.entityType,
          predicate: relType.slug,
        };
        if (related.entityType === "person") target.participants.push(item);
        else if (related.entityType === "faction") target.factions.push(item);
        else if (related.entityType === "location") target.locations.push(item);
        else if (related.entityType === "titan") target.titans.push(item);
      }
    }
  }

  const timelineItems: TimelineEventItem[] = eventRows.map(
    ({ event, source }) => {
      const rels = relatedMap.get(event.id) || {
        participants: [],
        locations: [],
        factions: [],
        titans: [],
      };
      return {
        id: event.id,
        name: event.name,
        slug: event.slug,
        eventType: event.eventType,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        datePrecision: event.datePrecision,
        summary: event.summary,
        canonStatus: event.canonStatus,
        code: event.id.replace("event/", "").slice(0, 4).toUpperCase(),
        source,
        participants: rels.participants,
        locations: rels.locations,
        factions: rels.factions,
        titans: rels.titans,
      };
    },
  );

  // Group events by chronological periods / years
  const groupMap = new Map<
    string,
    { label: string; numeric: number | null; events: TimelineEventItem[] }
  >();

  for (const item of timelineItems) {
    let groupKey: string;
    let groupLabel: string;
    let numeric: number | null = item.yearStart;

    if (item.yearStart === null) {
      groupKey = "unknown";
      groupLabel = "ANCIENT / UNCHRONICLED ERA";
    } else if (item.yearEnd !== null && item.yearEnd !== item.yearStart) {
      groupKey = `range_${item.yearStart}_${item.yearEnd}`;
      groupLabel = `YEAR ${item.yearStart} – ${item.yearEnd}`;
    } else {
      groupKey = `year_${item.yearStart}`;
      groupLabel =
        item.datePrecision === "approximate"
          ? `c. YEAR ${item.yearStart}`
          : `YEAR ${item.yearStart}`;
    }

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, { label: groupLabel, numeric, events: [] });
    }
    groupMap.get(groupKey)!.events.push(item);
  }

  const groups: TimelineGroup[] = Array.from(groupMap.values()).map((g) => ({
    yearLabel: g.label,
    yearNumeric: g.numeric,
    events: g.events,
  }));

  return {
    groups,
    events: timelineItems,
    total: timelineItems.length,
    yearRange: {
      min: minMaxRes[0]?.minYear ?? null,
      max: minMaxRes[0]?.maxYear ?? null,
    },
  };
}

/** Combines existing dated facts only; unknown start years sort last. */
export async function getTimeline(db: Database): Promise<TimelineEntry[]> {
  const [eventRows, personRows] = await Promise.all([
    db
      .select({ event: events, source: sources })
      .from(events)
      .leftJoin(sources, eq(events.sourceId, sources.id))
      .orderBy(asc(events.yearStart), asc(events.id)),
    db
      .select({ person: people, source: sources })
      .from(people)
      .leftJoin(sources, eq(people.primarySourceId, sources.id)),
  ]);

  const timeline: TimelineEntry[] = eventRows.map(({ event, source }) => ({
    kind: "event",
    id: event.id,
    name: event.name,
    yearStart: event.yearStart,
    yearEnd: event.yearEnd,
    datePrecision: event.datePrecision,
    source,
  }));

  for (const { person, source } of personRows) {
    if (person.birthYearStart !== null || person.birthYearEnd !== null) {
      timeline.push({
        kind: "birth",
        id: person.id,
        name: person.name,
        yearStart: person.birthYearStart,
        yearEnd: person.birthYearEnd,
        datePrecision: person.birthDatePrecision,
        source,
      });
    }
    if (person.deathYearStart !== null || person.deathYearEnd !== null) {
      timeline.push({
        kind: "death",
        id: person.id,
        name: person.name,
        yearStart: person.deathYearStart,
        yearEnd: person.deathYearEnd,
        datePrecision: person.deathDatePrecision,
        source,
      });
    }
  }

  return timeline.sort((left, right) => {
    if (left.yearStart === null && right.yearStart === null)
      return left.name.localeCompare(right.name);
    if (left.yearStart === null) return 1;
    if (right.yearStart === null) return -1;
    return (
      left.yearStart - right.yearStart || left.name.localeCompare(right.name)
    );
  });
}
