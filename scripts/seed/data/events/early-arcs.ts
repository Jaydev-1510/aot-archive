import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("battle_of_trost"),
      name: "Battle of Trost District",
      eventType: "battle",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "The Colossal Titan reappears and breaches Wall Rose at Trost District. Eren Yeager uses his Titan powers for the first time to seal the gate.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("female_titan_expedition"),
      name: "57th Exterior Scouting Mission",
      eventType: "expedition",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "An expedition led by the Survey Corps is interrupted by the appearance of the Female Titan, resulting in heavy casualties.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("stohess_battle"),
      name: "Battle of Stohess District",
      eventType: "battle",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "The Survey Corps attempts to capture Annie Leonhart, revealed to be the Female Titan. A destructive battle ensues within the walls of Stohess.",
      provenance: { source: "aot_manga" },
    },
  ],
};
