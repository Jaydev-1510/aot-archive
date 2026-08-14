/**
 * Mirrors the DEFAULT values declared on NOT NULL columns in the schema
 * (src/database/schema/{people,titans,...}.ts). A SQLite column DEFAULT
 * only applies when the column is OMITTED from an INSERT — since every
 * builder here always lists every column explicitly (simpler, and
 * required for the ON CONFLICT DO UPDATE / excluded.* pattern), any
 * optional seed field must fall back to these values in application
 * code, or a NOT NULL constraint fails the moment the seed omits it.
 * Centralized here so if the schema's defaults ever change, there's one
 * place to update instead of hunting through every table's statement
 * builder.
 */

export const DEFAULT_GENDER = "unknown";
export const DEFAULT_SPECIES = "human";
export const DEFAULT_LIFE_STATUS = "unknown";
export const DEFAULT_CANON_STATUS = "manga";
export const DEFAULT_ABILITY_CATEGORY = "titan_power";
