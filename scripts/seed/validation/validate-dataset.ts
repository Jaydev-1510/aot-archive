/**
 * Runs every validation rule against a SeedDataset and returns every
 * error found — never throws, never stops early. This is the single
 * entry point validate.ts (the CLI) calls.
 */

import type { SeedDataset } from "../types";
import { buildContext } from "./context";
import type { ValidationError } from "./errors";
import { validateIds } from "./rules/ids";
import { validateEntities } from "./rules/entities";
import { validateRelationshipTypes } from "./rules/relationship-types";
import { validateDates } from "./rules/dates";
import { validateSources } from "./rules/sources";
import { validateAbilities } from "./rules/abilities";
import { validateAliases } from "./rules/aliases";
import { validateMedia } from "./rules/media";
import { validateRelationships } from "./rules/relationships";
import { validateTitanHolders } from "./rules/titan-holders";

export function validateDataset(dataset: SeedDataset): ValidationError[] {
  const errors: ValidationError[] = [];
  const context = buildContext(dataset);

  // Structural / ID-layer checks first — if these fail badly (e.g.
  // massively malformed data), the reference checks below will just
  // produce a lot of "does not exist" noise built on top of already-
  // reported problems. We still run everything (no short-circuiting,
  // per your requirement), but this ordering puts the most foundational
  // errors first in the collected list.
  validateIds(dataset, errors);
  validateEntities(dataset, context, errors);
  validateRelationshipTypes(dataset, errors);
  validateDates(dataset, errors);

  validateSources(dataset, errors);
  validateAbilities(dataset, context, errors);
  validateAliases(dataset, errors);
  validateMedia(dataset, context, errors);

  validateRelationships(dataset, context, errors);
  validateTitanHolders(dataset, context, errors);

  return errors;
}
