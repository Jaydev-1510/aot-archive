import { personId, objectId, factionId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationships: [
    {
      subject: personId("eren_yeager"),
      predicate: "possesses",
      object: objectId("basement_key"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("grisha_yeager"),
      predicate: "possesses",
      object: objectId("basement_key"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("levi_ackerman"),
      predicate: "possesses",
      object: objectId("ilses_notebook"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("hange_zoe"),
      predicate: "possesses",
      object: objectId("ilses_notebook"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("survey_corps"),
      predicate: "uses",
      object: objectId("odm_gear"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("garrison"),
      predicate: "uses",
      object: objectId("odm_gear"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("military_police"),
      predicate: "uses",
      object: objectId("odm_gear"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("survey_corps"),
      predicate: "uses",
      object: objectId("thunder_spears"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("yeagerists"),
      predicate: "uses",
      object: objectId("thunder_spears"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("military_police"),
      predicate: "uses",
      object: objectId("anti_personnel_odm"),
      qualifier: "Interior Police (Anti-Personnel Control Squad)",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("kenny_ackerman"),
      predicate: "uses",
      object: objectId("anti_personnel_odm"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: factionId("marleyan_military"),
      predicate: "uses",
      object: objectId("titan_serum"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("kenny_ackerman"),
      predicate: "possesses",
      object: objectId("titan_serum"),
      qualifier: "stolen from Rod Reiss, given to Levi",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("levi_ackerman"),
      predicate: "possesses",
      object: objectId("titan_serum"),
      qualifier: "given by Kenny Ackerman, used on Armin",
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("rod_reiss"),
      predicate: "possesses",
      object: objectId("titan_serum"),
      provenance: { source: "aot_manga" },
    },
    {
      subject: personId("armin_arlert"),
      predicate: "uses",
      object: objectId("titan_serum"),
      qualifier: "injected by Levi",
      provenance: { source: "aot_manga" },
    },
  ],
};
