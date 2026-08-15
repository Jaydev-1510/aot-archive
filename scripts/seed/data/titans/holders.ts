import { personId, titanId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  titanHolders: [
    // --- Attack Titan ---
    {
      titan: titanId("attack_titan"),
      person: personId("eren_kruger"),
      successor: personId("grisha_yeager"),
      isCurrent: false,
      source: "aot_manga",
      notes: "Known as the 'Owl', he passed the Attack Titan to Grisha Yeager.",
    },
    {
      titan: titanId("attack_titan"),
      person: personId("grisha_yeager"),
      predecessor: personId("eren_kruger"),
      successor: personId("eren_yeager"),
      isCurrent: false,
      period: { yearEnd: 845, datePrecision: "exact" },
      inheritanceMethod: "injection",
      source: "aot_manga",
      notes: "Inherited from Eren Kruger, later passed to his son Eren during the fall of Shiganshina.",
    },
    {
      titan: titanId("attack_titan"),
      person: personId("eren_yeager"),
      predecessor: personId("grisha_yeager"),
      isCurrent: false,
      period: { yearStart: 845, yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "injection",
      source: "aot_manga",
      notes: "Final holder of the Attack Titan.",
    },

    // --- Founding Titan ---
    {
      titan: titanId("founding_titan"),
      person: personId("ymir_fritz"),
      holderOrder: 1,
      isCurrent: false,
      inheritanceMethod: "other",
      source: "aot_manga",
      notes: "The original progenitor of all Titans.",
    },
    {
      titan: titanId("founding_titan"),
      person: personId("karl_fritz"),
      isCurrent: false,
      source: "aot_manga",
      notes: "The 145th King of Eldia who moved his people to Paradis Island.",
    },
    {
      titan: titanId("founding_titan"),
      person: personId("uri_reiss"),
      successor: personId("frieda_reiss"),
      isCurrent: false,
      inheritanceMethod: "injection",
      source: "aot_manga",
    },
    {
      titan: titanId("founding_titan"),
      person: personId("frieda_reiss"),
      predecessor: personId("uri_reiss"),
      successor: personId("grisha_yeager"),
      isCurrent: false,
      inheritanceMethod: "injection",
      source: "aot_manga",
    },
    {
      titan: titanId("founding_titan"),
      person: personId("grisha_yeager"),
      predecessor: personId("frieda_reiss"),
      successor: personId("eren_yeager"),
      isCurrent: false,
      inheritanceMethod: "combat",
      source: "aot_manga",
      notes: "Stole the Founding Titan from Frieda Reiss by defeating and eating her.",
    },
    {
      titan: titanId("founding_titan"),
      person: personId("eren_yeager"),
      predecessor: personId("grisha_yeager"),
      isCurrent: false,
      period: { yearStart: 845, yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "injection",
      source: "aot_manga",
      notes: "Inherited alongside the Attack Titan.",
    },

    // --- Colossal Titan ---
    {
      titan: titanId("colossal_titan"),
      person: personId("bertolt_hoover"),
      successor: personId("armin_arlert"),
      isCurrent: false,
      period: { yearEnd: 850, datePrecision: "exact" },
      source: "aot_manga",
    },
    {
      titan: titanId("colossal_titan"),
      person: personId("armin_arlert"),
      predecessor: personId("bertolt_hoover"),
      isCurrent: false,
      period: { yearStart: 850, yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "injection",
      source: "aot_manga",
      notes: "Turned into a pure titan via injection and ate Bertolt Hoover.",
    },

    // --- Armored Titan ---
    {
      titan: titanId("armored_titan"),
      person: personId("reiner_braun"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      source: "aot_manga",
    },

    // --- Female Titan ---
    {
      titan: titanId("female_titan"),
      person: personId("annie_leonhart"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      source: "aot_manga",
    },

    // --- Beast Titan ---
    {
      titan: titanId("beast_titan"),
      person: personId("tom_ksaver"),
      successor: personId("zeke_yeager"),
      isCurrent: false,
      source: "aot_manga",
    },
    {
      titan: titanId("beast_titan"),
      person: personId("zeke_yeager"),
      predecessor: personId("tom_ksaver"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "injection",
      source: "aot_manga",
    },

    // --- Jaw Titan ---
    {
      titan: titanId("jaw_titan"),
      person: personId("marcel_galliard"),
      successor: personId("ymir_104th"),
      isCurrent: false,
      period: { yearEnd: 845, datePrecision: "exact" },
      source: "aot_manga",
    },
    {
      titan: titanId("jaw_titan"),
      person: personId("ymir_104th"),
      predecessor: personId("marcel_galliard"),
      successor: personId("porco_galliard"),
      isCurrent: false,
      period: { yearStart: 845, datePrecision: "exact" },
      inheritanceMethod: "death_bite",
      source: "aot_manga",
      notes: "Ate Marcel as a wild pure titan.",
    },
    {
      titan: titanId("jaw_titan"),
      person: personId("porco_galliard"),
      predecessor: personId("ymir_104th"),
      successor: personId("falco_grice"),
      isCurrent: false,
      inheritanceMethod: "injection",
      source: "aot_manga",
    },
    {
      titan: titanId("jaw_titan"),
      person: personId("falco_grice"),
      predecessor: personId("porco_galliard"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "death_bite",
      source: "aot_manga",
      notes: "Ate Porco Galliard while acting as a mindless pure titan.",
    },

    // --- Cart Titan ---
    {
      titan: titanId("cart_titan"),
      person: personId("pieck_finger"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      source: "aot_manga",
    },

    // --- War Hammer Titan ---
    {
      titan: titanId("war_hammer_titan"),
      person: personId("lara_tybur"),
      successor: personId("eren_yeager"),
      isCurrent: false,
      period: { yearEnd: 854, datePrecision: "exact" },
      source: "aot_manga",
    },
    {
      titan: titanId("war_hammer_titan"),
      person: personId("eren_yeager"),
      predecessor: personId("lara_tybur"),
      isCurrent: false,
      period: { yearStart: 854, yearEnd: 854, datePrecision: "exact" },
      inheritanceMethod: "combat",
      source: "aot_manga",
      notes: "Consumed Lara Tybur's crystal using the Jaw Titan.",
    },
  ],
};
