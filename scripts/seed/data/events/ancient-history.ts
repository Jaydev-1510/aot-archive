import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("titan_origins"),
      name: "Origin of the Titans",
      eventType: "other",
      chronology: {
        datePrecision: "era",
      },
      summary: "Ymir Fritz gains the power of the Titans, becoming the Founding Titan. This event occurred approximately 2,000 years before the main story, altering the course of world history.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("great_titan_war"),
      name: "Great Titan War",
      eventType: "war",
      chronology: {
        yearStart: 743,
        datePrecision: "circa",
      },
      summary: "A devastating conflict among the Eldian noble families holding the Nine Titans. The war ended the Eldian Empire and led to the rise of Marley.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("fritz_exodus"),
      name: "Karl Fritz's Retreat to Paradis",
      eventType: "political",
      chronology: {
        yearStart: 743,
        datePrecision: "circa",
      },
      summary: "King Karl Fritz relocates a portion of Eldians to Paradis Island. Using the Founding Titan, he raises the three Walls—Maria, Rose, and Sheena—and alters the memories of the populace.",
      provenance: { source: "aot_manga" },
    },
  ],
};
