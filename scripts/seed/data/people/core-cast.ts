import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("eren_yeager"),
      name: "Eren Yeager",
      japaneseName: "エレン・イェーガー",
      gender: "male",
      species: "human",
      status: "deceased",
      birth: { yearStart: 835, datePrecision: "circa" },
      death: { yearStart: 854, datePrecision: "circa" },
      summary:
        "Protagonist; son of Grisha and Carla Yeager, adoptive brother of Mikasa Ackerman, and eventual holder of the Attack Titan.",
      aliases: [
        { alias: "Attack Titan", aliasType: "title" },
        { alias: "Suicidal Blockhead", aliasType: "nickname" },
      ],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("mikasa_ackerman"),
      name: "Mikasa Ackerman",
      japaneseName: "ミカサ・アッカーマン",
      gender: "female",
      species: "human",
      status: "alive",
      summary:
        "Childhood friend of Eren Yeager, adopted into the Yeager family after her parents were killed; later a Survey Corps soldier.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("armin_arlert"),
      name: "Armin Arlert",
      japaneseName: "アルミン・アルレルト",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "Childhood friend of Eren Yeager and Mikasa Ackerman, grew up with them in Shiganshina District.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("grisha_yeager"),
      name: "Grisha Yeager",
      japaneseName: "グリシャ・イェーガー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Father of Eren Yeager, adoptive father of Mikasa Ackerman, husband of Carla Yeager; a physician in Shiganshina District and former holder of the Attack Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("carla_yeager"),
      name: "Carla Yeager",
      japaneseName: "カルラ・イェーガー",
      gender: "female",
      species: "human",
      status: "deceased",
      death: { yearStart: 845, datePrecision: "circa" },
      summary:
        "Mother of Eren Yeager and wife of Grisha Yeager; killed during the fall of Shiganshina District.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("zeke_yeager"),
      name: "Zeke Yeager",
      japaneseName: "ジーク・イェーガー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Son of Grisha Yeager and Dina Fritz, half-brother of Eren Yeager, and holder of the Beast Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("dina_fritz"),
      name: "Dina Fritz",
      japaneseName: "ダイナ・フリッツ",
      gender: "female",
      species: "human",
      status: "deceased",
      summary:
        "Member of the Fritz royal family, first wife of Grisha Yeager, and mother of Zeke Yeager.",
      provenance: { source: "aot_manga" },
    },
  ],
};
