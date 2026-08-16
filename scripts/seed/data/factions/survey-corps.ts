import { factionId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  factions: [
    {
      id: factionId("survey_corps"),
      name: "Survey Corps",
      factionType: "military",
      description:
        "The military branch responsible for beyond-wall expeditions and titan research.",
      aliases: [
        { alias: "調査兵団", aliasType: "japanese_name" },
        { alias: "Chōsa Heidan", aliasType: "romanization" },
      ],
    },
    {
      id: factionId("garrison"),
      name: "Garrison",
      factionType: "military",
      description:
        "The military branch that guards and maintains the Walls and protects civilians.",
      aliases: [
        { alias: "駐屯兵団", aliasType: "japanese_name" },
        { alias: "Chūton Heidan", aliasType: "romanization" },
      ],
    },
    {
      id: factionId("military_police"),
      name: "Military Police Brigade",
      factionType: "military",
      description:
        "The elite military branch serving as interior law enforcement and royal guard.",
      aliases: [
        { alias: "憲兵団", aliasType: "japanese_name" },
        { alias: "Kenpeidan", aliasType: "romanization" },
      ],
    },
    {
      id: factionId("training_corps"),
      name: "Training Corps",
      factionType: "military",
      description:
        "The military branch dedicated to the training and education of recruits.",
      aliases: [
        { alias: "訓練兵団", aliasType: "japanese_name" },
        { alias: "Kunren Heidan", aliasType: "romanization" },
      ],
    },
  ],
};
