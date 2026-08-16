import { personId, factionId, locationId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationships: [
    // allied-with
    {
      subject: factionId("survey_corps"),
      predicate: "allied-with",
      object: factionId("anti_marleyan_volunteers"),
      qualifier: "clandestine military cooperation (851–854)",
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("eldia"),
      predicate: "allied-with",
      object: locationId("hizuru"),
      qualifier: "diplomatic & trade alliance brokered by Azumabito",
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("warrior_unit"),
      predicate: "allied-with",
      object: factionId("survey_corps"),
      qualifier: "battlefield alliance to halt the Rumbling (854)",
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("yeagerists"),
      predicate: "allied-with",
      object: factionId("anti_marleyan_volunteers"),
      qualifier: "secret conspiracy to enforce euthanasia plan",
      provenance: { source: "aot_manga" },
    },

    // rules
    {
      subject: personId("karl_fritz"),
      predicate: "rules",
      object: factionId("eldia"),
      qualifier: "145th King of Eldia",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("karl_fritz"),
      predicate: "rules",
      object: locationId("paradis_island"),
      qualifier: "First King of the Walls",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("uri_reiss"),
      predicate: "rules",
      object: factionId("royal_government"),
      qualifier: "true shadow monarch of the walls (Founding Titan)",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("frieda_reiss"),
      predicate: "rules",
      object: factionId("royal_government"),
      qualifier: "true shadow monarch of the walls (Founding Titan)",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("historia_reiss"),
      predicate: "rules",
      object: factionId("royal_government"),
      qualifier: "queen of the walls",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("first_king_fritz"),
      predicate: "rules",
      object: factionId("eldian_empire"),
      qualifier: "first king",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("karl_fritz"),
      predicate: "rules",
      object: factionId("eldian_empire"),
      qualifier: "145th king",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("rod_reiss"),
      predicate: "rules",
      object: factionId("royal_government"),
      qualifier: "true shadow monarch of the walls",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("willy_tybur"),
      predicate: "rules",
      object: locationId("marley"),
      qualifier: "shadow aristocratic ruler of Marley",
      provenance: { source: "aot_manga" },
    },
  ],
};
