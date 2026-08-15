import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("clash_of_titans"),
      name: "Clash of the Titans",
      eventType: "battle",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "Following the suspected breach of Wall Rose, Reiner Braun and Bertolt Hoover reveal their identities as the Armored and Colossal Titans, leading to Eren's temporary abduction.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("uprising"),
      name: "Uprising",
      eventType: "political",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "The Survey Corps overthrows the corrupt Royal Government. Historia Reiss is crowned as the true queen of the Walls.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("battle_of_shiganshina"),
      name: "Battle of Shiganshina",
      eventType: "battle",
      chronology: { yearStart: 850, datePrecision: "exact" },
      summary:
        "The Survey Corps returns to Shiganshina to seal the wall and uncover the truth in Grisha Yeager's basement. They face off against Zeke, Reiner, and Bertolt.",
      provenance: { source: "aot_manga" },
    },
  ],
};
