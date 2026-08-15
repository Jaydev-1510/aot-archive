import { locationId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  locations: [
    {
      id: locationId("hizuru"),
      name: "Hizuru",
      locationType: "nation",
      description:
        "An eastern nation across the sea that was historically allied with the Eldian Empire.",
    },
  ],
};
