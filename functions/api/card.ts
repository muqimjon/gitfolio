import { handleCard } from "../../src/handler";
import { recordUsage } from "../../src/telemetry";
import type { Env } from "../../src/types";

interface EventCtx {
  request: Request;
  env: Env;
  waitUntil(p: Promise<unknown>): void;
}

export async function onRequestGet({ request, env, waitUntil }: EventCtx): Promise<Response> {
  const url = new URL(request.url);
  const q = Object.fromEntries(url.searchParams);
  const { status, headers, body, meta } = await handleCard(q, env);
  const embedded =
    (request.headers.get("user-agent") || "").includes("github-camo") ||
    (request.headers.get("via") || "").includes("github-camo");
  if (meta && env.DB && embedded)
    waitUntil(recordUsage(env.DB, meta).catch((e) => console.error("telemetry:", e)));
  return new Response(body, { status, headers });
}
