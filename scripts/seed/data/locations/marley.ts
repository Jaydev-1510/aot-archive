import { locationId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  locations: [
    {
      id: locationId("marley"),
      name: "Marley",
      locationType: "nation",
      description: "A large empire located beyond the ocean from Paradis Island.",
    },
    {
      id: locationId("liberio"),
      name: "Liberio",
      locationType: "city",
      parentLocation: locationId("marley"),
      description: "A major city in Marley that contains an internment zone for Eldians.",
    },
    {
      id: locationId("liberio_internment_zone"),
      name: "Liberio Internment Zone",
      locationType: "district",
      parentLocation: locationId("liberio"),
      description: "A walled district within the city of Liberio where Eldians are forced to live.",
    },
    {
      id: locationId("fort_salta"),
      name: "Fort Salta",
      locationType: "landmark",
      parentLocation: locationId("marley"),
      description: "A Marleyan military base and research facility in the southern mountains, site of the final battle.",
    }
  ],
};
