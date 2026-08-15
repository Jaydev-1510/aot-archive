import { asc, eq } from "drizzle-orm";
import type { Database } from "../index";
import { aliases, people, sources } from "../schema";
import { getRelationshipsForEntity } from "./relationships";
import { getTitanHoldersForPerson } from "./titans";
import type {
  AliasRecord,
  EntityId,
  PersonDetail,
  PersonWithSource,
} from "./types";

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
// done with this too or not
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
