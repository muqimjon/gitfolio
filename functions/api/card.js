import { handleCard } from "../../src/handler.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = Object.fromEntries(url.searchParams);
  const { status, headers, body } = await handleCard(q, env);
  return new Response(body, { status, headers });
}
