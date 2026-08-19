import { expect, test, describe, beforeAll } from "bun:test";
import { Database } from "bun:sqlite";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createDb } from "../database";
import {
  getEntity,
  getPerson,
  getPersonDetail,
  getTitan,
  getTitanHolders,
  getRelationshipsForEntity,
  getTimeline,
  searchArchive,
  getBloodlineGraph,
  getTitanInheritanceGraph,
  getParents,
  getChildren,
  getSpouses,
  getSiblings,
  getEventParticipation,
  getFactionMemberships,
} from "../database/queries";
import { validateDataset } from "../../scripts/seed/validation/validate-dataset";
import type { SeedDataset } from "../../scripts/seed/types";
import { personId } from "../../scripts/seed/ids";

let db: any;

// Helper to find and mock the local sqlite file in wrangler local D1 state
async function findSqliteFile(): Promise<string> {
  const dir = path.join(
    process.cwd(),
    ".wrangler",
    "state",
    "v3",
    "d1",
    "miniflare-D1DatabaseObject",
  );
  const files = await fs.readdir(dir);
  const sqliteFile = files.find(
    (f) => f.endsWith(".sqlite") && f !== "metadata.sqlite",
  );
  if (!sqliteFile) {
    throw new Error(
      "No SQLite file found in wrangler local D1 state directory. Please run migrations first.",
    );
  }
  return path.join(dir, sqliteFile);
}

function mockD1(sqlitePath: string): any {
  const sqliteDb = new Database(sqlitePath);

  const prepare = (sql: string) => {
    return {
      bind(...args: any[]) {
        return {
          async all() {
            const stmt = sqliteDb.prepare(sql);
            const results = stmt.all(...args);
            return { results, success: true };
          },
          async run() {
            const stmt = sqliteDb.prepare(sql);
            stmt.run(...args);
            return { success: true };
          },
          async raw() {
            const stmt = sqliteDb.prepare(sql);
            return stmt.values(...args);
          },
        };
      },
    };
  };

  return {
    prepare,
    async batch(statements: any[]) {
      const results = [];
      for (const stmt of statements) {
        results.push(await stmt.all());
      }
      return results;
    },
    async exec(sql: string) {
      sqliteDb.run(sql);
      return { count: 0, duration: 0 };
    },
  };
}

beforeAll(async () => {
  const sqlitePath = await findSqliteFile();
  const d1 = mockD1(sqlitePath);
  db = createDb(d1);
});

describe("DATABASE / REPOSITORY", () => {
  test("entity lookup", async () => {
    const entity = await getEntity(db, "eren_yeager");
    expect(entity).not.toBeNull();
    expect(entity!.entityType).toBe("person");
  });

  test("person lookup", async () => {
    const result = await getPerson(db, "eren_yeager");
    expect(result).not.toBeNull();
    expect(result!.person.name).toBe("Eren Yeager");
    expect(result!.person.japaneseName).toBe("エレン・イェーガー");
  });

  test("person details & aliases lookup", async () => {
    const detail = await getPersonDetail(db, "eren_yeager");
    expect(detail).not.toBeNull();
    expect(detail!.aliases.some((a) => a.alias === "Suicidal Blockhead")).toBe(
      true,
    );
  });

  test("Titan lookup & class", async () => {
    const titan = await getTitan(db, "attack_titan");
    expect(titan).not.toBeNull();
    expect(titan!.name).toBe("Attack Titan");
    expect(titan!.titanClass).toBe("nine_titans");
  });

  test("Titan holders ordering", async () => {
    const holders = await getTitanHolders(db, "attack_titan");
    expect(holders.length).toBeGreaterThanOrEqual(3); // Eren, Grisha, Eren Kruger

    // Validate order: Eren Kruger -> Grisha -> Eren Yeager
    const names = holders.map((h) => h.person.id);
    const krugerIdx = names.indexOf("eren_kruger");
    const grishaIdx = names.indexOf("grisha_yeager");
    const erenIdx = names.indexOf("eren_yeager");

    expect(krugerIdx).toBeLessThan(grishaIdx);
    expect(grishaIdx).toBeLessThan(erenIdx);
  });

  test("relationship queries (incoming and outgoing)", async () => {
    const rels = await getRelationshipsForEntity(db, "eren_yeager");
    expect(rels.length).toBeGreaterThan(0);

    // Verify parentage inverse is resolved correctly (Eren should have an incoming parent-of edge resolved as child-of)
    const fatherRel = rels.find((r) => r.relatedEntity.id === "grisha_yeager");
    expect(fatherRel).toBeDefined();
    expect(fatherRel!.predicate).toBe("child-of");
    expect(fatherRel!.direction).toBe("incoming");
  });

  test("parents helper function", async () => {
    const parents = await getParents(db, "eren_yeager");
    expect(parents.length).toBe(2);
    const parentIds = parents.map((p) => p.relatedEntity.id);
    expect(parentIds).toContain("grisha_yeager");
    expect(parentIds).toContain("carla_yeager");
  });

  test("children helper function", async () => {
    const children = await getChildren(db, "grisha_yeager");
    expect(children.length).toBe(2);
    const childIds = children.map((c) => c.relatedEntity.id);
    expect(childIds).toContain("eren_yeager");
    expect(childIds).toContain("zeke_yeager");
  });

  test("siblings helper function", async () => {
    const siblings = await getSiblings(db, "eren_yeager");
    expect(siblings.length).toBe(1);
    expect(siblings[0].relatedEntity.id).toBe("zeke_yeager");
  });

  test("spouses helper function", async () => {
    const spouses = await getSpouses(db, "grisha_yeager");
    expect(spouses.length).toBe(2); // Carla Yeager and Dina Fritz
    const spouseIds = spouses.map((s) => s.relatedEntity.id);
    expect(spouseIds).toContain("carla_yeager");
    expect(spouseIds).toContain("dina_fritz");
  });

  test("faction membership queries", async () => {
    const memberships = await getFactionMemberships(db, "eren_yeager");
    expect(memberships.length).toBe(2);
    const factionIds = memberships.map((m) => m.relatedEntity.id);
    expect(factionIds).toContain("survey_corps");
    expect(factionIds).toContain("training_corps");
  });

  test("event participation queries", async () => {
    const events = await getEventParticipation(db, "eren_yeager");
    expect(events.length).toBeGreaterThanOrEqual(4);
    const eventIds = events.map((e) => e.relatedEntity.id);
    expect(eventIds).toContain("fall_of_shiganshina");
    expect(eventIds).toContain("battle_of_trost");
  });

  test("timeline chronology ordering", async () => {
    const timeline = await getTimeline(db);
    expect(timeline.length).toBeGreaterThan(0);

    // Verify chronological sorting (non-null yearStart should be sorted in ascending order)
    let lastYear = -Infinity;
    for (const entry of timeline) {
      if (entry.yearStart !== null) {
        expect(entry.yearStart).toBeGreaterThanOrEqual(lastYear);
        lastYear = entry.yearStart;
      }
    }
  });

  test("nonexistent entity returns null", async () => {
    const entity = await getEntity(db, "nonexistent_id");
    expect(entity).toBeNull();
  });
});

describe("GRAPH QUERY LAYER", () => {
  test("getBloodlineGraph", async () => {
    const graph = await getBloodlineGraph(db, "eren_yeager");
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);

    // Check root node exists
    const rootNode = graph.nodes.find((n) => n.id === "eren_yeager");
    expect(rootNode).toBeDefined();
    expect(rootNode!.label).toBe("Eren Yeager");

    // Check parents exist in nodes
    expect(graph.nodes.find((n) => n.id === "grisha_yeager")).toBeDefined();
    expect(graph.nodes.find((n) => n.id === "carla_yeager")).toBeDefined();

    // Check sibling Zeke exists in nodes
    expect(graph.nodes.find((n) => n.id === "zeke_yeager")).toBeDefined();

    // Check Fritz and Reiss family royal references
    expect(graph.nodes.find((n) => n.id === "yeager_family")).toBeDefined();

    // Check edge parent-of exists
    const parentEdge = graph.edges.find(
      (e) => e.source === "grisha_yeager" && e.target === "eren_yeager",
    );
    expect(parentEdge).toBeDefined();
    expect(parentEdge!.label).toBe("parent-of");
  });

  test("getTitanInheritanceGraph", async () => {
    const graph = await getTitanInheritanceGraph(db, "attack_titan");
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);

    // Titan node exists
    const titanNode = graph.nodes.find((n) => n.id === "attack_titan");
    expect(titanNode).toBeDefined();
    expect(titanNode!.type).toBe("titan");

    // Shifter nodes exist
    expect(graph.nodes.find((n) => n.id === "eren_yeager")).toBeDefined();
    expect(graph.nodes.find((n) => n.id === "grisha_yeager")).toBeDefined();
    expect(graph.nodes.find((n) => n.id === "eren_kruger")).toBeDefined();

    // succession edges exist (predecessor -> successor)
    const krgToGri = graph.edges.find(
      (e) => e.source === "eren_kruger" && e.target === "grisha_yeager",
    );
    expect(krgToGri).toBeDefined();

    const griToEre = graph.edges.find(
      (e) => e.source === "grisha_yeager" && e.target === "eren_yeager",
    );
    expect(griToEre).toBeDefined();
  });
});

describe("SEED AND VALIDATION", () => {
  test("validate dataset on empty is valid", () => {
    const errors = validateDataset({});
    expect(errors.length).toBe(0);
  });

  test("validation detects duplicate IDs", () => {
    const dataset: SeedDataset = {
      people: [
        {
          id: personId("eren_yeager"),
          name: "Eren Yeager",
          gender: "male",
          species: "human",
          status: "deceased",
        },
        {
          id: personId("eren_yeager"),
          name: "Eren Duplicate",
          gender: "male",
          species: "human",
          status: "deceased",
        },
      ],
    };
    const errors = validateDataset(dataset);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].section).toBe("ids");
    expect(errors[0].message).toContain("Duplicate id");
  });

  test("validation detects invalid references", () => {
    const dataset: SeedDataset = {
      people: [
        {
          id: personId("eren_yeager"),
          name: "Eren Yeager",
          gender: "male",
          species: "human",
          status: "deceased",
        },
      ],
      relationships: [
        {
          subject: personId("eren_yeager"),
          predicate: "parent-of",
          object: personId("nonexistent_child"),
        },
      ],
    };
    const errors = validateDataset(dataset);
    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.some((e) =>
        e.message.includes('object "nonexistent_child" does not exist'),
      ),
    ).toBe(true);
  });
});

describe("SEARCH ARCHIVE", () => {
  // Test 1 — Exact full name
  test("exact full name ranks first", async () => {
    const results = await searchArchive(db, "Eren Yeager");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entityId).toBe("eren_yeager");
  });

  // Test 2 — Prefix
  test("prefix search ranks properly", async () => {
    const results = await searchArchive(db, "Eren");
    expect(results.length).toBeGreaterThan(0);
    const ids = results.map((r) => r.entityId);
    expect(ids).toContain("eren_yeager");
    expect(ids).toContain("eren_kruger");
    const erenIndex = ids.indexOf("eren_yeager");
    const zekeIndex = ids.indexOf("zeke_yeager");
    if (zekeIndex !== -1) {
      expect(erenIndex).toBeLessThan(zekeIndex);
    }
  });

  // Test 3 — Surname
  test("surname matches prioritize strongly relevant canonical names", async () => {
    const results = await searchArchive(db, "Yeager");
    expect(results.length).toBeGreaterThan(0);
    const ids = results.map((r) => r.entityId);
    expect(ids).toContain("eren_yeager");
    expect(ids).toContain("grisha_yeager");
    expect(ids).toContain("zeke_yeager");
    expect(ids).toContain("carla_yeager");
  });

  // Test 4 — Alias
  test("alias search functions correctly", async () => {
    const results = await searchArchive(db, "Shingeki");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.entityId === "attack_titan")).toBe(true);
  });

  // Test 5 — Japanese
  test("japanese text searches function correctly", async () => {
    const results = await searchArchive(db, "進撃の巨人");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.entityId === "attack_titan")).toBe(true);
  });

  // Test 6 — Multi-token relevance
  test("multi-token relevance outranks single-token", async () => {
    const results = await searchArchive(db, "Armored Titan");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entityId).toBe("armored_titan");
  });

  // Test 7 — Exact phrase vs token overlap
  test("exact phrase beats token overlap", async () => {
    const results = await searchArchive(db, "Eren Yeager");
    const ids = results.map((r) => r.entityId);
    const erenIndex = ids.indexOf("eren_yeager");
    const carlaIndex = ids.indexOf("carla_yeager");
    if (carlaIndex !== -1) {
      expect(erenIndex).toBeLessThan(carlaIndex);
    }
  });

  // Test 8 — Empty query
  test("empty query returns empty list safely", async () => {
    const results = await searchArchive(db, "   ");
    expect(results.length).toBe(0);
  });

  // Test 9 — Malformed FTS input
  test("malformed input handled safely", async () => {
    const results = await searchArchive(db, '"" OR AND ** // --');
    expect(Array.isArray(results)).toBe(true);
  });

  // Test 10 — Result limit
  test("result limit is respected", async () => {
    const results = await searchArchive(db, "Titan", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  // Additional sanity tests
  test("entity-type handling check", async () => {
    const results = await searchArchive(db, "Coordinate");
    expect(results.length).toBeGreaterThan(0);
    expect(["titan", "ability", "location", "person"]).toContain(
      results[0].entityType,
    );
  });

  test("nonexistent search returns empty list", async () => {
    const results = await searchArchive(db, "NonexistentLoreThing");
    expect(results.length).toBe(0);
  });
});
