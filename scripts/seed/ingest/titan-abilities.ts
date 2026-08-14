import type { SeedTitan } from "../types";
import { buildUpsertOnConflict, raw, sqlValue } from "./sql";

export function buildTitanAbilityStatements(titans: SeedTitan[]): string[] {
  const statements: string[] = [];
  for (const t of titans) {
    for (const entry of t.abilities ?? []) {
      statements.push(
        buildUpsertOnConflict(
          "titan_abilities",
          ["titan_id", "ability_id", "notes"],
          [t.id, raw(`(SELECT id FROM abilities WHERE name = ${sqlValue(entry.ability)})`), entry.notes],
          ["titan_id", "ability_id"],
          ["notes"],
        ),
      );
    }
  }
  return statements;
}
