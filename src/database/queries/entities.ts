import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import type { Database } from "../index";
import {
  abilities,
  entities,
  events,
  factions,
  families,
  locations,
  objects,
  people,
  sources,
  titanAbilities,
  titans,
} from "../schema";
import { getAliasesForEntity } from "./people";
import { getRelationshipsForEntity } from "./relationships";
import type {
  AbilityDetail,
  AbilityRecord,
  EntityId,
  EntityRecord,
  EventDetail,
  EventRecord,
  FactionDetail,
  FactionRecord,
  FamilyDetail,
  FamilyRecord,
  LocationDetail,
  LocationRecord,
  ObjectDetail,
  ObjectRecord,
} from "./types";

/** Returns the entity-supertype row for any stable entity ID. */
export async function getEntity(
  db: Database,
  id: EntityId,
): Promise<EntityRecord | null> {
  return (
    (await db.select().from(entities).where(eq(entities.id, id)).limit(1))[0] ??
    null
  );
}

export interface GetEventsOptions {
  eventType?: string;
  search?: string;
  sort?: "year" | "name" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getEvents(
  db: Database,
  options: GetEventsOptions = {},
): Promise<{ items: EventRecord[]; total: number }> {
  const {
    eventType,
    search,
    sort = "year",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (eventType && eventType !== "all") {
    conditions.push(eq(events.eventType, eventType as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(events.name, `%${search.trim()}%`),
        like(events.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "name") {
    orderByColumn = order === "desc" ? desc(events.name) : asc(events.name);
  } else if (sort === "id") {
    orderByColumn = order === "desc" ? desc(events.id) : asc(events.id);
  } else {
    orderByColumn =
      order === "desc" ? desc(events.yearStart) : asc(events.yearStart);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(whereClause),
    db
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getEvent(
  db: Database,
  id: EntityId,
): Promise<EventRecord | null> {
  return (
    (await db.select().from(events).where(eq(events.id, id)).limit(1))[0] ??
    null
  );
}

export async function getEventDetail(
  db: Database,
  id: EntityId,
): Promise<EventDetail | null> {
  const row = (
    await db
      .select({ event: events, primarySource: sources })
      .from(events)
      .leftJoin(sources, eq(events.sourceId, sources.id))
      .where(eq(events.id, id))
      .limit(1)
  )[0];

  if (!row) return null;

  const [aliases, relationships] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
  ]);

  return {
    event: row.event,
    primarySource: row.primarySource,
    aliases,
    relationships,
  };
}

export interface GetLocationsOptions {
  locationType?: string;
  search?: string;
  sort?: "name" | "type" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getLocations(
  db: Database,
  options: GetLocationsOptions = {},
): Promise<{ items: LocationRecord[]; total: number }> {
  const {
    locationType,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (locationType && locationType !== "all") {
    conditions.push(eq(locations.locationType, locationType as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(locations.name, `%${search.trim()}%`),
        like(locations.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "type") {
    orderByColumn =
      order === "desc"
        ? desc(locations.locationType)
        : asc(locations.locationType);
  } else if (sort === "id") {
    orderByColumn = order === "desc" ? desc(locations.id) : asc(locations.id);
  } else {
    orderByColumn =
      order === "desc" ? desc(locations.name) : asc(locations.name);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(locations)
      .where(whereClause),
    db
      .select()
      .from(locations)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getLocation(
  db: Database,
  id: EntityId,
): Promise<LocationRecord | null> {
  return (
    (
      await db.select().from(locations).where(eq(locations.id, id)).limit(1)
    )[0] ?? null
  );
}

export async function getLocationDetail(
  db: Database,
  id: EntityId,
): Promise<LocationDetail | null> {
  const location = await getLocation(db, id);
  if (!location) return null;

  const parentLocation = location.parentLocationId
    ? await getLocation(db, location.parentLocationId)
    : null;

  const [aliases, relationships] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
  ]);

  return {
    location,
    parentLocation,
    aliases,
    relationships,
  };
}

export interface GetFactionsOptions {
  factionType?: string;
  search?: string;
  sort?: "name" | "type" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getFactions(
  db: Database,
  options: GetFactionsOptions = {},
): Promise<{ items: FactionRecord[]; total: number }> {
  const {
    factionType,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (factionType && factionType !== "all") {
    conditions.push(eq(factions.factionType, factionType as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(factions.name, `%${search.trim()}%`),
        like(factions.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "type") {
    orderByColumn =
      order === "desc" ? desc(factions.factionType) : asc(factions.factionType);
  } else if (sort === "id") {
    orderByColumn = order === "desc" ? desc(factions.id) : asc(factions.id);
  } else {
    orderByColumn = order === "desc" ? desc(factions.name) : asc(factions.name);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(factions)
      .where(whereClause),
    db
      .select()
      .from(factions)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getFaction(
  db: Database,
  id: EntityId,
): Promise<FactionRecord | null> {
  return (
    (await db.select().from(factions).where(eq(factions.id, id)).limit(1))[0] ??
    null
  );
}

export async function getFactionDetail(
  db: Database,
  id: EntityId,
): Promise<FactionDetail | null> {
  const faction = await getFaction(db, id);
  if (!faction) return null;

  const [aliases, relationships] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
  ]);

  return {
    faction,
    aliases,
    relationships,
  };
}

export interface GetObjectsOptions {
  objectType?: string;
  search?: string;
  sort?: "name" | "type" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getObjects(
  db: Database,
  options: GetObjectsOptions = {},
): Promise<{ items: ObjectRecord[]; total: number }> {
  const {
    objectType,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (objectType && objectType !== "all") {
    conditions.push(eq(objects.objectType, objectType as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(objects.name, `%${search.trim()}%`),
        like(objects.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "type") {
    orderByColumn =
      order === "desc" ? desc(objects.objectType) : asc(objects.objectType);
  } else if (sort === "id") {
    orderByColumn = order === "desc" ? desc(objects.id) : asc(objects.id);
  } else {
    orderByColumn = order === "desc" ? desc(objects.name) : asc(objects.name);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(objects)
      .where(whereClause),
    db
      .select()
      .from(objects)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getObject(
  db: Database,
  id: EntityId,
): Promise<ObjectRecord | null> {
  return (
    (await db.select().from(objects).where(eq(objects.id, id)).limit(1))[0] ??
    null
  );
}

export async function getObjectDetail(
  db: Database,
  id: EntityId,
): Promise<ObjectDetail | null> {
  const object = await getObject(db, id);
  if (!object) return null;

  const [aliases, relationships] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
  ]);

  return {
    object,
    aliases,
    relationships,
  };
}

export interface GetAbilitiesOptions {
  category?: string;
  search?: string;
  sort?: "name" | "category";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getAbilities(
  db: Database,
  options: GetAbilitiesOptions = {},
): Promise<{ items: AbilityRecord[]; total: number }> {
  const {
    category,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (category && category !== "all") {
    conditions.push(eq(abilities.category, category as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(abilities.name, `%${search.trim()}%`),
        like(abilities.description, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "category") {
    orderByColumn =
      order === "desc" ? desc(abilities.category) : asc(abilities.category);
  } else {
    orderByColumn =
      order === "desc" ? desc(abilities.name) : asc(abilities.name);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(abilities)
      .where(whereClause),
    db
      .select()
      .from(abilities)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getAbility(
  db: Database,
  id: number | string,
): Promise<AbilityRecord | null> {
  const numId = typeof id === "number" ? id : parseInt(id, 10);
  if (isNaN(numId)) {
    return (
      (
        await db
          .select()
          .from(abilities)
          .where(eq(abilities.name, String(id)))
          .limit(1)
      )[0] ?? null
    );
  }
  return (
    (
      await db.select().from(abilities).where(eq(abilities.id, numId)).limit(1)
    )[0] ?? null
  );
}

export async function getAbilityDetail(
  db: Database,
  id: number | string,
): Promise<AbilityDetail | null> {
  const ability = await getAbility(db, id);
  if (!ability) return null;

  const titansWithAbility = await db
    .select({
      titan: titans,
      notes: titanAbilities.notes,
    })
    .from(titanAbilities)
    .innerJoin(titans, eq(titanAbilities.titanId, titans.id))
    .where(eq(titanAbilities.abilityId, ability.id))
    .orderBy(asc(titans.name));

  return {
    ability,
    titans: titansWithAbility,
  };
}

export interface GetFamiliesOptions {
  isRoyal?: boolean;
  search?: string;
  sort?: "name";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getFamilies(
  db: Database,
  options: GetFamiliesOptions = {},
): Promise<{ items: FamilyRecord[]; total: number }> {
  const {
    isRoyal,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (isRoyal !== undefined) {
    conditions.push(eq(families.isRoyalBloodline, isRoyal));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(families.name, `%${search.trim()}%`),
        like(families.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn =
    sort === "name"
      ? order === "desc"
        ? desc(families.name)
        : asc(families.name)
      : order === "desc"
        ? desc(families.id)
        : asc(families.id);

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(families)
      .where(whereClause),
    db
      .select()
      .from(families)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getFamily(
  db: Database,
  id: EntityId,
): Promise<FamilyRecord | null> {
  return (
    (await db.select().from(families).where(eq(families.id, id)).limit(1))[0] ??
    null
  );
}

export async function getFamilyDetail(
  db: Database,
  id: EntityId,
): Promise<FamilyDetail | null> {
  const family = await getFamily(db, id);
  if (!family) return null;

  const [aliases, relationships] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
  ]);

  return {
    family,
    aliases,
    relationships,
  };
}

export async function getArchiveStats(db: Database) {
  const [
    peopleCount,
    titansCount,
    eventsCount,
    locationsCount,
    factionsCount,
    objectsCount,
    abilitiesCount,
    familiesCount,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(people),
    db.select({ count: sql<number>`count(*)` }).from(titans),
    db.select({ count: sql<number>`count(*)` }).from(events),
    db.select({ count: sql<number>`count(*)` }).from(locations),
    db.select({ count: sql<number>`count(*)` }).from(factions),
    db.select({ count: sql<number>`count(*)` }).from(objects),
    db.select({ count: sql<number>`count(*)` }).from(abilities),
    db.select({ count: sql<number>`count(*)` }).from(families),
  ]);

  return {
    people: Number(peopleCount[0]?.count ?? 0),
    titans: Number(titansCount[0]?.count ?? 0),
    events: Number(eventsCount[0]?.count ?? 0),
    locations: Number(locationsCount[0]?.count ?? 0),
    factions: Number(factionsCount[0]?.count ?? 0),
    objects: Number(objectsCount[0]?.count ?? 0),
    abilities: Number(abilitiesCount[0]?.count ?? 0),
    families: Number(familiesCount[0]?.count ?? 0),
  };
}

/** Efficiently looks up names for a heterogeneous list of entity IDs. */
export async function getEntityNames(
  db: Database,
  ids: EntityId[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const uniqueIds = Array.from(new Set(ids));

  const results = await Promise.all([
    db
      .select({ id: people.id, name: people.name })
      .from(people)
      .where(inArray(people.id, uniqueIds)),
    db
      .select({ id: titans.id, name: titans.name })
      .from(titans)
      .where(inArray(titans.id, uniqueIds)),
    db
      .select({ id: events.id, name: events.name })
      .from(events)
      .where(inArray(events.id, uniqueIds)),
    db
      .select({ id: locations.id, name: locations.name })
      .from(locations)
      .where(inArray(locations.id, uniqueIds)),
    db
      .select({ id: factions.id, name: factions.name })
      .from(factions)
      .where(inArray(factions.id, uniqueIds)),
    db
      .select({ id: families.id, name: families.name })
      .from(families)
      .where(inArray(families.id, uniqueIds)),
    db
      .select({ id: objects.id, name: objects.name })
      .from(objects)
      .where(inArray(objects.id, uniqueIds)),
  ]);

  const flatResults = results.flat();
  return new Map(flatResults.map((r) => [r.id, r.name]));
}
