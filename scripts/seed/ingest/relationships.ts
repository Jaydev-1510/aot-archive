import type { SeedRelationship } from "../types";
import { buildUpdateThenInsert, raw, sqlValue } from "./sql";
import { sourceIdSubquery } from "./identity";
import { DEFAULT_CANON_STATUS } from "./defaults";

export function buildRelationshipStatements(
  relationships: SeedRelationship[],
): string[] {
  const statements: string[] = [];
  for (const r of relationships) {
    statements.push(
      ...buildUpdateThenInsert(
        "relationships",
        [
          "subject_id",
          "subject_type",
          "predicate",
          "object_id",
          "object_type",
          "qualifier",
          "year_start",
          "year_end",
          "date_precision",
          "canon_status",
          "source_id",
          "notes",
        ],
        [
          r.subject,
          raw(entityTypeSubquery(r.subject)),
          r.predicate,
          r.object,
          raw(entityTypeSubquery(r.object)),
          r.qualifier ?? null,
          r.yearStart,
          r.yearEnd,
          r.datePrecision,
          r.provenance?.canonStatus ?? DEFAULT_CANON_STATUS,
          r.provenance?.source
            ? raw(sourceIdSubquery(r.provenance.source))
            : null,
          r.provenance?.notes ?? null,
        ],
        // Identity deliberately does NOT include subject_type/object_type
        // (those are derived, not part of what makes an edge "the same
        // edge") or year/canon/notes (those are mutable metadata, not
        // identity).
        ["subject_id", "predicate", "object_id", "qualifier"],
        [
          "subject_type",
          "object_type",
          "year_start",
          "year_end",
          "date_precision",
          "canon_status",
          "source_id",
          "notes",
        ],
      ),
    );
  }
  return statements;
}

/**
 * Resolves subject_type/object_type from the entities table itself
 * rather than trusting the seed's own kind branding at the SQL layer —
 * entities.entity_type is the actual source of truth once inserted, and
 * every subject_id/object_id an ingestion statement references was
 * already validated to exist by Section 4 before this file is ever
 * generated.
 */
function entityTypeSubquery(entityId: string): string {
  return `(SELECT entity_type FROM entities WHERE id = ${sqlValue(entityId)})`;
}
