/**
 * Assembles the full ordered SQL statement list for a validated
 * SeedDataset. This is the pipeline's "Build dependency/resolution
 * context" + "Insert/update records" + "Resolve generated integer IDs" +
 * "Insert dependent records" steps combined — because every ID
 * resolution here happens via correlated SQL subquery rather than a
 * JS-side lookup (see sql.ts's file header), there's no separate
 * "resolution" data structure to build; ordering the statements
 * correctly IS the resolution strategy.
 *
 * ORDER, AND WHY:
 *   1. sources — no dependencies
 *   2. relationship_types — self-referential only (two internal phases)
 *   3. abilities — no dependencies
 *   4. entities + subtypes — locations self-referential (two internal
 *                             phases); people/events optionally reference
 *                             sources (already inserted in step 1)
 *   5. titan_abilities — needs titans (step 4) + abilities (step 3)
 *   6. media — optionally references sources (step 1)
 *   7. aliases — needs entities (step 4)
 *   8. media_links — needs entities (step 4) + media (step 6)
 *   9. relationships — needs entities (step 4) +
 *                                  relationship_types (step 2) +
 *                                  sources (step 1)
 *  10. titan_holders — needs people/titans (step 4) +
 *                                   sources (step 1)
 */

import type { SeedDataset } from "../types";
import { buildSourceStatements, buildMediaStatements } from "./provenance";
import { buildRelationshipTypeStatements, buildAbilityStatements } from "./relationship-types";
import {
  buildPeopleStatements,
  buildTitanStatements,
  buildFamilyStatements,
  buildEventStatements,
  buildLocationStatements,
  buildFactionStatements,
  buildObjectStatements,
} from "./entities";
import { buildTitanAbilityStatements } from "./titan-abilities";
import { buildAliasStatements, buildMediaLinkStatements } from "./aliases-and-media-links";
import { buildRelationshipStatements } from "./relationships";
import { buildTitanHolderStatements } from "./titan-holders";

export interface IngestionPlan {
  statements: string[];
  /** Statement count per logical phase, for --dry-run reporting. */
  phaseCounts: Record<string, number>;
}

export function buildIngestionPlan(dataset: SeedDataset): IngestionPlan {
  const phases: Array<[string, string[]]> = [
    ["sources", buildSourceStatements(dataset.sources ?? [])],
    ["relationshipTypes", buildRelationshipTypeStatements(dataset.relationshipTypes ?? [])],
    ["abilities", buildAbilityStatements(dataset.abilities ?? [])],
    ["people", buildPeopleStatements(dataset.people ?? [])],
    ["titans", buildTitanStatements(dataset.titans ?? [])],
    ["families", buildFamilyStatements(dataset.families ?? [])],
    ["events", buildEventStatements(dataset.events ?? [])],
    ["locations", buildLocationStatements(dataset.locations ?? [])],
    ["factions", buildFactionStatements(dataset.factions ?? [])],
    ["objects", buildObjectStatements(dataset.objects ?? [])],
    ["titanAbilities", buildTitanAbilityStatements(dataset.titans ?? [])],
    ["media", buildMediaStatements(dataset.media ?? [])],
    ["aliases", buildAliasStatements(dataset)],
    ["mediaLinks", buildMediaLinkStatements(dataset)],
    ["relationships", buildRelationshipStatements(dataset.relationships ?? [])],
    ["titanHolders", buildTitanHolderStatements(dataset.titanHolders ?? [])],
  ];

  const statements: string[] = [];
  const phaseCounts: Record<string, number> = {};
  for (const [name, phaseStatements] of phases) {
    phaseCounts[name] = phaseStatements.length;
    statements.push(...phaseStatements);
  }

  return { statements, phaseCounts };
}
