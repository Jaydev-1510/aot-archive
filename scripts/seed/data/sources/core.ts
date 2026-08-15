import { sourceSeedKey } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  sources: [
    { key: sourceSeedKey("aot_manga"), title: "Attack on Titan manga by Hajime Isayama", sourceType: "manga" },
    { key: sourceSeedKey("aot_anime"), title: "Attack on Titan anime adaptation", sourceType: "anime" },
    { key: sourceSeedKey("aot_guidebook"), title: "Attack on Titan: INSIDE & OUTSIDE", sourceType: "guidebook" },
    { key: sourceSeedKey("aot_answers"), title: "Attack on Titan: ANSWERS", sourceType: "guidebook" },
    { key: sourceSeedKey("aot_character_encyclopedia"), title: "Attack on Titan Character Encyclopedia", sourceType: "character-book" },
  ],
};
