import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import type { Database } from "../index";
import {
  abilities,
  people,
  sources,
  titanAbilities,
  titanHolders,
  titans,
} from "../schema";
import { getAliasesForEntity } from "./people";
import { getRelationshipsForEntity } from "./relationships";
import type {
  EntityId,
  TitanAbility,
  TitanDetail,
  TitanHolder,
  TitanRecord,
} from "./types";

export interface GetTitansOptions {
  titanClass?: string;
  search?: string;
  sort?: "name" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getTitans(
  db: Database,
  options: GetTitansOptions = {},
): Promise<{ items: TitanRecord[]; total: number }> {
  const {
    titanClass,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (titanClass && titanClass !== "all") {
    conditions.push(eq(titans.titanClass, titanClass as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(titans.name, `%${search.trim()}%`),
        like(titans.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn =
    sort === "id"
      ? order === "desc"
        ? desc(titans.id)
        : asc(titans.id)
      : order === "desc"
        ? desc(titans.name)
        : asc(titans.name);

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(titans)
      .where(whereClause),
    db
      .select()
      .from(titans)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getTitan(
  db: Database,
  id: EntityId,
): Promise<TitanRecord | null> {
  return (
    (await db.select().from(titans).where(eq(titans.id, id)).limit(1))[0] ??
    null
  );
}

export async function getTitanAbilities(
  db: Database,
  id: EntityId,
): Promise<TitanAbility[]> {
  return db
    .select({ ability: abilities, notes: titanAbilities.notes })
    .from(titanAbilities)
    .innerJoin(abilities, eq(titanAbilities.abilityId, abilities.id))
    .where(eq(titanAbilities.titanId, id))
    .orderBy(asc(abilities.name));
}

/** Uses holder_order when known and places unknown positions last. */
export async function getTitanHolders(
  db: Database,
  id: EntityId,
): Promise<TitanHolder[]> {
  const predecessor = alias(people, "predecessor");
  const successor = alias(people, "successor");

  return db
    .select({
      holder: titanHolders,
      titan: titans,
      person: people,
      predecessor,
      successor,
      source: sources,
    })
    .from(titanHolders)
    .innerJoin(titans, eq(titanHolders.titanId, titans.id))
    .innerJoin(people, eq(titanHolders.personId, people.id))
    .leftJoin(predecessor, eq(titanHolders.predecessorPersonId, predecessor.id))
    .leftJoin(successor, eq(titanHolders.successorPersonId, successor.id))
    .leftJoin(sources, eq(titanHolders.sourceId, sources.id))
    .where(eq(titanHolders.titanId, id))
    .orderBy(
      sql`${titanHolders.holderOrder} IS NULL`,
      asc(titanHolders.holderOrder),
      asc(titanHolders.id),
    );
}

export async function getCurrentTitanHolder(
  db: Database,
  id: EntityId,
): Promise<TitanHolder | null> {
  const predecessor = alias(people, "predecessor");
  const successor = alias(people, "successor");

  return (
    (
      await db
        .select({
          holder: titanHolders,
          titan: titans,
          person: people,
          predecessor,
          successor,
          source: sources,
        })
        .from(titanHolders)
        .innerJoin(titans, eq(titanHolders.titanId, titans.id))
        .innerJoin(people, eq(titanHolders.personId, people.id))
        .leftJoin(
          predecessor,
          eq(titanHolders.predecessorPersonId, predecessor.id),
        )
        .leftJoin(successor, eq(titanHolders.successorPersonId, successor.id))
        .leftJoin(sources, eq(titanHolders.sourceId, sources.id))
        .where(
          and(eq(titanHolders.titanId, id), eq(titanHolders.isCurrent, true)),
        )
        .limit(1)
    )[0] ?? null
  );
}

export async function getTitanHoldersForPerson(
  db: Database,
  id: EntityId,
): Promise<TitanHolder[]> {
  const predecessor = alias(people, "predecessor");
  const successor = alias(people, "successor");

  return db
    .select({
      holder: titanHolders,
      titan: titans,
      person: people,
      predecessor,
      successor,
      source: sources,
    })
    .from(titanHolders)
    .innerJoin(titans, eq(titanHolders.titanId, titans.id))
    .innerJoin(people, eq(titanHolders.personId, people.id))
    .leftJoin(predecessor, eq(titanHolders.predecessorPersonId, predecessor.id))
    .leftJoin(successor, eq(titanHolders.successorPersonId, successor.id))
    .leftJoin(sources, eq(titanHolders.sourceId, sources.id))
    .where(eq(titanHolders.personId, id))
    .orderBy(
      sql`${titanHolders.holderOrder} IS NULL`,
      asc(titanHolders.holderOrder),
      asc(titanHolders.id),
    );
}

export async function getTitanDetail(
  db: Database,
  id: EntityId,
): Promise<TitanDetail | null> {
  const titan = await getTitan(db, id);
  if (!titan) return null;

  const [aliases, abilities, holders, currentHolder, relationships] =
    await Promise.all([
      getAliasesForEntity(db, id),
      getTitanAbilities(db, id),
      getTitanHolders(db, id),
      getCurrentTitanHolder(db, id),
      getRelationshipsForEntity(db, id),
    ]);

  return {
    titan,
    aliases,
    abilities,
    holders,
    currentHolder,
    relationships,
  };
}
