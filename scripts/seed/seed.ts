#!/usr/bin/env bun
/**
 * bun scripts/seed/seed.ts [--dry-run] [--remote] [--db=<name>]
 *
 * Defaults to LOCAL and to A DRY RUN'S OPPOSITE (i.e. it WILL write) —
 * per your instruction that a destructive/default-remote command must
 * never be accidental, --remote must be passed explicitly. There is no
 * default database name guess: --db is required, or AOT_D1_DATABASE env
 * var, so this file never hardcodes your database name either.
 */

import { loadSeedDataset } from "./load-dataset";
import { validateDataset } from "./validation/validate-dataset";
import { buildIngestionPlan } from "./ingest/build-plan";
import { runSqlFile, queryJson, type D1Target } from "./ingest/d1-client";
import type { ValidationError } from "./validation/errors";

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const target: D1Target = argv.includes("--remote") ? "remote" : "local";
  const dbArg = argv.find((a) => a.startsWith("--db="));
  const databaseName = dbArg
    ? dbArg.slice("--db=".length)
    : process.env.AOT_D1_DATABASE;
  return { dryRun, target, databaseName };
}

function printValidationErrors(errors: readonly ValidationError[]): void {
  for (const error of errors) {
    console.error(`\n[${error.section}]`);
    console.error(error.identifier);
    console.error(`Error: ${error.message}`);
  }
}

async function main(): Promise<void> {
  const { dryRun, target, databaseName } = parseArgs(process.argv.slice(2));

  if (!databaseName) {
    console.error(
      "No database name given. Pass --db=<name> or set AOT_D1_DATABASE.",
    );
    process.exit(1);
  }

  if (target === "remote") {
    console.log(
      `\u26a0\ufe0f  Target: REMOTE database "${databaseName}" — this WILL modify production data${dryRun ? " if not for --dry-run" : ""}.`,
    );
  } else {
    console.log(`Target: local database "${databaseName}".`);
  }

  console.log("Loading seed dataset...");
  const { dataset, fileCount } = await loadSeedDataset();
  if (fileCount === 0) {
    console.log(
      "(no files found under scripts/seed/data/ — nothing to ingest)",
    );
  }

  console.log("Validating...");
  const errors = validateDataset(dataset);
  if (errors.length > 0) {
    console.error(
      `\u2717 Validation failed (${errors.length} error${errors.length === 1 ? "" : "s"}) — aborting before any database access.`,
    );
    printValidationErrors(errors);
    process.exit(1);
  }
  console.log("\u2713 Validation passed");

  const plan = buildIngestionPlan(dataset);
  console.log("\nPlan:");
  for (const [phase, count] of Object.entries(plan.phaseCounts)) {
    if (count > 0)
      console.log(`  ${phase}: ${count} statement${count === 1 ? "" : "s"}`);
  }
  console.log(
    `  total: ${plan.statements.length} statement${plan.statements.length === 1 ? "" : "s"}`,
  );

  if (dryRun) {
    console.log("\n\u2713 Dry run complete — no database was modified.");
    return;
  }

  if (plan.statements.length === 0) {
    console.log("\nNothing to ingest.");
    return;
  }

  console.log(`\nExecuting against ${target} database "${databaseName}"...`);
  const sql = plan.statements.join("\n");
  await runSqlFile(databaseName, target, sql);
  console.log("\u2713 Ingestion complete.");

  console.log("\nVerifying resulting state...");
  const tables = [
    "entities",
    "people",
    "titans",
    "relationships",
    "titan_holders",
    "sources",
    "abilities",
    "media",
  ];
  for (const table of tables) {
    const rows = await queryJson<{ n: number }>(
      databaseName,
      target,
      `SELECT COUNT(*) as n FROM ${table}`,
    );
    console.log(`  ${table}: ${rows[0]?.n ?? 0}`);
  }

  const orphanCurrentHolders = await queryJson<{
    titan_id: string;
    current_count: number;
  }>(
    databaseName,
    target,
    "SELECT titan_id, COUNT(*) as current_count FROM titan_holders WHERE is_current = 1 GROUP BY titan_id HAVING COUNT(*) > 1",
  );
  if (orphanCurrentHolders.length > 0) {
    console.error(
      "\u2717 VERIFICATION FAILURE: multiple current holders found for a titan (this should be impossible):",
    );
    console.error(orphanCurrentHolders);
    process.exit(1);
  }

  console.log("\u2713 Verification passed.");
}

main().catch((err) => {
  console.error("Seed ingestion crashed unexpectedly:");
  console.error(err);
  process.exit(1);
});
