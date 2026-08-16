import { eventId } from "../../ids";
import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  events: [
    {
      id: eventId("marley_mid_east_war"),
      name: "Marley Mid-East War",
      eventType: "war",
      chronology: { yearStart: 850, yearEnd: 854, datePrecision: "exact" },
      summary:
        "A four-year conflict between Marley and the Mid-East Allied Forces. Marley emerges victorious but their reliance on Titans is shown to be outdated against modern weaponry.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("volunteers_arrival"),
      name: "Arrival of the Anti-Marleyan Volunteers",
      eventType: "political",
      chronology: { yearStart: 851, datePrecision: "exact" },
      summary:
        "The Anti-Marleyan Volunteers, led by Yelena under Zeke Yeager's orders, arrive on Paradis Island aboard a Marleyan scouting fleet. They offer modern technology and an alliance against Marley.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("raid_on_liberio"),
      name: "Raid on Liberio",
      eventType: "battle",
      chronology: { yearStart: 854, datePrecision: "exact" },
      summary:
        "Eren Yeager and the Survey Corps launch a surprise attack on Liberio during Willy Tybur's declaration of war, resulting in devastating casualties and Eren inheriting the War Hammer Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("war_for_paradis"),
      name: "War for Paradis",
      eventType: "war",
      chronology: { yearStart: 854, datePrecision: "exact" },
      summary:
        "Marley launches a retaliatory surprise attack on Shiganshina District to defeat Eren Yeager and reclaim the Founding Titan.",
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("rumbling"),
      name: "The Rumbling",
      eventType: "disaster",
      chronology: { yearStart: 854, datePrecision: "exact" },
      summary:
        "Eren Yeager activates the Founding Titan and unleashes millions of Wall Titans to trample the world outside Paradis Island.",
      aliases: [
        { alias: "地鳴らし", aliasType: "japanese_name" },
        { alias: "Jinarashi", aliasType: "romanization" },
      ],
      provenance: { source: "aot_manga" },
    },
    {
      id: eventId("battle_of_heaven_and_earth"),
      name: "Battle of Heaven and Earth",
      eventType: "battle",
      chronology: { yearStart: 854, datePrecision: "exact" },
      summary:
        "The final battle at Fort Salta where the Global Alliance and former members of the Survey Corps unite to stop Eren Yeager and halt the Rumbling.",
      aliases: [
        { alias: "天と地の戦い", aliasType: "japanese_name" },
        { alias: "Ten to Chi no Tatakai", aliasType: "romanization" },
      ],
      provenance: { source: "aot_manga" },
    },
  ],
};
