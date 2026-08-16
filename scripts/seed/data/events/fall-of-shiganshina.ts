import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("fall_of_shiganshina"),
      name: "Fall of Shiganshina District",
      eventType: "disaster",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary:
        "The Colossal Titan breaches the outer gate of Shiganshina District, allowing Pure Titans into the city.",
      aliases: [
        { alias: "シガンシナ区陥落", aliasType: "japanese_name" },
        { alias: "Shiganshina-ku Kanraku", aliasType: "romanization" },
      ],
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("fall_of_wall_maria"),
      name: "Fall of Wall Maria",
      eventType: "disaster",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary:
        "Following the breach of Shiganshina, the Armored Titan destroys the inner gate of Wall Maria. Humanity is forced to retreat behind Wall Rose, losing a third of its territory.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("reiss_chapel_massacre"),
      name: "Massacre at the Reiss Chapel",
      eventType: "battle",
      chronology: { yearStart: 845, datePrecision: "exact" },
      summary:
        "On the night Wall Maria falls, Grisha Yeager confronts the Reiss family in their underground chapel. He transforms into the Attack Titan, devours Frieda Reiss to steal the Founding Titan, and kills most of the royal family.",
      provenance: { source: "aot_manga" },
    },
  ],
};
