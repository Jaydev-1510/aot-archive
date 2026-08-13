#!/usr/bin/env bun
/**
 * bun run seed:validate
 *
 * Loads the canonical seed dataset, runs the full validation layer, and
 * reports every problem found. Never writes to D1 — this file has no
 * import of drizzle-orm/d1, wrangler, or any D1 binding, by design.
 */

import { loadSeedDataset } from "./load-dataset";
import { validateDataset } from "./validation/validate-dataset";
import type { ValidationError, ValidationSection } from "./validation/errors";
import type { SeedDataset } from "./types";

const SECTION_ORDER: ValidationSection[] = [
  "ids",
  "entities",
  "relationshipTypes",
  "dates",
  "sources",
  "abilities",
  "aliases",
  "media",
  "relationships",
  "titanHolders",
];

function countRecords(dataset: SeedDataset): string {
  const counts: Array<[string, number]> = [
    ["sources", dataset.sources?.length ?? 0],
    ["abilities", dataset.abilities?.length ?? 0],
    ["media", dataset.media?.length ?? 0],
    ["relationshipTypes", dataset.relationshipTypes?.length ?? 0],
    ["people", dataset.people?.length ?? 0],
    ["titans", dataset.titans?.length ?? 0],
    ["families", dataset.families?.length ?? 0],
    ["events", dataset.events?.length ?? 0],
    ["locations", dataset.locations?.length ?? 0],
    ["factions", dataset.factions?.length ?? 0],
    ["objects", dataset.objects?.length ?? 0],
    ["relationships", dataset.relationships?.length ?? 0],
    ["titanHolders", dataset.titanHolders?.length ?? 0],
  ];
  const nonZero = counts.filter(([, n]) => n > 0);
  if (nonZero.length === 0) return "0 records";
  return nonZero.map(([name, n]) => `${n} ${name}`).join(", ");
}

function printReport(errors: readonly ValidationError[]): void {
  for (const section of SECTION_ORDER) {
    const sectionErrors = errors.filter((e) => e.section === section);
    if (sectionErrors.length === 0) continue;

    console.error(`\n[${section}]`);
    for (const error of sectionErrors) {
      console.error(error.identifier);
      console.error(`Error: ${error.message}`);
      console.error("");
    }
  }
}

async function main(): Promise<void> {
  console.log("Loading seed dataset...");
  const { dataset, fileCount } = await loadSeedDataset();

  if (fileCount === 0) {
    console.log(`(no files found under scripts/seed/data/ — validating an empty dataset)`);
  }
  console.log(`\u2713 Loaded seed dataset (${countRecords(dataset)})`);

  const errors = validateDataset(dataset);

  if (errors.length === 0) {
    console.log("\u2713 IDs valid");
    console.log("\u2713 Entity references valid");
    console.log("\u2713 Relationships valid");
    console.log("\u2713 Titan holders valid");
    console.log("\u2713 Sources valid");
    console.log("\u2713 Media valid");
    console.log("\u2713 Dataset validation passed");
    process.exit(0);
  } else {
    console.error(`\u2717 Dataset validation failed (${errors.length} error${errors.length === 1 ? "" : "s"})`);
    printReport(errors);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Seed validation crashed unexpectedly:");
  console.error(err);
  process.exit(1);
});
