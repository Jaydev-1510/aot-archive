import { titanId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  titans: [
    {
      id: titanId("attack_titan"),
      name: "Attack Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans. It is known for always moving ahead, seeking freedom, and its unique ability allows its inheritors to view the memories of both past and future holders.",
      aliases: [
        { alias: "進撃の巨人", aliasType: "japanese_name" },
        { alias: "Shingeki no Kyojin", aliasType: "romanization" },
        { alias: "Advancing Titan", aliasType: "alternate_name" },
      ],
      abilities: [
        { ability: "Future Memory Inheritance" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("founding_titan"),
      name: "Founding Titan",
      titanClass: "nine_titans",
      description:
        "The first and most powerful of the Nine Titans. Its holder can control pure titans, manipulate the memories and bodies of all Subjects of Ymir, and possesses the Coordinate.",
      aliases: [
        { alias: "始祖の巨人", aliasType: "japanese_name" },
        { alias: "Shiso no Kyojin", aliasType: "romanization" },
        { alias: "Progenitor Titan", aliasType: "alternate_name" },
      ],
      abilities: [
        { ability: "Coordinate" },
        { ability: "Memory Manipulation" },
        { ability: "Titan Creation" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("colossal_titan"),
      name: "Colossal Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, notable for its massive 60-meter size and its ability to emit immense amounts of steam, as well as causing a massive explosive blast upon transformation.",
      aliases: [
        { alias: "超大型巨人", aliasType: "japanese_name" },
        { alias: "Chō Ōgata Kyojin", aliasType: "romanization" },
        { alias: "God of Destruction", aliasType: "epithet" },
      ],
      abilities: [
        { ability: "Explosive Transformation" },
        { ability: "Steam Emission" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("armored_titan"),
      name: "Armored Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, covered in thick, hardened armor plating over most of its body. It acts as a powerful ram and shield, though the armor compromises its speed.",
      aliases: [
        { alias: "鎧の巨人", aliasType: "japanese_name" },
        { alias: "Yoroi no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Armor Plating" },
        { ability: "Hardening" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("female_titan"),
      name: "Female Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, possessing high mobility and endurance. It is highly versatile, capable of mimicking the abilities of other titans, and can attract pure titans with its scream.",
      aliases: [
        { alias: "女型の巨人", aliasType: "japanese_name" },
        { alias: "Megata no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Titan Attraction" },
        { ability: "Ability Mimicry" },
        { ability: "Selective Hardening/Crystallization" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("beast_titan"),
      name: "Beast Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, known for taking on animal-like traits that vary significantly depending on the holder. It is also notably larger than typical titans.",
      aliases: [
        { alias: "獣の巨人", aliasType: "japanese_name" },
        { alias: "Kemono no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Hardening" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("jaw_titan"),
      name: "Jaw Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, known for its incredible speed, agility, and devastatingly powerful jaws and claws capable of tearing through nearly any hardened material.",
      aliases: [
        { alias: "顎の巨人", aliasType: "japanese_name" },
        { alias: "Agito no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Crushing Jaw and Claws" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("cart_titan"),
      name: "Cart Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, possessing a quadrupedal form and extraordinary endurance. This allows its holder to remain transformed for months and carry heavy armaments.",
      aliases: [
        { alias: "車力の巨人", aliasType: "japanese_name" },
        { alias: "Shariki no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Quadrupedal Endurance" },
        { ability: "Extended Transformation" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
    {
      id: titanId("war_hammer_titan"),
      name: "War Hammer Titan",
      titanClass: "nine_titans",
      description:
        "One of the Nine Titans, capable of manifesting versatile structures, weapons, and spikes out of hardened titan flesh. Uniquely, its holder can operate the titan body remotely via a flesh cable.",
      aliases: [
        { alias: "戦鎚の巨人", aliasType: "japanese_name" },
        { alias: "Sentsui no Kyojin", aliasType: "romanization" },
      ],
      abilities: [
        { ability: "Structural Creation" },
        { ability: "Remote Operation" },
        { ability: "Hardening" },
        { ability: "Enhanced Regeneration" },
      ],
      provenance: { canonStatus: "manga" },
    },
  ],
};
