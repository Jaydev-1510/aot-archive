/**
 * Section 3: Relationships.
 *
 * The duplicate-detection here exists specifically because of a real gap
 * you identified: the DB's UNIQUE(subject_id, predicate, object_id,
 * qualifier) constraint does NOT catch two rows that both have a NULL
 * qualifier, because SQLite (like standard SQL) treats NULL as distinct
 * from itself in a unique index. Two identical `parent-of` edges with no
 * qualifier could both be inserted and the database would never notice.
 * We normalize `undefined` qualifier to a sentinel before comparing so
 * the validator catches what the schema can't.
 *
 * KIND RESTRICTIONS — OPEN ITEM, NOT SILENTLY DECIDED:
 * Your brief asks to validate "subject/object kinds satisfy any
 * restrictions encoded by the relationship type." As implemented,
 * `relationship_types` (Phase 3/5 of the architecture doc) has no column
 * encoding which entity kinds a given predicate is allowed to connect —
 * only `category` (family/social/political/faction/location/historical/
 * ownership), which is descriptive, not a validated allow-list. Inventing
 * a category -> allowed-kind-pairs mapping now would be adding a schema
 * rule that was never approved. So this check is currently a documented
 * no-op: `checkKindRestrictions` exists as the extension point, and is
 * called, but has nothing to enforce yet. If you want real kind
 * restrictions (e.g. 'parent-of' must be person->person), that's a
 * schema decision — an `allowed_subject_kinds` / `allowed_object_kinds`
 * column (or a code-level static map) on relationship_types — that
 * should go back through you before I add it here.
 */

import type { SeedDataset } from "../../types";
import type { ValidationContext } from "../context";
import type { ValidationError } from "../errors";

const NULL_QUALIFIER_SENTINEL = "\u0000__NO_QUALIFIER__\u0000";

export function validateRelationships(
  dataset: SeedDataset,
  context: ValidationContext,
  errors: ValidationError[],
): void {
  const relationships = dataset.relationships ?? [];
  const seenEdges = new Map<string, number>();

  relationships.forEach((rel, index) => {
    const identifier = `relationships[${index}] (${rel.subject} ${rel.predicate} ${rel.object})`;

    const subjectKind = context.entityKindById.get(rel.subject);
    if (subjectKind === undefined) {
      errors.push({
        section: "relationships",
        identifier,
        message: `subject "${rel.subject}" does not exist.`,
        details: { subject: rel.subject, predicate: rel.predicate, object: rel.object },
      });
    }

    const objectKind = context.entityKindById.get(rel.object);
    if (objectKind === undefined) {
      errors.push({
        section: "relationships",
        identifier,
        message: `object "${rel.object}" does not exist.`,
        details: { subject: rel.subject, predicate: rel.predicate, object: rel.object },
      });
    }

    if (!context.relationshipTypeBySlug.has(rel.predicate)) {
      errors.push({
        section: "relationships",
        identifier,
        message: `predicate "${rel.predicate}" is not declared in relationshipTypes.`,
        details: { predicate: rel.predicate },
      });
    }

    if (subjectKind !== undefined && objectKind !== undefined) {
      checkKindRestrictions(rel, subjectKind, objectKind, identifier, context, errors);
    }

    // Semantic duplicate detection — see file header re: NULL qualifier.
    const edgeKey = [rel.subject, rel.predicate, rel.object, rel.qualifier ?? NULL_QUALIFIER_SENTINEL].join(
      "\u0001",
    );
    const priorIndex = seenEdges.get(edgeKey);
    if (priorIndex !== undefined) {
      errors.push({
        section: "relationships",
        identifier,
        message:
          `Duplicate relationship: identical subject/predicate/object/qualifier already declared ` +
          `at relationships[${priorIndex}]. Note: SQLite's UNIQUE constraint will NOT catch this if ` +
          `qualifier is omitted on both, because NULL is never equal to NULL in a unique index.`,
      });
    } else {
      seenEdges.set(edgeKey, index);
    }
  });
}

// Extension point — see file header. Intentionally a no-op today.
function checkKindRestrictions(
  _rel: SeedDataset["relationships"] extends (infer R)[] | undefined ? R : never,
  _subjectKind: string,
  _objectKind: string,
  _identifier: string,
  _context: ValidationContext,
  _errors: ValidationError[],
): void {
  // No-op: relationship_types does not currently encode kind restrictions.
  // See file header.
}
