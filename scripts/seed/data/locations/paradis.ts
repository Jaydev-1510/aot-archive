import { locationId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  locations: [
    {
      id: locationId("paradis_island"),
      name: "Paradis Island",
      locationType: "island",
      description:
        "An island located off the coast of Marley, where Karl Fritz retreated with a large number of Eldians.",
    },
    {
      id: locationId("wall_maria"),
      name: "Wall Maria",
      locationType: "wall",
      parentLocation: locationId("paradis_island"),
      description: "The outermost of the three Walls on Paradis Island.",
    },
    {
      id: locationId("shiganshina_district"),
      name: "Shiganshina District",
      locationType: "district",
      parentLocation: locationId("wall_maria"),
      description:
        "A district located on the southern edge of Wall Maria, the hometown of Eren, Mikasa, and Armin.",
    },
    {
      id: locationId("wall_rose"),
      name: "Wall Rose",
      locationType: "wall",
      parentLocation: locationId("paradis_island"),
      description: "The middle wall of the three Walls on Paradis Island.",
    },
    {
      id: locationId("trost_district"),
      name: "Trost District",
      locationType: "district",
      parentLocation: locationId("wall_rose"),
      description: "A district located on the southern edge of Wall Rose.",
    },
    {
      id: locationId("karanes_district"),
      name: "Karanes District",
      locationType: "district",
      parentLocation: locationId("wall_rose"),
      description: "A district located on the eastern edge of Wall Rose.",
    },
    {
      id: locationId("utgard_castle"),
      name: "Utgard Castle",
      locationType: "landmark",
      parentLocation: locationId("wall_rose"),
      description: "An abandoned castle located within Wall Rose.",
    },
    {
      id: locationId("ragako_village"),
      name: "Ragako Village",
      locationType: "city",
      parentLocation: locationId("wall_rose"),
      description:
        "A village located within Wall Rose, the hometown of Connie Springer.",
    },
    {
      id: locationId("wall_sheena"),
      name: "Wall Sheena",
      locationType: "wall",
      parentLocation: locationId("paradis_island"),
      description:
        "The innermost wall of the three Walls on Paradis Island, protecting the royal capital.",
    },
    {
      id: locationId("stohess_district"),
      name: "Stohess District",
      locationType: "district",
      parentLocation: locationId("wall_sheena"),
      description: "A district located on the eastern edge of Wall Sheena.",
    },
    {
      id: locationId("mitras"),
      name: "Mitras",
      locationType: "city",
      parentLocation: locationId("wall_sheena"),
      description:
        "The capital city of Paradis Island, located within the center of Wall Sheena.",
    },
    {
      id: locationId("orvud_district"),
      name: "Orvud District",
      locationType: "district",
      parentLocation: locationId("wall_sheena"),
      description: "A district located on the northern edge of Wall Sheena.",
    },
    {
      id: locationId("underground_city"),
      name: "Underground City",
      locationType: "district",
      parentLocation: locationId("wall_sheena"),
      description:
        "A massive underground settlement located beneath the capital city of Mitras.",
    },
    {
      id: locationId("dauper_village"),
      name: "Dauper Village",
      locationType: "city",
      parentLocation: locationId("wall_rose"),
      description:
        "A small hunting village situated in the southern mountains of Wall Rose, hometown of Sasha Blouse.",
    },
    {
      id: locationId("reiss_chapel"),
      name: "Reiss Underground Chapel",
      locationType: "landmark",
      parentLocation: locationId("wall_rose"),
      description:
        "A massive underground cavern made of glowing crystals beneath a modest chapel on the Reiss family estate. The traditional site of the Founding Titan inheritance ritual.",
    },
    {
      id: locationId("forest_of_giant_trees"),
      name: "Forest of Giant Trees",
      locationType: "region",
      parentLocation: locationId("wall_maria"),
      description:
        "A forest containing trees over 80 meters tall. Located within Wall Maria, it served as a critical location during the 57th Expedition.",
    },
  ],
};
