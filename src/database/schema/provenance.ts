/**
 * Provenance — Phase 3.8 / Phase 7 of the architecture doc.
 *
 * sources:      one row per citable reference (manga chapter, anime episode,
 *               guidebook entry, ...). Referenced by source_id columns on
 *               people / events / titan_holders / relationships.
 * aliases:      nicknames, titles, epithets, Japanese names, romanizations —
 *               attaches to ANY entity via entity_id (polymorphic through
 *               the entities supertype). Source of truth for search's
 *               denormalized alias text (Phase 8).
 * media/media_links: images/video, also polymorphic via entity_id.
 */

import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { entities } from "./entities";

export const sourceTypeValues = [
  "manga",
  "anime",
  "anime-original",
  "guidebook",
  "character-book",
  "official-material",
  "interview",
  "other",
] as const;

export type SourceType = (typeof sourceTypeValues)[number];

export const sources = sqliteTable(
  "sources",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    sourceType: text("source_type", { enum: sourceTypeValues }).notNull(),
    chapter: integer("chapter"),
    episode: integer("episode"),
    volume: integer("volume"),
    page: integer("page"),
    url: text("url"),
    notes: text("notes"),
  },
  (table) => [
    check(
      "chk_sources_source_type",
      sql`${table.sourceType} IN ('manga','anime','anime-original','guidebook','character-book','official-material','interview','other')`,
    ),
  ],
);

export const aliasTypeValues = [
  "nickname",
  "title",
  "epithet",
  "japanese_name",
  "romanization",
  "alternate_name",
] as const;

export type AliasType = (typeof aliasTypeValues)[number];

export const aliases = sqliteTable(
  "aliases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    aliasType: text("alias_type", { enum: aliasTypeValues }).notNull(),
    language: text("language"),
    notes: text("notes"),
  },
  (table) => [
    index("idx_aliases_entity").on(table.entityId),
    index("idx_aliases_alias").on(table.alias),
    check(
      "chk_aliases_alias_type",
      sql`${table.aliasType} IN ('nickname','title','epithet','japanese_name','romanization','alternate_name')`,
    ),
  ],
);

export const mediaTypeValues = ["image", "video"] as const;
export type MediaType = (typeof mediaTypeValues)[number];

export const media = sqliteTable(
  "media",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    mediaType: text("media_type", { enum: mediaTypeValues }).notNull(),
    url: text("url").notNull(),
    caption: text("caption"),
    sourceId: integer("source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    licenseNotes: text("license_notes"),
  },
  (table) => [
    check("chk_media_media_type", sql`${table.mediaType} IN ('image','video')`),
  ],
);

export const mediaLinks = sqliteTable(
  "media_links",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    isPrimary: integer("is_primary", { mode: "boolean" })
      .notNull()
      .default(false),
    displayOrder: integer("display_order"),
  },
  (table) => [
    unique("uq_media_links_entity_media").on(table.entityId, table.mediaId),
  ],
);
