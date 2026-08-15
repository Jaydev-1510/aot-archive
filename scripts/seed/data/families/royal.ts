import { familyId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  families: [
    {
      id: familyId("fritz_family"),
      name: "Fritz Family",
      isRoyalBloodline: true,
      description: "The original royal family of Eldia, directly descended from Ymir Fritz.",
    },
    {
      id: familyId("reiss_family"),
      name: "Reiss Family",
      isRoyalBloodline: true,
      description: "A branch of the Fritz family that ruled within the Walls on Paradis Island under an assumed name.",
    },
    {
      id: familyId("tybur_family"),
      name: "Tybur Family",
      isRoyalBloodline: false,
      description: "A noble Eldian family living in Marley that historically wielded the War Hammer Titan.",
    },
    {
      id: familyId("ackerman_family"),
      name: "Ackerman Family",
      isRoyalBloodline: false,
      description: "A bloodline with awakened physical abilities, immune to the Founding Titan's memory manipulation.",
    }
  ],
};
