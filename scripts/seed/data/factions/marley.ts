import { factionId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  factions: [
    {
      id: factionId("marleyan_military"),
      name: "Marleyan Military",
      factionType: "military",
      description: "The armed forces of the nation of Marley.",
    },
    {
      id: factionId("warrior_unit"),
      name: "Warrior Unit",
      factionType: "military",
      description:
        "Marley's specialized military unit composed of Eldians possessing the Power of the Titans.",
    },
    {
      id: factionId("eldia"),
      name: "Eldia",
      factionType: "nation",
      description: "The historical Eldian Empire and its people.",
    },
  ],
};
