import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("jean_kirstein"),
      name: "Jean Kirstein",
      japaneseName: "ジャン・キルシュタイン",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "Graduate of the 104th Training Corps who later joined the Survey Corps.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("connie_springer"),
      name: "Connie Springer",
      japaneseName: "コニー・スプリンガー",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "Graduate of the 104th Training Corps hailing from Ragako village; joined the Survey Corps.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("sasha_blouse"),
      name: "Sasha Blouse",
      japaneseName: "サシャ・ブラウス",
      gender: "female",
      species: "human",
      status: "deceased",
      summary:
        "Graduate of the 104th Training Corps from Dauper village, renowned for her archery and massive appetite.",
      aliases: [{ alias: "Potato Girl", aliasType: "nickname" }],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("historia_reiss"),
      name: "Historia Reiss",
      japaneseName: "ヒストリア・レイス",
      gender: "female",
      species: "human",
      status: "alive",
      summary:
        "The illegitimate and youngest child of Rod Reiss, later crowned Queen of the Walls.",
      aliases: [
        { alias: "Christa Lenz", aliasType: "alternate_name" },
        { alias: "Queen of the Walls", aliasType: "title" },
      ],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("ymir_104th"),
      name: "Ymir",
      japaneseName: "ユミル",
      gender: "female",
      species: "human",
      status: "deceased",
      summary:
        "Graduate of the 104th Training Corps and former holder of the Jaw Titan. A close companion of Historia Reiss.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("reiner_braun"),
      name: "Reiner Braun",
      japaneseName: "ライナー・ブラウン",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "Marleyan Warrior and holder of the Armored Titan who infiltrated Paradis Island.",
      aliases: [{ alias: "Armored Titan", aliasType: "title" }],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("bertolt_hoover"),
      name: "Bertolt Hoover",
      japaneseName: "ベルトルト・フーバー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary: "Marleyan Warrior and former holder of the Colossal Titan.",
      aliases: [{ alias: "Colossal Titan", aliasType: "title" }],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("annie_leonhart"),
      name: "Annie Leonhart",
      japaneseName: "アニ・レオンハート",
      gender: "female",
      species: "human",
      status: "alive",
      summary: "Marleyan Warrior and holder of the Female Titan.",
      aliases: [{ alias: "Female Titan", aliasType: "title" }],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("marco_bott"),
      name: "Marco Bott",
      japaneseName: "マルコ・ボット",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Graduate of the 104th Training Corps who died during the battle of Trost District.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("floch_forster"),
      name: "Floch Forster",
      japaneseName: "フロック・フォルスター",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "A recruit in the Survey Corps who survived the charge in Shiganshina and later became a leader of the Yeagerists.",
      provenance: { source: "aot_manga" },
    },
  ],
};
