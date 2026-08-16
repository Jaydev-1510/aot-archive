import { objectId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  objects: [
    {
      id: objectId("basement_key"),
      name: "Basement Key",
      objectType: "artifact",
      description:
        "The key to Grisha Yeager's basement in Shiganshina, given to Eren Yeager before Grisha's death. It held the truth of the outside world.",
    },
    {
      id: objectId("odm_gear"),
      name: "Omni-Directional Mobility Gear",
      objectType: "equipment",
      description:
        "Specialized gear developed by the people of Paradis Island to fight Titans in a 3D space. Propelled by pressurized gas and equipped with grapple hooks and replaceable blades.",
      aliases: [{ alias: "ODM Gear", aliasType: "alternate_name" }],
    },
    {
      id: objectId("thunder_spears"),
      name: "Thunder Spears",
      objectType: "weapon",
      description:
        "A rocket-propelled explosive weapon developed by Hange Zoe's research team to penetrate the Armored Titan's hardened skin.",
    },
    {
      id: objectId("titan_serum"),
      name: "Titan Injection Serum",
      objectType: "artifact",
      description:
        "Spinal fluid from a Titan (or specifically the Founding/Royal Titan) used to turn Subjects of Ymir into Pure Titans.",
    },
    {
      id: objectId("ilses_notebook"),
      name: "Ilse's Notebook",
      objectType: "document",
      description:
        "A journal kept by Survey Corps member Ilse Langnar detailing her encounter with a talking Titan, recovered by Levi and Hange.",
    },
    {
      id: objectId("anti_personnel_odm"),
      name: "Anti-Personnel ODM Gear",
      objectType: "equipment",
      description:
        "A variation of ODM gear designed by the Interior Military Police for fighting humans rather than Titans. It replaces blades with firearms.",
    },
  ],
};
