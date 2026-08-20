import { handleIcon } from "../../src/handler";

interface EventCtx {
  request: Request;
}

export function onRequestGet({ request }: EventCtx): Response {
  const url = new URL(request.url);
  const { status, headers, body } = handleIcon(url.searchParams.get("slug") || "");
  return new Response(body, { status, headers });
}
