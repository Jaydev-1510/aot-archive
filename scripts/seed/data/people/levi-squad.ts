import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("petra_ral"),
      name: "Petra Ral",
      japaneseName: "ペトラ・ラル",
      gender: "female",
      species: "human",
      status: "deceased",
      summary:
        "A handpicked soldier in the Survey Corps' Special Operations Squad under Captain Levi.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("oluo_bozado"),
      name: "Oluo Bozado",
      japaneseName: "オルオ・ボザド",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "An elite soldier of the Survey Corps' Special Operations Squad, known for boasting and frequently biting his tongue.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("eld_jinn"),
      name: "Eld Jinn",
      japaneseName: "エルド・ジン",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "The second-in-command of the Survey Corps' Special Operations Squad.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("gunther_schultz"),
      name: "Gunther Schultz",
      japaneseName: "グンタ・シュルツ",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "A stern and experienced member of the Survey Corps' Special Operations Squad.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("moblit_berner"),
      name: "Moblit Berner",
      japaneseName: "モブリット・バーナー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "The executive officer of the Survey Corps' Fourth Squad, acting as Hange Zoë's assistant.",
      provenance: { source: "aot_manga" },
    },
  ],
};
