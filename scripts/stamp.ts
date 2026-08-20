import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const ASSETS = ["styles.css", "builder.js", "leaderboard.js"];
const ver = Object.fromEntries(
  ASSETS.map((a) => [a, createHash("md5").update(readFileSync(`public/${a}`)).digest("hex").slice(0, 8)]),
);

for (const page of ["public/index.html", "public/leaderboard.html"]) {
  let html = readFileSync(page, "utf8");
  for (const a of ASSETS) html = html.replace(new RegExp(`/${a}(\\?v=[0-9a-f]+)?`, "g"), `/${a}?v=${ver[a]}`);
  writeFileSync(page, html);
}
console.error("stamped:", ver);
