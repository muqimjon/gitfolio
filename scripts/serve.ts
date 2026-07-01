import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { handleCard } from "../src/handler";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const MIME: Record<string, string> = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png",
  ".ico": "image/x-icon",
};
const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const PORT = process.env.PORT || 8787;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/api/card") {
    const q = Object.fromEntries(url.searchParams.entries());
    const { status, headers, body } = await handleCard(q, process.env);
    res.statusCode = status;
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    return res.end(body);
  }
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  for (const base of [PUBLIC, ROOT]) {
    const p = normalize(join(base, rel));
    if (!p.startsWith(base)) continue;
    if (existsSync(p) && statSync(p).isFile()) {
      res.setHeader("Content-Type", MIME[extname(p)] || "application/octet-stream");
      return res.end(readFileSync(p));
    }
  }
  res.statusCode = 404;
  res.end("not found");
});

server.listen(PORT, () => console.error(`gitfolio dev http://localhost:${PORT}`));
