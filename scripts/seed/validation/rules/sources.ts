/**
 * Section 5: Sources. Key uniqueness already lives in ids.ts (same
 * bucket as the other seed keys). This file covers structural sanity of
 * each source record itself.
 */

import type { SeedDataset } from "../../types";
import type { ValidationError } from "../errors";

export function validateSources(dataset: SeedDataset, errors: ValidationError[]): void {
  (dataset.sources ?? []).forEach((source, index) => {
    const identifier = `sources[${index}] (${source.key})`;

    if (source.title.trim().length === 0) {
      errors.push({ section: "sources", identifier, message: "title must not be empty." });
    }

    for (const field of ["chapter", "episode", "volume", "page"] as const) {
      const value = source[field];
      if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
        errors.push({
          section: "sources",
          identifier,
          message: `${field} must be a non-negative integer; got ${value}.`,
        });
      }
    }
  });
}
