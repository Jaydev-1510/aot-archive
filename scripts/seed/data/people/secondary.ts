import { personId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  people: [
    {
      id: personId("hitch_dreyse"),
      name: "Hitch Dreyse",
      japaneseName: "ヒッチ・ドリス",
      gender: "female",
      species: "human",
      status: "alive",
      summary:
        "A private in the Military Police Brigade stationed in Stohess District.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("marlowe_freudenberg"),
      name: "Marlowe Freudenberg",
      japaneseName: "マルロ・フロイデンベルク",
      gender: "male",
      species: "human",
      status: "deceased",
      summary:
        "A principled soldier who joined the Military Police before transferring to the Survey Corps; killed during the charge against the Beast Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("niccolo"),
      name: "Niccolo",
      japaneseName: "ニコロ",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "A Marleyan soldier taken prisoner on Paradis who became a chef, forming a bond with Sasha Blouse.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("onyankopon"),
      name: "Onyankopon",
      japaneseName: "オニャンコポン",
      gender: "male",
      species: "human",
      status: "alive",
      summary:
        "A member of the Anti-Marleyan Volunteers who aided Paradis Island with modern technology.",
      provenance: { source: "aot_manga" },
    },
    {
      id: personId("yelena"),
      name: "Yelena",
      japaneseName: "イェレナ",
      gender: "female",
      species: "human",
      status: "alive",
      summary:
        "The leader of the Anti-Marleyan Volunteers and a devoted follower of Zeke Yeager.",
      provenance: { source: "aot_manga" },
    },
  ],
};
