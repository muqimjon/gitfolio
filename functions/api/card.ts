import { handleCard } from "../../src/handler";
import type { Env } from "../../src/types";

interface EventCtx {
  request: Request;
  env: Env;
}

export async function onRequestGet({ request, env }: EventCtx): Promise<Response> {
  const url = new URL(request.url);
  const q = Object.fromEntries(url.searchParams);
  const { status, headers, body } = await handleCard(q, env);
  return new Response(body, { status, headers });
}
