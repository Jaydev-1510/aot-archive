CREATE TABLE `entities` (
	`id` text PRIMARY KEY,
	`entity_type` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text,
	CONSTRAINT "chk_entities_entity_type" CHECK("entity_type" IN ('person','titan','event','location','faction','object','family'))
);
--> statement-breakpoint
CREATE TABLE `aliases` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`entity_id` text NOT NULL,
	`alias` text NOT NULL,
	`alias_type` text NOT NULL,
	`language` text,
	`notes` text,
	CONSTRAINT `fk_aliases_entity_id_entities_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT "chk_aliases_alias_type" CHECK("alias_type" IN ('nickname','title','epithet','japanese_name','romanization','alternate_name'))
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`media_type` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`source_id` integer,
	`license_notes` text,
	CONSTRAINT `fk_media_source_id_sources_id_fk` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL,
	CONSTRAINT "chk_media_media_type" CHECK("media_type" IN ('image','video'))
);
--> statement-breakpoint
CREATE TABLE `media_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`entity_id` text NOT NULL,
	`media_id` integer NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`display_order` integer,
	CONSTRAINT `fk_media_links_entity_id_entities_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_media_links_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE,
	CONSTRAINT `uq_media_links_entity_media` UNIQUE(`entity_id`,`media_id`)
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`source_type` text NOT NULL,
	`chapter` integer,
	`episode` integer,
	`volume` integer,
	`page` integer,
	`url` text,
	`notes` text,
	CONSTRAINT "chk_sources_source_type" CHECK("source_type" IN ('manga','anime','anime-original','guidebook','character-book','official-material','interview','other'))
);
--> statement-breakpoint
CREATE TABLE `relationship_types` (
	`slug` text PRIMARY KEY,
	`category` text NOT NULL,
	`inverse_slug` text,
	`is_symmetric` integer DEFAULT false NOT NULL,
	`description` text,
	CONSTRAINT `fk_relationship_types_inverse_slug_relationship_types_slug_fk` FOREIGN KEY (`inverse_slug`) REFERENCES `relationship_types`(`slug`),
	CONSTRAINT "chk_relationship_types_category" CHECK("category" IN ('family','social','political','faction','location','historical','ownership'))
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`japanese_name` text,
	`gender` text DEFAULT 'unknown' NOT NULL,
	`species` text DEFAULT 'human' NOT NULL,
	`status` text DEFAULT 'unknown' NOT NULL,
	`birth_year_start` integer,
	`birth_year_end` integer,
	`birth_date_precision` text,
	`death_year_start` integer,
	`death_year_end` integer,
	`death_date_precision` text,
	`summary` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`primary_source_id` integer,
	`notes` text,
	CONSTRAINT `fk_people_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_people_primary_source_id_sources_id_fk` FOREIGN KEY (`primary_source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL,
	CONSTRAINT "chk_people_gender" CHECK("gender" IN ('male','female','unknown')),
	CONSTRAINT "chk_people_species" CHECK("species" IN ('human','pure_titan','unknown')),
	CONSTRAINT "chk_people_status" CHECK("status" IN ('alive','deceased','unknown'))
);
--> statement-breakpoint
CREATE TABLE `titans` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`titan_class` text NOT NULL,
	`description` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`notes` text,
	CONSTRAINT `fk_titans_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT "chk_titans_titan_class" CHECK("titan_class" IN ('nine_titans','pure_titan','abnormal_titan','named_titan'))
);
--> statement-breakpoint
CREATE TABLE `abilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE,
	`category` text DEFAULT 'titan_power' NOT NULL,
	`description` text,
	CONSTRAINT "chk_abilities_category" CHECK("category" IN ('titan_power','combat_skill','other'))
);
--> statement-breakpoint
CREATE TABLE `titan_abilities` (
	`titan_id` text NOT NULL,
	`ability_id` integer NOT NULL,
	`notes` text,
	CONSTRAINT `titan_abilities_pk` PRIMARY KEY(`titan_id`, `ability_id`),
	CONSTRAINT `fk_titan_abilities_titan_id_titans_id_fk` FOREIGN KEY (`titan_id`) REFERENCES `titans`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_titan_abilities_ability_id_abilities_id_fk` FOREIGN KEY (`ability_id`) REFERENCES `abilities`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `families` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`is_royal_bloodline` integer DEFAULT false NOT NULL,
	`description` text,
	`notes` text,
	CONSTRAINT `fk_families_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`event_type` text,
	`year_start` integer,
	`year_end` integer,
	`date_precision` text,
	`summary` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`source_id` integer,
	`notes` text,
	CONSTRAINT `fk_events_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_events_source_id_sources_id_fk` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL,
	CONSTRAINT "chk_events_event_type" CHECK("event_type" IN ('war','battle','expedition','political','disaster','other'))
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`location_type` text,
	`parent_location_id` text,
	`description` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`notes` text,
	CONSTRAINT `fk_locations_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_locations_parent_location_id_locations_id_fk` FOREIGN KEY (`parent_location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL,
	CONSTRAINT "chk_locations_location_type" CHECK("location_type" IN ('nation','region','city','district','wall','island','landmark','other'))
);
--> statement-breakpoint
CREATE TABLE `factions` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`faction_type` text,
	`description` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`notes` text,
	CONSTRAINT `fk_factions_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT "chk_factions_faction_type" CHECK("faction_type" IN ('military','political','nation','militia','other'))
);
--> statement-breakpoint
CREATE TABLE `objects` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`object_type` text,
	`description` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`notes` text,
	CONSTRAINT `fk_objects_id_entities_id_fk` FOREIGN KEY (`id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT "chk_objects_object_type" CHECK("object_type" IN ('equipment','artifact','weapon','document','other'))
);
--> statement-breakpoint
CREATE TABLE `relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`subject_id` text NOT NULL,
	`subject_type` text NOT NULL,
	`predicate` text NOT NULL,
	`object_id` text NOT NULL,
	`object_type` text NOT NULL,
	`qualifier` text,
	`year_start` integer,
	`year_end` integer,
	`date_precision` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`source_id` integer,
	`notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	CONSTRAINT `fk_relationships_subject_id_entities_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_relationships_predicate_relationship_types_slug_fk` FOREIGN KEY (`predicate`) REFERENCES `relationship_types`(`slug`),
	CONSTRAINT `fk_relationships_object_id_entities_id_fk` FOREIGN KEY (`object_id`) REFERENCES `entities`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_relationships_source_id_sources_id_fk` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL,
	CONSTRAINT `uq_relationships_edge` UNIQUE(`subject_id`,`predicate`,`object_id`,`qualifier`),
	CONSTRAINT "chk_relationships_subject_type" CHECK("subject_type" IN ('person','titan','event','location','faction','object','family')),
	CONSTRAINT "chk_relationships_object_type" CHECK("object_type" IN ('person','titan','event','location','faction','object','family'))
);
--> statement-breakpoint
CREATE TABLE `titan_holders` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`titan_id` text NOT NULL,
	`person_id` text NOT NULL,
	`holder_order` integer,
	`predecessor_person_id` text,
	`successor_person_id` text,
	`period_start_year` integer,
	`period_end_year` integer,
	`date_precision` text,
	`is_current` integer DEFAULT false NOT NULL,
	`inheritance_method` text,
	`canon_status` text DEFAULT 'manga' NOT NULL,
	`source_id` integer,
	`notes` text,
	CONSTRAINT `fk_titan_holders_titan_id_titans_id_fk` FOREIGN KEY (`titan_id`) REFERENCES `titans`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_titan_holders_person_id_people_id_fk` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_titan_holders_predecessor_person_id_people_id_fk` FOREIGN KEY (`predecessor_person_id`) REFERENCES `people`(`id`) ON DELETE SET NULL,
	CONSTRAINT `fk_titan_holders_successor_person_id_people_id_fk` FOREIGN KEY (`successor_person_id`) REFERENCES `people`(`id`) ON DELETE SET NULL,
	CONSTRAINT `fk_titan_holders_source_id_sources_id_fk` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL,
	CONSTRAINT `uq_titan_holders_titan_person_order` UNIQUE(`titan_id`,`person_id`,`holder_order`),
	CONSTRAINT "chk_titan_holders_inheritance_method" CHECK("inheritance_method" IN ('combat','death_bite','injection','birth','unknown','other'))
);
--> statement-breakpoint
CREATE INDEX `idx_entities_type` ON `entities` (`entity_type`);--> statement-breakpoint
CREATE INDEX `idx_aliases_entity` ON `aliases` (`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_aliases_alias` ON `aliases` (`alias`);--> statement-breakpoint
CREATE INDEX `idx_people_status` ON `people` (`status`);--> statement-breakpoint
CREATE INDEX `idx_people_birth_year` ON `people` (`birth_year_start`);--> statement-breakpoint
CREATE INDEX `idx_titans_class` ON `titans` (`titan_class`);--> statement-breakpoint
CREATE INDEX `idx_events_year` ON `events` (`year_start`);--> statement-breakpoint
CREATE INDEX `idx_locations_parent` ON `locations` (`parent_location_id`);--> statement-breakpoint
CREATE INDEX `idx_rel_subject` ON `relationships` (`subject_id`,`predicate`);--> statement-breakpoint
CREATE INDEX `idx_rel_object` ON `relationships` (`object_id`,`predicate`);--> statement-breakpoint
CREATE INDEX `idx_rel_predicate` ON `relationships` (`predicate`);--> statement-breakpoint
CREATE INDEX `idx_titan_holders_titan_order` ON `titan_holders` (`titan_id`,`holder_order`);--> statement-breakpoint
CREATE INDEX `idx_titan_holders_person` ON `titan_holders` (`person_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_titan_holders_one_current` ON `titan_holders` (`titan_id`) WHERE "titan_holders"."is_current" = 1;