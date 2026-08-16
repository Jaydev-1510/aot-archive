import { familyId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  families: [
    {
      id: familyId("braun_family"),
      name: "Braun Family",
      isRoyalBloodline: false,
      description: "An Eldian family residing in the Liberio Internment Zone.",
    },
    {
      id: familyId("leonhart_family"),
      name: "Leonhart Family",
      isRoyalBloodline: false,
      description: "An Eldian family living in the Liberio Internment Zone.",
    },
    {
      id: familyId("springer_family"),
      name: "Springer Family",
      isRoyalBloodline: false,
      description:
        "A family residing in Ragako Village within Wall Rose on Paradis Island.",
    },
    {
      id: familyId("braus_family"),
      name: "Braus Family",
      isRoyalBloodline: false,
      description: "A family from Dauper Village with a tradition of hunting.",
    },
    {
      id: familyId("arlert_family"),
      name: "Arlert Family",
      isRoyalBloodline: false,
      description: "A family residing in the Shiganshina District.",
    },
    {
      id: familyId("grice_family"),
      name: "Grice Family",
      isRoyalBloodline: false,
      description:
        "An Eldian family in Marley known for involvement with the Eldian Restorationists.",
    },
    {
      id: familyId("galliard_family"),
      name: "Galliard Family",
      isRoyalBloodline: false,
      description: "An Eldian family in Marley.",
    },
    {
      id: familyId("kirstein_family"),
      name: "Kirstein Family",
      isRoyalBloodline: false,
      description: "A family residing in the Trost District on Paradis Island.",
    },
    {
      id: familyId("azumabito_family"),
      name: "Azumabito Family",
      isRoyalBloodline: true,
      description:
        "An aristocratic family and leading clan of the nation of Hizuru.",
    },
  ],
};
