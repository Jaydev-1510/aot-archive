import { personId, locationId, eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationships: [
    // Born-at
    { subject: personId("eren_yeager"), predicate: "born-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "born-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "born-at", object: locationId("wall_maria"), provenance: { source: "aot_manga" } },
    { subject: personId("levi_ackerman"), predicate: "born-at", object: locationId("underground_city"), provenance: { source: "aot_manga" } },
    { subject: personId("historia_reiss"), predicate: "born-at", object: locationId("wall_sheena"), provenance: { source: "aot_manga" } },
    { subject: personId("grisha_yeager"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },
    { subject: personId("zeke_yeager"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },
    { subject: personId("reiner_braun"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },
    { subject: personId("gabi_braun"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },
    { subject: personId("falco_grice"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },
    { subject: personId("annie_leonhart"), predicate: "born-at", object: locationId("liberio_internment_zone"), provenance: { source: "aot_manga" } },

    // Died-at
    { subject: personId("carla_yeager"), predicate: "died-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: personId("erwin_smith"), predicate: "died-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: personId("marco_bott"), predicate: "died-at", object: locationId("trost_district"), provenance: { source: "aot_manga" } },
    { subject: personId("sasha_blouse"), predicate: "died-at", object: locationId("liberio"), provenance: { source: "aot_manga" } },

    // Occurred-at
    { subject: eventId("fall_of_shiganshina"), predicate: "occurred-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: eventId("fall_of_wall_maria"), predicate: "occurred-at", object: locationId("wall_maria"), provenance: { source: "aot_manga" } },
    { subject: eventId("battle_of_trost"), predicate: "occurred-at", object: locationId("trost_district"), provenance: { source: "aot_manga" } },
    { subject: eventId("stohess_battle"), predicate: "occurred-at", object: locationId("stohess_district"), provenance: { source: "aot_manga" } },
    { subject: eventId("battle_of_shiganshina"), predicate: "occurred-at", object: locationId("shiganshina_district"), provenance: { source: "aot_manga" } },
    { subject: eventId("raid_on_liberio"), predicate: "occurred-at", object: locationId("liberio"), provenance: { source: "aot_manga" } },
    { subject: eventId("clash_of_titans"), predicate: "occurred-at", object: locationId("utgard_castle"), provenance: { source: "aot_manga" } },
    { subject: eventId("battle_of_heaven_and_earth"), predicate: "occurred-at", object: locationId("fort_salta"), provenance: { source: "aot_manga" } },
    { subject: eventId("uprising"), predicate: "occurred-at", object: locationId("wall_sheena"), provenance: { source: "aot_manga" } },
    { subject: eventId("warrior_infiltration"), predicate: "occurred-at", object: locationId("wall_maria"), provenance: { source: "aot_manga" } },
    { subject: eventId("fritz_exodus"), predicate: "occurred-at", object: locationId("paradis_island"), provenance: { source: "aot_manga" } },
    { subject: eventId("great_titan_war"), predicate: "occurred-at", object: locationId("marley"), provenance: { source: "aot_manga" } }
  ]
};
