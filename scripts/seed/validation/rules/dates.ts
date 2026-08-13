/**
 * Section 9: Dates.
 *
 * Deliberately minimal, per your instruction not to invent chronology
 * rules the architecture doesn't define: the only thing Phase 6 of the
 * architecture doc actually constrains is that a range has to make sense
 * (yearStart <= yearEnd). It does NOT require yearStart whenever yearEnd
 * is present, does NOT require datePrecision whenever a year is present,
 * and doesn't forbid negative years (in-universe year numbering has no
 * stated epoch in the architecture) — so none of those become checks
 * here.
 */

import type { SeedDataset } from "../../types";
import type { SeedChronology } from "../../types";
import type { ValidationError } from "../errors";

function checkRange(
  chronology: SeedChronology | undefined,
  identifier: string,
  errors: ValidationError[],
): void {
  if (!chronology) return;
  const { yearStart, yearEnd } = chronology;
  if (yearStart !== undefined && yearEnd !== undefined && yearStart > yearEnd) {
    errors.push({
      section: "dates",
      identifier,
      message: `yearStart (${yearStart}) is after yearEnd (${yearEnd}).`,
      details: { yearStart, yearEnd },
    });
  }
}

export function validateDates(dataset: SeedDataset, errors: ValidationError[]): void {
  (dataset.people ?? []).forEach((p, i) => {
    checkRange(p.birth, `people[${i}] (${p.id}) birth`, errors);
    checkRange(p.death, `people[${i}] (${p.id}) death`, errors);
  });

  (dataset.events ?? []).forEach((e, i) => {
    checkRange(e.chronology, `events[${i}] (${e.id})`, errors);
  });

  (dataset.relationships ?? []).forEach((r, i) => {
    checkRange(r, `relationships[${i}] (${r.subject} ${r.predicate} ${r.object})`, errors);
  });

  (dataset.titanHolders ?? []).forEach((h, i) => {
    checkRange(h.period, `titanHolders[${i}] (${h.titan} <- ${h.person})`, errors);
  });
}
