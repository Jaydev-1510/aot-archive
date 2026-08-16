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
      aliases: [
        { alias: "反マーレ派義勇兵", aliasType: "japanese_name" },
        { alias: "Han Māre-ha Giyūhei", aliasType: "romanization" },
      ],
    },
    {
      id: factionId("yeagerists"),
      name: "Yeagerists",
      factionType: "militia",
      description:
        "A rebel faction in Paradis Island intensely loyal to Eren Yeager.",
      aliases: [
        { alias: "イェーガー派", aliasType: "japanese_name" },
        { alias: "Iēgā-ha", aliasType: "romanization" },
      ],
    },
    {
      id: factionId("eldian_empire"),
      name: "Eldian Empire",
      factionType: "political",
      description:
        "The ancient superpower ruled by the Subjects of Ymir and the Fritz dynasty.",
    },
    {
      id: factionId("order_of_the_walls"),
      name: "Order of the Walls",
      factionType: "political",
      description:
        "A religious organization that worships the Walls and protects their secrets.",
    },
    {
      id: factionId("reeves_company"),
      name: "Reeves Company",
      factionType: "other",
      description:
        "A powerful merchant guild based in Trost District that controlled significant economic resources.",
    },
  ],
};
