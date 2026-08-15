import { familyId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  families: [
    {
      id: familyId("yeager_family"),
      name: "Yeager Family",
      isRoyalBloodline: false,
      description:
        "An Eldian family that originated in Marley, key figures in the conflict over the Founding Titan.",
    },
  ],
};
