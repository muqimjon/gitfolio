import { recordUsage, topUsers } from "../../src/telemetry";
import type { Env } from "../../src/types";

interface EventCtx {
  request: Request;
  env: Env;
}

export async function onRequestGet({ request, env }: EventCtx): Promise<Response> {
  let probe = "";
  if (env.DB && new URL(request.url).searchParams.has("probe")) {
    try {
      await recordUsage(env.DB, { username: "___probe", name: "P", stars: 1, contributions: 2, streak: 3 }, "XX");
      probe = "ok";
    } catch (e) {
      probe = String(e);
    }
  }
  const data = env.DB ? await topUsers(env.DB) : { users: [], total: 0 };
  return new Response(JSON.stringify({ ...data, db: !!env.DB, probe }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
