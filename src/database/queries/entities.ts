import { eq } from "drizzle-orm";
import type { Database } from "../index";
import {
  entities,
  events,
  factions,
  families,
  locations,
  objects,
} from "../schema";
import type {
  EntityId,
  EntityRecord,
  EventRecord,
  FactionRecord,
  FamilyRecord,
  LocationRecord,
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

export async function getFamily(
  db: Database,
  id: EntityId,
): Promise<FamilyRecord | null> {
  return (
    (await db.select().from(families).where(eq(families.id, id)).limit(1))[0] ??
    null
  );
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

export async function getEvent(
  db: Database,
  id: EntityId,
): Promise<EventRecord | null> {
  return (
    (await db.select().from(events).where(eq(events.id, id)).limit(1))[0] ??
    null
  );
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
