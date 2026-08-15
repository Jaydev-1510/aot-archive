import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("ymir_fritz"),
      name: "Ymir Fritz",
      japaneseName: "ユミル・フリッツ",
      gender: "female",
      species: "human",
      status: "deceased",
      summary: "The first person to obtain the power of the Titans, known as the Progenitor.",
      aliases: [
        { alias: "Founder Ymir", aliasType: "title" }
      ],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("karl_fritz"),
      name: "Karl Fritz",
      japaneseName: "カール・フリッツ",
      gender: "male",
      species: "human",
      status: "deceased",
      summary: "The 145th King of the Eldian Empire who relocated his people to Paradis Island and built the Walls.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("frieda_reiss"),
      name: "Frieda Reiss",
      japaneseName: "フリーダ・レイス",
      gender: "female",
      species: "human",
      status: "deceased",
      summary: "The eldest daughter of Rod Reiss and former holder of the Founding Titan, killed by Grisha Yeager.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("rod_reiss"),
      name: "Rod Reiss",
      japaneseName: "ロッド・レイス",
      gender: "male",
      species: "human",
      status: "deceased",
      summary: "The true king of the Walls and father of Historia Reiss.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("uri_reiss"),
      name: "Uri Reiss",
      japaneseName: "ウーリ・レイス",
      gender: "male",
      species: "human",
      status: "deceased",
      summary: "The younger brother of Rod Reiss, former holder of the Founding Titan, and close friend of Kenny Ackerman.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("kuchel_ackerman"),
      name: "Kuchel Ackerman",
      japaneseName: "クシェル・アッカーマン",
      gender: "female",
      species: "human",
      status: "deceased",
      summary: "The younger sister of Kenny Ackerman and the mother of Levi.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("faye_yeager"),
      name: "Faye Yeager",
      japaneseName: "フェイ・イェーガー",
      gender: "female",
      species: "human",
      status: "deceased",
      summary: "The younger sister of Grisha Yeager, who was killed by Marleyan officers as a child.",
      provenance: { source: "aot_manga" },
    }
  ],
};
