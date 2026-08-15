import { asc, eq } from "drizzle-orm";
import type { Database } from "../index";
import { events, people, sources } from "../schema";
import type { TimelineEntry } from "./types";

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
