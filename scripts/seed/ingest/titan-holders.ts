/**
 * titan_holders.
 *
 * WHY THE "CLEAR OTHER CURRENT HOLDERS" PASS EXISTS
 * ----------------------------------------------------
 * idx_titan_holders_one_current allows AT MOST one is_current=1 row per
 * titan. Section 4 validation already guarantees the SEED DATASET itself
 * never declares two holders of the same titan as current — but it can't
 * know what's already in the database from a PREVIOUS run. If a titan
 * transfers (the seed is updated so a different person is now current),
 * inserting/updating the new holder to is_current=1 while the old
 * holder's row still has is_current=1 from the last run would violate
 * the index. Per your instruction ("never design ingestion logic that
 * temporarily violates this constraint unnecessarily"), the fix is
 * ordering: clear is_current on every OTHER holder of a titan BEFORE
 * writing the newly-declared current holder, for every titan that has a
 * current holder declared in this run. This never produces a moment with
 * two 1s; a moment with zero 1s is fine (the index only forbids >1).
 */

import type { SeedTitanHolder } from "../types";
import { buildUpdateThenInsert, sqlValue } from "./sql";
import { sourceIdSubquery } from "./identity";
import { DEFAULT_CANON_STATUS } from "./defaults";

export function buildTitanHolderStatements(holders: SeedTitanHolder[]): string[] {
  const statements: string[] = [];

  const currentByTitan = new Map<string, string>(); // titanId -> personId declared current in THIS run
  for (const h of holders) {
    if (h.isCurrent) currentByTitan.set(h.titan, h.person);
  }
  for (const [titanId, personId] of currentByTitan) {
    statements.push(
      `UPDATE titan_holders SET is_current = 0 WHERE titan_id = ${sqlValue(titanId)} AND person_id != ${sqlValue(personId)};`,
    );
  }

  for (const h of holders) {
    statements.push(
      ...buildUpdateThenInsert(
        "titan_holders",
        [
          "titan_id", "person_id", "holder_order", "predecessor_person_id", "successor_person_id",
          "period_start_year", "period_end_year", "date_precision", "is_current",
          "inheritance_method", "canon_status", "source_id", "notes",
        ],
        [
          h.titan, h.person, h.holderOrder ?? null, h.predecessor ?? null, h.successor ?? null,
          h.period?.yearStart, h.period?.yearEnd, h.period?.datePrecision, h.isCurrent ?? false,
          h.inheritanceMethod, h.canonStatus ?? DEFAULT_CANON_STATUS,
          h.source ? { raw: sourceIdSubquery(h.source) } : null,
          h.notes,
        ],
        // Identity: (titan, person, order) — matches the DB's own
        // UNIQUE(titan_id, person_id, holder_order), just made NULL-safe.
        ["titan_id", "person_id", "holder_order"],
        [
          "predecessor_person_id", "successor_person_id", "period_start_year", "period_end_year",
          "date_precision", "is_current", "inheritance_method", "canon_status", "source_id", "notes",
        ],
      ),
    );
  }

  return statements;
}
