import { topUsers } from "../../src/telemetry";
import type { Env } from "../../src/types";

interface EventCtx {
  env: Env;
}

export async function onRequestGet({ env }: EventCtx): Promise<Response> {
  const data = env.DB ? await topUsers(env.DB) : { users: [], total: 0, served: 0 };
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
