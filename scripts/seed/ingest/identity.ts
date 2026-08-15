/**
 * `sources` and `media` have no natural DB-level unique key tied to their
 * seed key (see ids.ts's file header — this is a known, flagged
 * limitation, not an oversight). Every place that needs to identify "the
 * source/media this seed record refers to" — their own dedup-on-insert,
 * and every other table's subquery resolution of a source/media
 * reference — uses the SAME natural-equality condition, defined once
 * here, so the two can never drift out of sync with each other.
 */

import type { SeedSource, SeedMedia } from "../types";
import { sqlValue } from "./sql";

const sourcesByKey = new Map<string, SeedSource>();
const mediaByKey = new Map<string, SeedMedia>();

export function registerSources(sources: SeedSource[]): void {
  sourcesByKey.clear();
  for (const s of sources) sourcesByKey.set(s.key, s);
}

export function registerMedia(media: SeedMedia[]): void {
  mediaByKey.clear();
  for (const m of media) mediaByKey.set(m.key, m);
}

/** SQL boolean expression matching the `sources` row for a given seed key. Assumes the seed key is registered via registerSources first. */
export function sourceIdentityWhere(seedKey: string): string {
  const source = sourcesByKey.get(seedKey);
  if (!source) {
    throw new Error(
      `Unknown source seed key "${seedKey}" — this should have been caught by validation.`,
    );
  }
  return [
    `title IS ${sqlValue(source.title)}`,
    `source_type IS ${sqlValue(source.sourceType)}`,
    `chapter IS ${sqlValue(source.chapter)}`,
    `episode IS ${sqlValue(source.episode)}`,
    `volume IS ${sqlValue(source.volume)}`,
    `page IS ${sqlValue(source.page)}`,
  ].join(" AND ");
}

/** A correlated subquery resolving a source seed key to its real `sources.id`. */
export function sourceIdSubquery(seedKey: string): string {
  return `(SELECT id FROM sources WHERE ${sourceIdentityWhere(seedKey)})`;
}

/** SQL boolean expression matching the `media` row for a given seed key. */
export function mediaIdentityWhere(seedKey: string): string {
  const item = mediaByKey.get(seedKey);
  if (!item) {
    throw new Error(
      `Unknown media seed key "${seedKey}" — this should have been caught by validation.`,
    );
  }
  return `url IS ${sqlValue(item.url)}`;
}

/** A correlated subquery resolving a media seed key to its real `media.id`. */
export function mediaIdSubquery(seedKey: string): string {
  return `(SELECT id FROM media WHERE ${mediaIdentityWhere(seedKey)})`;
}
