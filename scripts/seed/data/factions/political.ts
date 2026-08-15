import { factionId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  factions: [
    {
      id: factionId("royal_government"),
      name: "Royal Government",
      factionType: "political",
      description:
        "The ruling monarchy within the Walls, established by the Fritz/Reiss dynasty.",
    },
    {
      id: factionId("eldian_restorationists"),
      name: "Eldian Restorationists",
      factionType: "militia",
      description:
        "An underground movement in Marley seeking to restore the Eldian Empire.",
    },
    {
      id: factionId("anti_marleyan_volunteers"),
      name: "Anti-Marleyan Volunteers",
      factionType: "militia",
      description:
        "A group of soldiers from nations conquered by Marley who secretly allied with Paradis.",
    },
    {
      id: factionId("yeagerists"),
      name: "Yeagerists",
      factionType: "militia",
      description:
        "A rebel faction in Paradis Island intensely loyal to Eren Yeager.",
    },
  ],
};
