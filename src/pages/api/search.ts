import type { APIRoute } from "astro";
import { createDb } from "@/database";
import { env } from "cloudflare:workers";
import { searchArchive } from "@/database/queries/search";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query || query.trim() === "") {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  // @ts-ignore
  if (!env || !env.DB) {
    return new Response(
      JSON.stringify({ error: "Database binding not found" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const db = createDb(env.DB);

  try {
    const results = await searchArchive(db, query, 15);
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Short cache
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
