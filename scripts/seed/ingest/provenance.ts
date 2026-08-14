/**
 * sources / media — categorized as IMMUTABLE REFERENCE DATA (see the
 * "Decisions" section of the handoff for the full reasoning): neither
 * has a DB column tied to its seed key, so there's no reliable way to
 * detect "this is the same record with an edited field" versus "this is
 * a genuinely different record that happens to share some values." We
 * therefore insert-if-no-natural-equality-match and never auto-update —
 * silently overwriting on a coincidental partial match would be worse
 * than leaving a stale field for a human to fix. A future migration
 * adding a real `seed_key` unique column to both tables would remove
 * this limitation; that's a schema decision for you to make, not one
 * this ingestion layer makes unilaterally.
 */

import type { SeedSource, SeedMedia } from "../types";
import { sqlValue } from "./sql";
import { registerSources, registerMedia, sourceIdentityWhere, sourceIdSubquery, mediaIdentityWhere } from "./identity";

export function buildSourceStatements(sources: SeedSource[]): string[] {
  registerSources(sources);
  return sources.map((s) => {
    const cols = ["title", "source_type", "chapter", "episode", "volume", "page", "url", "notes"];
    const vals = [s.title, s.sourceType, s.chapter, s.episode, s.volume, s.page, s.url, s.notes].map(sqlValue);
    return `INSERT INTO sources (${cols.join(", ")}) SELECT ${vals.join(", ")} WHERE NOT EXISTS (SELECT 1 FROM sources WHERE ${sourceIdentityWhere(s.key)});`;
  });
}

export function buildMediaStatements(media: SeedMedia[]): string[] {
  registerMedia(media);
  return media.map((m) => {
    const cols = ["media_type", "url", "caption", "source_id", "license_notes"];
    const vals = [
      m.mediaType,
      m.url,
      m.caption,
      m.source ? { raw: sourceIdSubquery(m.source) } : null,
      m.licenseNotes,
    ].map(sqlValue);
    return `INSERT INTO media (${cols.join(", ")}) SELECT ${vals.join(", ")} WHERE NOT EXISTS (SELECT 1 FROM media WHERE ${mediaIdentityWhere(m.key)});`;
  });
}
