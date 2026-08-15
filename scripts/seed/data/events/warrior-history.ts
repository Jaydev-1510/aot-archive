import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("warrior_infiltration"),
      name: "Warrior Infiltration of Paradis",
      eventType: "other",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary: "Marley sends four Warriors—Reiner, Bertolt, Annie, and Marcel—to infiltrate Paradis Island, retrieve the Founding Titan, and test the island's defenses.",
      provenance: { source: "aot_manga" },
    },
  ],
};
