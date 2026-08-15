import { personId, eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationships: [
    // Participant-in
    { subject: personId("carla_yeager"), predicate: "participant-in", object: eventId("fall_of_shiganshina"), qualifier: "killed", provenance: { source: "aot_manga" } },
    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("fall_of_shiganshina"), qualifier: "survivor", provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "participant-in", object: eventId("fall_of_shiganshina"), qualifier: "survivor", provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "participant-in", object: eventId("fall_of_shiganshina"), qualifier: "survivor", provenance: { source: "aot_manga" } },
    { subject: personId("hannes"), predicate: "participant-in", object: eventId("fall_of_shiganshina"), qualifier: "survivor", provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("battle_of_trost"), provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "participant-in", object: eventId("battle_of_trost"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "participant-in", object: eventId("battle_of_trost"), provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("female_titan_expedition"), provenance: { source: "aot_manga" } },
    { subject: personId("levi_ackerman"), predicate: "participant-in", object: eventId("female_titan_expedition"), provenance: { source: "aot_manga" } },
    { subject: personId("erwin_smith"), predicate: "participant-in", object: eventId("female_titan_expedition"), provenance: { source: "aot_manga" } },

    { subject: personId("annie_leonhart"), predicate: "participant-in", object: eventId("stohess_battle"), provenance: { source: "aot_manga" } },
    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("stohess_battle"), provenance: { source: "aot_manga" } },

    { subject: personId("reiner_braun"), predicate: "participant-in", object: eventId("clash_of_titans"), provenance: { source: "aot_manga" } },
    { subject: personId("bertolt_hoover"), predicate: "participant-in", object: eventId("clash_of_titans"), provenance: { source: "aot_manga" } },
    { subject: personId("ymir_104th"), predicate: "participant-in", object: eventId("clash_of_titans"), provenance: { source: "aot_manga" } },

    { subject: personId("historia_reiss"), predicate: "participant-in", object: eventId("uprising"), provenance: { source: "aot_manga" } },

    { subject: personId("erwin_smith"), predicate: "participant-in", object: eventId("battle_of_shiganshina"), qualifier: "killed", provenance: { source: "aot_manga" } },
    { subject: personId("levi_ackerman"), predicate: "participant-in", object: eventId("battle_of_shiganshina"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "participant-in", object: eventId("battle_of_shiganshina"), provenance: { source: "aot_manga" } },
    { subject: personId("zeke_yeager"), predicate: "participant-in", object: eventId("battle_of_shiganshina"), provenance: { source: "aot_manga" } },
    { subject: personId("bertolt_hoover"), predicate: "participant-in", object: eventId("battle_of_shiganshina"), qualifier: "killed", provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("raid_on_liberio"), provenance: { source: "aot_manga" } },
    { subject: personId("willy_tybur"), predicate: "participant-in", object: eventId("raid_on_liberio"), qualifier: "killed", provenance: { source: "aot_manga" } },
    { subject: personId("lara_tybur"), predicate: "participant-in", object: eventId("raid_on_liberio"), qualifier: "killed", provenance: { source: "aot_manga" } },
    { subject: personId("theo_magath"), predicate: "participant-in", object: eventId("raid_on_liberio"), provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("rumbling"), qualifier: "instigator", provenance: { source: "aot_manga" } },
    { subject: personId("hange_zoe"), predicate: "participant-in", object: eventId("rumbling"), qualifier: "killed", provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), qualifier: "killed", provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("levi_ackerman"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("reiner_braun"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("pieck_finger"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("falco_grice"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("annie_leonhart"), predicate: "participant-in", object: eventId("battle_of_heaven_and_earth"), provenance: { source: "aot_manga" } },
    { subject: personId("theo_magath"), predicate: "participant-in", object: eventId("war_for_paradis"), qualifier: "killed", provenance: { source: "aot_manga" } },

    { subject: personId("karl_fritz"), predicate: "participant-in", object: eventId("fritz_exodus"), provenance: { source: "aot_manga" } },
    { subject: personId("ymir_fritz"), predicate: "participant-in", object: eventId("titan_origins"), provenance: { source: "aot_manga" } },
    { subject: personId("reiner_braun"), predicate: "participant-in", object: eventId("warrior_infiltration"), provenance: { source: "aot_manga" } },
    { subject: personId("bertolt_hoover"), predicate: "participant-in", object: eventId("warrior_infiltration"), provenance: { source: "aot_manga" } },
    { subject: personId("annie_leonhart"), predicate: "participant-in", object: eventId("warrior_infiltration"), provenance: { source: "aot_manga" } },
    { subject: personId("marcel_galliard"), predicate: "participant-in", object: eventId("warrior_infiltration"), qualifier: "killed", provenance: { source: "aot_manga" } }
  ]
};
