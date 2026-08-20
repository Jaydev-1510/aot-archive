import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import type { Database } from "../index";
import { aliases, people, sources } from "../schema";
import { getRelationshipsForEntity } from "./relationships";
import { getTitanHoldersForPerson } from "./titans";
import type {
  AliasRecord,
  EntityId,
  PersonDetail,
  PersonRecord,
  PersonWithSource,
} from "./types";

export interface GetPeopleOptions {
  status?: string;
  gender?: string;
  species?: string;
  search?: string;
  sort?: "name" | "birth" | "id";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getPeople(
  db: Database,
  options: GetPeopleOptions = {},
): Promise<{ items: PersonRecord[]; total: number }> {
  const {
    status,
    gender,
    species,
    search,
    sort = "name",
    order = "asc",
    limit = 50,
    offset = 0,
  } = options;

  const conditions = [];

  if (status && status !== "all") {
    conditions.push(eq(people.status, status as any));
  }
  if (gender && gender !== "all") {
    conditions.push(eq(people.gender, gender as any));
  }
  if (species && species !== "all") {
    conditions.push(eq(people.species, species as any));
  }
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(people.name, `%${search.trim()}%`),
        like(people.japaneseName, `%${search.trim()}%`),
        like(people.id, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByColumn;
  if (sort === "birth") {
    orderByColumn =
      order === "desc"
        ? desc(people.birthYearStart)
        : asc(people.birthYearStart);
  } else if (sort === "id") {
    orderByColumn = order === "desc" ? desc(people.id) : asc(people.id);
  } else {
    orderByColumn = order === "desc" ? desc(people.name) : asc(people.name);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(people)
      .where(whereClause),
    db
      .select()
      .from(people)
      .where(whereClause)
      .orderBy(orderByColumn)
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(totalRes[0]?.count ?? 0);
  return { items, total };
}

export async function getPerson(
  db: Database,
  id: EntityId,
): Promise<PersonWithSource | null> {
  return (
    (
      await db
        .select({ person: people, primarySource: sources })
        .from(people)
        .leftJoin(sources, eq(people.primarySourceId, sources.id))
        .where(eq(people.id, id))
        .limit(1)
    )[0] ?? null
  );
}

export async function getAliasesForEntity(
  db: Database,
  id: EntityId,
): Promise<AliasRecord[]> {
  return db
    .select()
    .from(aliases)
    .where(eq(aliases.entityId, id))
    .orderBy(asc(aliases.alias));
}

/** A composed, page-ready view that keeps each underlying table authoritative. */
export async function getPersonDetail(
  db: Database,
  id: EntityId,
): Promise<PersonDetail | null> {
  const person = await getPerson(db, id);
  if (!person) return null;

  const [personAliases, relationships, titanHolders] = await Promise.all([
    getAliasesForEntity(db, id),
    getRelationshipsForEntity(db, id),
    getTitanHoldersForPerson(db, id),
  ]);

  return { ...person, aliases: personAliases, relationships, titanHolders };
}
