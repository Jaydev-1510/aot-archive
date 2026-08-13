/**
 * Section 8: Media. `media.key` uniqueness already lives in ids.ts. This
 * file covers: media.source resolving to a declared source key, every
 * entity's embedded media[] resolving to a declared media key, and
 * duplicate media links on the same entity — which mirrors the real DB
 * constraint `UNIQUE(entity_id, media_id)` on media_links, so we catch
 * it before D1 does.
 */

import type { SeedDataset } from "../../types";
import type { ValidationContext } from "../context";
import type { ValidationError } from "../errors";

type EntityArrayKey = "people" | "titans" | "events" | "locations" | "factions" | "objects" | "families";

const ENTITY_ARRAY_KEYS: EntityArrayKey[] = [
  "people",
  "titans",
  "events",
  "locations",
  "factions",
  "objects",
  "families",
];

export function validateMedia(
  dataset: SeedDataset,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  (dataset.media ?? []).forEach((mediaItem, index) => {
    if (mediaItem.source !== undefined && !context.sourceKeys.has(mediaItem.source)) {
      errors.push({
        section: "media",
        identifier: `media[${index}] (${mediaItem.key})`,
        message: `source "${mediaItem.source}" does not match any declared source key.`,
      });
    }
  });

  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    records.forEach((record, recordIndex) => {
      const { id, media } = record as {
        id: string;
        media?: Array<{ mediaKey: string; isPrimary?: boolean; displayOrder?: number }>;
      };
      if (!media || media.length === 0) return;

      const seenMediaKeys = new Set<string>();
      media.forEach((link, linkIndex) => {
        const identifier = `${key}[${recordIndex}].media[${linkIndex}] (${id})`;

        if (!context.mediaKeys.has(link.mediaKey)) {
          errors.push({
            section: "media",
            identifier,
            message: `mediaKey "${link.mediaKey}" does not match any declared media key.`,
          });
        }

        if (seenMediaKeys.has(link.mediaKey)) {
          errors.push({
            section: "media",
            identifier,
            message: `Duplicate media link to "${link.mediaKey}" on this entity — media_links has UNIQUE(entity_id, media_id).`,
          });
        } else {
          seenMediaKeys.add(link.mediaKey);
        }

        if (link.displayOrder !== undefined && (!Number.isInteger(link.displayOrder) || link.displayOrder < 0)) {
          errors.push({
            section: "media",
            identifier,
            message: `displayOrder must be a non-negative integer; got ${link.displayOrder}.`,
          });
        }
      });
    });
  }
}
