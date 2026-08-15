/**
 * Discovers every seed data file under scripts/seed/data/, imports it,
 * and merges the results into one SeedDataset.
 *
 * Convention: each file exports a named `dataset: SeedDataset` (a
 * `default` export also works, for convenience). This directory is
 * currently EMPTY — no real AOT data has been added yet, per your
 * instruction — so today this loader returns `{}` and the validator
 * runs against an empty dataset, which is a legitimate (trivially valid)
 * thing to validate. That's intentional: `seed:validate` needs to be a
 * usable command from day one, not something that only works once real
 * data exists.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeSeedDatasets, type SeedDataset } from "./types";

const SEED_DATA_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
);

async function findSeedFiles(dir: string): Promise<string[]> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSeedFiles(full)));
    } else if (
      entry.isFile() &&
      /\.(ts|js)$/.test(entry.name) &&
      !entry.name.startsWith("_")
    ) {
      files.push(full);
    }
  }
  return files;
}

export async function loadSeedDataset(): Promise<{
  dataset: SeedDataset;
  fileCount: number;
}> {
  const files = await findSeedFiles(SEED_DATA_DIR);

  if (files.length === 0) {
    return { dataset: {}, fileCount: 0 };
  }

  const partials: SeedDataset[] = [];
  for (const file of files) {
    const mod = await import(file);
    const partial: SeedDataset | undefined = mod.dataset ?? mod.default;
    if (!partial) {
      throw new Error(
        `Seed file ${path.relative(process.cwd(), file)} does not export a \`dataset\` ` +
          `(or default) SeedDataset.`,
      );
    }
    partials.push(partial);
  }

  return { dataset: mergeSeedDatasets(...partials), fileCount: files.length };
}
