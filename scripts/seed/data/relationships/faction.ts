import { personId, factionId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationships: [
    // Member-of
    { subject: personId("eren_yeager"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("levi_ackerman"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("erwin_smith"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("hange_zoe"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("jean_kirstein"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("connie_springer"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("sasha_blouse"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("historia_reiss"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("mike_zacharias"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("petra_ral"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("oluo_bozado"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("eld_jinn"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("gunther_schultz"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("moblit_berner"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("floch_forster"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("marlowe_freudenberg"), predicate: "member-of", object: factionId("survey_corps"), provenance: { source: "aot_manga" } },

    { subject: personId("hannes"), predicate: "member-of", object: factionId("garrison"), provenance: { source: "aot_manga" } },
    { subject: personId("dot_pixis"), predicate: "member-of", object: factionId("garrison"), provenance: { source: "aot_manga" } },
    { subject: personId("ian_dietrich"), predicate: "member-of", object: factionId("garrison"), provenance: { source: "aot_manga" } },

    { subject: personId("nile_dok"), predicate: "member-of", object: factionId("military_police"), provenance: { source: "aot_manga" } },
    { subject: personId("hitch_dreyse"), predicate: "member-of", object: factionId("military_police"), provenance: { source: "aot_manga" } },
    { subject: personId("kenny_ackerman"), predicate: "member-of", object: factionId("military_police"), provenance: { source: "aot_manga" } },
    { subject: personId("marlowe_freudenberg"), predicate: "member-of", object: factionId("military_police"), provenance: { source: "aot_manga" } },

    { subject: personId("eren_yeager"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("mikasa_ackerman"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("armin_arlert"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("jean_kirstein"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("connie_springer"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("sasha_blouse"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("historia_reiss"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("ymir_104th"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("reiner_braun"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("bertolt_hoover"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("annie_leonhart"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("marco_bott"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },
    { subject: personId("keith_shadis"), predicate: "member-of", object: factionId("training_corps"), provenance: { source: "aot_manga" } },

    { subject: personId("reiner_braun"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("bertolt_hoover"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("annie_leonhart"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("pieck_finger"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("porco_galliard"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("marcel_galliard"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("zeke_yeager"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("falco_grice"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("gabi_braun"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("colt_grice"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },
    { subject: personId("tom_ksaver"), predicate: "member-of", object: factionId("warrior_unit"), provenance: { source: "aot_manga" } },

    { subject: personId("grisha_yeager"), predicate: "member-of", object: factionId("eldian_restorationists"), provenance: { source: "aot_manga" } },
    { subject: personId("dina_fritz"), predicate: "member-of", object: factionId("eldian_restorationists"), provenance: { source: "aot_manga" } },
    { subject: personId("eren_kruger"), predicate: "member-of", object: factionId("eldian_restorationists"), provenance: { source: "aot_manga" } },

    { subject: personId("floch_forster"), predicate: "member-of", object: factionId("yeagerists"), provenance: { source: "aot_manga" } },
    { subject: personId("yelena"), predicate: "member-of", object: factionId("anti_marleyan_volunteers"), provenance: { source: "aot_manga" } },
    { subject: personId("onyankopon"), predicate: "member-of", object: factionId("anti_marleyan_volunteers"), provenance: { source: "aot_manga" } },

    { subject: personId("theo_magath"), predicate: "member-of", object: factionId("marleyan_military"), provenance: { source: "aot_manga" } },
    { subject: personId("gross"), predicate: "member-of", object: factionId("marleyan_military"), provenance: { source: "aot_manga" } },
    { subject: personId("niccolo"), predicate: "member-of", object: factionId("marleyan_military"), provenance: { source: "aot_manga" } },

    // Leader-of
    { subject: personId("erwin_smith"), predicate: "leader-of", object: factionId("survey_corps"), qualifier: "commander", provenance: { source: "aot_manga" } },
    { subject: personId("hange_zoe"), predicate: "leader-of", object: factionId("survey_corps"), qualifier: "commander", provenance: { source: "aot_manga" } },
    { subject: personId("dot_pixis"), predicate: "leader-of", object: factionId("garrison"), qualifier: "commander", provenance: { source: "aot_manga" } },
    { subject: personId("nile_dok"), predicate: "leader-of", object: factionId("military_police"), qualifier: "commander", provenance: { source: "aot_manga" } },
    { subject: personId("keith_shadis"), predicate: "leader-of", object: factionId("training_corps"), qualifier: "commandant", provenance: { source: "aot_manga" } },
    { subject: personId("theo_magath"), predicate: "leader-of", object: factionId("marleyan_military"), qualifier: "commander", provenance: { source: "aot_manga" } },
    { subject: personId("zeke_yeager"), predicate: "leader-of", object: factionId("warrior_unit"), qualifier: "war chief", provenance: { source: "aot_manga" } },
    { subject: personId("historia_reiss"), predicate: "leader-of", object: factionId("royal_government"), qualifier: "queen", provenance: { source: "aot_manga" } },
    { subject: personId("floch_forster"), predicate: "leader-of", object: factionId("yeagerists"), qualifier: "leader", provenance: { source: "aot_manga" } }
  ]
};
