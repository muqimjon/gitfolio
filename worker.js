import { handleCard } from "./src/handler.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/card") {
      const q = Object.fromEntries(url.searchParams);
      const { status, headers, body } = await handleCard(q, env);
      return new Response(body, { status, headers });
    }
    return env.ASSETS.fetch(request);
  },
};
