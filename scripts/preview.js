import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fetchProfile } from "../src/fetcher.js";
import { normalizeStats } from "../src/stats.js";
import { topLanguages } from "../src/languages.js";
import { computeStreak } from "../src/streak.js";
import { resolveColors } from "../src/theme.js";
import { avatarDataUri } from "../src/avatar.js";
import { resolveIcons } from "../src/icons.js";
import { composeCard } from "../src/card/index.js";

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

function query() {
  const q = {};
  for (const a of process.argv.slice(3)) {
    const [k, v] = a.replace(/^--/, "").split("=");
    q[k] = v ?? "true";
  }
  return q;
}

const MOCK = {
  stats: { name: "Muqimjon Mamadaliyev", login: "muqimjon", avatarUrl: null, followers: 128, following: 42, repos: 37, stars: 1240, commits: 2870, allCommits: false, prs: 96, issues: 54, contributed: 18, contributions: 3120 },
  languages: [
    { name: "C#", color: "#178600", pct: 52.3 },
    { name: "TypeScript", color: "#3178c6", pct: 21.7 },
    { name: "HTML", color: "#e34c26", pct: 12.4 },
    { name: "Python", color: "#3572A5", pct: 8.1 },
    { name: "CSS", color: "#563d7c", pct: 5.5 },
  ],
  streak: { total: 3120, current: 17, curStart: "2026-06-15", curEnd: "2026-07-01", longest: 96, longStart: "2025-11-02", longEnd: "2026-02-05" },
  calendarWeeks: Array.from({ length: 52 }, (_, w) => ({
    contributionDays: Array.from({ length: 7 }, () => ({ contributionCount: Math.round(6 + 5 * Math.sin(w / 4) + (w % 3)) })),
  })),
};

async function main() {
  loadEnv();
  const username = process.argv[2] || "muqimjon";
  const q = query();
  const colors = resolveColors(q, q.theme || "gold");
  const sections = (q.sections || "header,stats,langs,streak,activity,stack,social").split(",");
  const stack = (q.stack || "dotnet,cs,docker,postgres,redis,git,linux,angular,ts").split(",");
  const icons = sections.includes("stack") ? resolveIcons(stack) : [];
  const socials = (q.social || "")
    .split(",").map((s) => s.trim()).filter(Boolean)
    .map((e) => { const i = e.indexOf(":"); return i === -1 ? { platform: e, handle: "" } : { platform: e.slice(0, i), handle: e.slice(i + 1) }; });

  let data;
  if (username === "--mock" || q.mock) {
    data = { ...MOCK, icons, socials, avatarDataUri: null };
  } else {
    const user = await fetchProfile(username, { allCommits: q.all_commits === "true" });
    data = {
      stats: normalizeStats(user),
      languages: topLanguages(user, 5),
      streak: computeStreak(user),
      calendarWeeks: user.contributionsCollection.contributionCalendar.weeks,
      icons,
      socials,
      avatarDataUri: sections.includes("header") ? await avatarDataUri(user.avatarUrl) : null,
    };
  }

  const svg = composeCard(data, {
    colors,
    sections,
    animation: q.animation !== "false",
    hideBorder: q.hide_border === "true",
    mono: q.stack_mono === "true",
    socialShow: ["handle", "name", "icon"].includes(q.social_show) ? q.social_show : "handle",
    socialMono: q.social_mono === "true",
    stackAlign: ["left", "center", "right"].includes(q.stack_align) ? q.stack_align : "left",
    socialAlign: ["left", "center", "right"].includes(q.social_align) ? q.social_align : "left",
  });
  const out = q.out || "out.svg";
  writeFileSync(out, svg);
  console.error(`wrote ${out} (${svg.length} bytes)`);
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
