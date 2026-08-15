import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("pieck_finger"),
      name: "Pieck Finger",
      japaneseName: "ピーク・フィンガー",
      gender: "female",
      species: "human",
      status: "alive",
      summary: "Marleyan Warrior and holder of the Cart Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("porco_galliard"),
      name: "Porco Galliard",
      japaneseName: "ポルコ・ガリアード",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Marleyan Warrior and holder of the Jaw Titan, brother of Marcel.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("colt_grice"),
      name: "Colt Grice",
      japaneseName: "コルト・グライス",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Warrior candidate chosen to inherit the Beast Titan, older brother of Falco.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("falco_grice"),
      name: "Falco Grice",
      japaneseName: "ファルコ・グライス",
      gender: "male",
      species: "human",
      status: "alive",
      summary: "Warrior candidate who eventually inherits the Jaw Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("gabi_braun"),
      name: "Gabi Braun",
      japaneseName: "ガビ・ブラウン",
      gender: "female",
      species: "human",
      status: "alive",
      summary:
        "Warrior candidate and cousin of Reiner Braun, highly dedicated to Marley.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("marcel_galliard"),
      name: "Marcel Galliard",
      japaneseName: "マルセル・ガリアード",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Marleyan Warrior and former holder of the Jaw Titan, devoured by Ymir on Paradis.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("tom_ksaver"),
      name: "Tom Ksaver",
      japaneseName: "クサヴァー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "A Titan researcher for Marley and former holder of the Beast Titan, who mentored Zeke Yeager.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("theo_magath"),
      name: "Theo Magath",
      japaneseName: "テオ・マガト",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "Commander of the Marleyan military's Warrior Unit, later ascending to General.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("willy_tybur"),
      name: "Willy Tybur",
      japaneseName: "ヴィリー・タイバー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "The head of the Tybur family, an aristocratic Eldian family residing in Marley.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("lara_tybur"),
      name: "Lara Tybur",
      japaneseName: "ラーラ・タイバー",
      gender: "female",
      species: "human",
      status: "deceased",
      summary:
        "The younger sister of Willy Tybur and holder of the War Hammer Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("eren_kruger"),
      name: "Eren Kruger",
      japaneseName: "エレン・クルーガー",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "An Eldian spy within the Marleyan Public Security Authorities known as 'The Owl', and former holder of the Attack Titan.",
      aliases: [{ alias: "The Owl", aliasType: "title" }],
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("gross"),
      name: "Sergeant Major Gross",
      japaneseName: "グロス",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "A sadistic officer in the Marleyan Public Security Authorities responsible for the death of Faye Yeager.",
      provenance: { source: "aot_manga" },
    },
  ],
};
