import type { SeedDataset } from "../../types";

export const dataset: SeedDataset = {
  relationshipTypes: [
    // Family
    {
      slug: "parent-of",
      category: "family",
      inverseSlug: "child-of",
      description: "Parent of a child",
    },
    {
      slug: "child-of",
      category: "family",
      inverseSlug: "parent-of",
      description: "Child of a parent",
    },
    {
      slug: "spouse-of",
      category: "family",
      isSymmetric: true,
      description: "Spouse of a person",
    },
    {
      slug: "sibling-of",
      category: "family",
      isSymmetric: true,
      description: "Sibling of a person",
    },
    {
      slug: "ancestor-of",
      category: "family",
      inverseSlug: "descendant-of",
      description:
        "Ancestor of a person, used when exact intermediate generations are unknown",
    },
    {
      slug: "descendant-of",
      category: "family",
      inverseSlug: "ancestor-of",
      description:
        "Descendant of a person, used when exact intermediate generations are unknown",
    },
    {
      slug: "adopted-parent-of",
      category: "family",
      inverseSlug: "adopted-child-of",
      description: "Adopted parent of a child",
    },
    {
      slug: "adopted-child-of",
      category: "family",
      inverseSlug: "adopted-parent-of",
      description: "Adopted child of a parent",
    },

    // Faction
    {
      slug: "member-of",
      category: "faction",
      inverseSlug: "has-member",
      description: "Member of a faction or group",
    },
    {
      slug: "has-member",
      category: "faction",
      inverseSlug: "member-of",
      description: "Faction or group having a member",
    },
    {
      slug: "leader-of",
      category: "faction",
      inverseSlug: "led-by",
      description: "Leader of a faction or group",
    },
    {
      slug: "led-by",
      category: "faction",
      inverseSlug: "leader-of",
      description: "Faction or group led by a person",
    },
    {
      slug: "subordinate-of",
      category: "faction",
      inverseSlug: "commands",
      description: "Subordinate to a person",
    },
    {
      slug: "commands",
      category: "faction",
      inverseSlug: "subordinate-of",
      description: "Person who commands a subordinate",
    },

    // Location
    {
      slug: "born-at",
      category: "location",
      inverseSlug: "birthplace-of",
      description: "Location where a person was born",
    },
    {
      slug: "birthplace-of",
      category: "location",
      inverseSlug: "born-at",
      description: "Birthplace of a person",
    },
    {
      slug: "died-at",
      category: "location",
      inverseSlug: "death-site-of",
      description: "Location where a person died",
    },
    {
      slug: "death-site-of",
      category: "location",
      inverseSlug: "died-at",
      description: "Site where a person died",
    },
    {
      slug: "resides-in",
      category: "location",
      inverseSlug: "resident-of",
      description: "Location where a person resides",
    },
    {
      slug: "resident-of",
      category: "location",
      inverseSlug: "resides-in",
      description: "Resident of a location",
    },
    {
      slug: "occurred-at",
      category: "location",
      inverseSlug: "site-of",
      description: "Location where an event occurred",
    },
    {
      slug: "site-of",
      category: "location",
      inverseSlug: "occurred-at",
      description: "Site of an event",
    },

    // Historical
    {
      slug: "participant-in",
      category: "historical",
      inverseSlug: "had-participant",
      description: "Participant in an event",
    },
    {
      slug: "had-participant",
      category: "historical",
      inverseSlug: "participant-in",
      description: "Event having a participant",
    },
    {
      slug: "involved-in",
      category: "historical",
      inverseSlug: "involved-faction",
      description: "Faction or organization involved in an event",
    },
    {
      slug: "involved-faction",
      category: "historical",
      inverseSlug: "involved-in",
      description: "Event involving a faction",
    },
    {
      slug: "caused",
      category: "historical",
      inverseSlug: "caused-by",
      description: "Caused an event or outcome",
    },
    {
      slug: "caused-by",
      category: "historical",
      inverseSlug: "caused",
      description: "Caused by a person or event",
    },

    // Social
    {
      slug: "mentor-of",
      category: "social",
      inverseSlug: "mentored-by",
      description: "Mentor of a person",
    },
    {
      slug: "mentored-by",
      category: "social",
      inverseSlug: "mentor-of",
      description: "Mentored by a person",
    },
    {
      slug: "comrade-of",
      category: "social",
      isSymmetric: true,
      description: "Comrade of a person",
    },

    // Political
    {
      slug: "allied-with",
      category: "political",
      isSymmetric: true,
      description: "Allied with a faction or entity",
    },
    {
      slug: "rules",
      category: "political",
      inverseSlug: "ruled-by",
      description: "Rules a faction or location",
    },
    {
      slug: "ruled-by",
      category: "political",
      inverseSlug: "rules",
      description: "Ruled by a person or faction",
    },

    // Objects
    {
      slug: "possesses",
      category: "ownership",
      inverseSlug: "possessed-by",
      description: "Possesses or owns an object/artifact",
    },
    {
      slug: "possessed-by",
      category: "ownership",
      inverseSlug: "possesses",
      description: "Object possessed or owned by a person/faction",
    },
    {
      slug: "uses",
      category: "ownership",
      inverseSlug: "used-by",
      description: "Uses an object or weapon",
    },
    {
      slug: "used-by",
      category: "ownership",
      inverseSlug: "uses",
      description: "Object or weapon used by a person/faction",
    },
  ],
};
