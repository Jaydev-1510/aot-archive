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
