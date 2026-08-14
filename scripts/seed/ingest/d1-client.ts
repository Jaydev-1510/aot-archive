/**
 * Thin wrapper around `wrangler d1 execute`. See sql.ts's file header for
 * why this exists instead of a Drizzle/D1Database client: no such
 * binding is available to a standalone script, for local OR remote.
 *
 * Both `runSqlFile` and `queryJson` accept the D1 database NAME (as
 * declared in wrangler.jsonc) and a `target: "local" | "remote"` — never
 * a hardcoded database id, account id, or credential, per your
 * instruction. Remote credentials are whatever `wrangler` itself is
 * already authenticated with; this file never touches them directly.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

export type D1Target = "local" | "remote";

function run(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["wrangler", ...args], { shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 1 }));
  });
}

/** Executes a whole SQL file against the target database. Throws on failure. */
export async function runSqlFile(databaseName: string, target: D1Target, sql: string): Promise<void> {
  const tmpFile = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "aot-seed-")), "ingest.sql");
  await fs.writeFile(tmpFile, sql, "utf8");

  const args = ["d1", "execute", databaseName, `--${target}`, `--file=${tmpFile}`, "--yes"];
  const result = await run(args);

  if (result.code !== 0) {
    throw new Error(`wrangler d1 execute failed (exit ${result.code}):\n${result.stderr || result.stdout}`);
  }
}

/** Runs a single read-only query and returns the parsed row array. Used for verification, never for writes. */
export async function queryJson<T = Record<string, unknown>>(
  databaseName: string,
  target: D1Target,
  sql: string,
): Promise<T[]> {
  const args = ["d1", "execute", databaseName, `--${target}`, `--command=${sql}`, "--json"];
  const result = await run(args);

  if (result.code !== 0) {
    throw new Error(`wrangler d1 execute (query) failed (exit ${result.code}):\n${result.stderr || result.stdout}`);
  }

  const parsed = JSON.parse(result.stdout) as Array<{ results: T[] }>;
  return parsed[0]?.results ?? [];
}
