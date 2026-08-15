import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("fall_of_shiganshina"),
      name: "Fall of Shiganshina District",
      eventType: "disaster",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary: "The Colossal Titan breaches the outer gate of Shiganshina District, allowing Pure Titans into the city.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("fall_of_wall_maria"),
      name: "Fall of Wall Maria",
      eventType: "disaster",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary: "Following the breach of Shiganshina, the Armored Titan destroys the inner gate of Wall Maria. Humanity is forced to retreat behind Wall Rose, losing a third of its territory.",
      provenance: { source: "aot_manga" },
    },
  ],
};
