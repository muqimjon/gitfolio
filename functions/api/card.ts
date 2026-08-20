import { handleCard } from "../../src/handler";
import { recordUsage } from "../../src/telemetry";
import type { Env } from "../../src/types";

interface EventCtx {
  request: Request & { cf?: { country?: string } };
  env: Env;
  waitUntil(p: Promise<unknown>): void;
}

export async function onRequestGet({ request, env, waitUntil }: EventCtx): Promise<Response> {
  const url = new URL(request.url);
  const q = Object.fromEntries(url.searchParams);
  const { status, headers, body, meta } = await handleCard(q, env);
  if (meta && env.DB) waitUntil(recordUsage(env.DB, meta, request.cf?.country ?? null).catch(() => {}));
  return new Response(body, { status, headers });
}
