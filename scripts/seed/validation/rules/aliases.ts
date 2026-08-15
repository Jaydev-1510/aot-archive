/**
 * Section 7: Aliases.
 *
 * Aliases are embedded on each entity's own seed object (see common.ts's
 * file header for why), so "referenced entity exists" is trivially true
 * by construction — there is no separate entityId field an author could
 * get wrong. What's left to check: the alias text itself isn't empty,
 * and no entity declares the same (alias, aliasType, language) combo
 * twice. Cross-entity duplicate aliases (two different characters
 * sharing a nickname) are NOT flagged — nothing in the schema makes
 * aliases globally unique, so that's expected, not an error.
 */

import type { SeedDataset } from "../../types";
import type { ValidationError } from "../errors";

type EntityArrayKey =
  | "people"
  | "titans"
  | "events"
  | "locations"
  | "factions"
  | "objects"
  | "families";

const ENTITY_ARRAY_KEYS: EntityArrayKey[] = [
  "people",
  "titans",
  "events",
  "locations",
  "factions",
  "objects",
  "families",
];

export function validateAliases(
  dataset: SeedDataset,
  errors: ValidationError[],
): void {
  for (const key of ENTITY_ARRAY_KEYS) {
    const records = dataset[key] ?? [];
    records.forEach((record, recordIndex) => {
      const { id, aliases } = record as {
        id: string;
        aliases?: Array<{
          alias: string;
          aliasType: string;
          language?: string;
        }>;
      };
      if (!aliases || aliases.length === 0) return;

      const seen = new Map<string, number>();
      aliases.forEach((alias, aliasIndex) => {
        const identifier = `${key}[${recordIndex}].aliases[${aliasIndex}] (${id})`;

        if (alias.alias.trim().length === 0) {
          errors.push({
            section: "aliases",
            identifier,
            message: "alias text must not be empty.",
          });
        }

        const dedupeKey = `${alias.alias}\u0001${alias.aliasType}\u0001${alias.language ?? ""}`;
        const priorIndex = seen.get(dedupeKey);
        if (priorIndex !== undefined) {
          errors.push({
            section: "aliases",
            identifier,
            message: `Duplicate alias ("${alias.alias}", ${alias.aliasType}) already declared at aliases[${priorIndex}] for this entity.`,
          });
        } else {
          seen.set(dedupeKey, aliasIndex);
        }
      });
    });
  }
}
