/**
 * Seed type for titan_holders — the dedicated Titan inheritance table.
 *
 * Deliberately NOT expressed as a SeedRelationship, per the architecture
 * doc's explicit instruction and your project brief: inheritance needs
 * holder_order + predecessor/successor + is_current, which the generic
 * relationships shape doesn't carry.
 */

import type { InheritanceMethod } from "../../../src/database/schema";
import type { PersonId, TitanId } from "../ids";
import type { SeedChronology, SeedProvenance } from "./common";

export interface SeedTitanHolder extends SeedProvenance {
  titan: TitanId;
  person: PersonId;

  /** Position in the inheritance chain. Omit if the position genuinely isn't known — do not guess a number to make the chain look complete. */
  holderOrder?: number;

  predecessor?: PersonId;
  successor?: PersonId;

  period?: SeedChronology;

  /**
   * At most one holder per Titan may have `isCurrent: true` — enforced at
   * the DB level by the idx_titan_holders_one_current partial unique
   * index. The seed runner should also check this across the whole
   * dataset before insertion (Phase 4, not yet built), since a violation
   * here fails the whole batch at insert time otherwise.
   */
  isCurrent?: boolean;

  inheritanceMethod?: InheritanceMethod;
}
