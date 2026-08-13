/**
 * Structured validation error type + collector.
 *
 * The validator never throws on a single bad record — it collects every
 * problem across the whole dataset and reports them together, per your
 * requirement ("Do NOT stop at the first error").
 */

export type ValidationSection =
  | "ids"
  | "entities"
  | "relationshipTypes"
  | "relationships"
  | "titanHolders"
  | "sources"
  | "abilities"
  | "aliases"
  | "media"
  | "dates";

export interface ValidationError {
  section: ValidationSection;
  /** Human-locatable pointer, e.g. "people[3] (eren_yeager)" or "relationships[14]". */
  identifier: string;
  message: string;
  /** Structured context for tooling / future JSON output, e.g. { subject, predicate, object }. */
  details?: Record<string, unknown>;
}

export class ValidationErrorCollector {
  private readonly _errors: ValidationError[] = [];

  add(error: ValidationError): void {
    this._errors.push(error);
  }

  get errors(): ReadonlyArray<ValidationError> {
    return this._errors;
  }

  hasErrors(): boolean {
    return this._errors.length > 0;
  }
}
