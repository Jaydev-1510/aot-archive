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
    },
    {
      id: factionId("garrison"),
      name: "Garrison",
      factionType: "military",
      description:
        "The military branch that guards and maintains the Walls and protects civilians.",
    },
    {
      id: factionId("military_police"),
      name: "Military Police Brigade",
      factionType: "military",
      description:
        "The elite military branch serving as interior law enforcement and royal guard.",
    },
    {
      id: factionId("training_corps"),
      name: "Training Corps",
      factionType: "military",
      description:
        "The military branch dedicated to the training and education of recruits.",
    },
  ],
};
