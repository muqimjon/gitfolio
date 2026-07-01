import { fetchProfile, CardError } from "./fetcher.js";
import { normalizeStats } from "./stats.js";
import { topLanguages } from "./languages.js";
import { computeStreak } from "./streak.js";
import { resolveColors } from "./theme.js";
import { resolveCacheSeconds, cacheHeaders, errorCacheHeaders, CACHE_TTL } from "./cache.js";
import { avatarDataUri } from "./avatar.js";
import { resolveIcons } from "./icons.js";
import { composeCard } from "./card/index.js";
import { errorCard } from "./card/error.js";

const SVG_TYPE = "image/svg+xml; charset=utf-8";
const DEFAULT_SECTIONS = ["header", "stats", "langs", "streak", "activity", "stack", "social"];
const align = (v) => (["left", "center", "right"].includes(v) ? v : "left");

function parseSocials(str) {
  return String(str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const i = entry.indexOf(":");
      return i === -1
        ? { platform: entry, handle: "" }
        : { platform: entry.slice(0, i).trim(), handle: entry.slice(i + 1).trim() };
    })
    .filter((s) => s.platform);
}

export async function handleCard(q = {}, env = {}) {
  const colors = resolveColors(q, q.theme);

  try {
    const username = String(q.username || "").trim();
    if (!username) throw new CardError("Provide a ?username=", "INPUT");

    const whitelist = String(env.WHITELIST || "")
      .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (whitelist.length && !whitelist.includes(username.toLowerCase()))
      throw new CardError("This instance does not serve that user", "FORBIDDEN");

    const user = await fetchProfile(username, { allCommits: q.all_commits === "true", env });
    const stats = normalizeStats(user);
    const languages = topLanguages(user, 5);
    const streak = computeStreak(user);
    const calendarWeeks = user.contributionsCollection.contributionCalendar.weeks;

    let sections = q.sections
      ? String(q.sections).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : DEFAULT_SECTIONS.slice();

    const stackList = q.stack ? String(q.stack).split(",").map((s) => s.trim()).filter(Boolean) : [];
    const icons = sections.includes("stack") && stackList.length ? resolveIcons(stackList) : [];
    if (!icons.length) sections = sections.filter((s) => s !== "stack");
    if (!languages.length) sections = sections.filter((s) => s !== "langs");

    const socials = sections.includes("social") && q.social ? parseSocials(q.social) : [];
    if (!socials.length) sections = sections.filter((s) => s !== "social");

    let avatar = null;
    if (sections.includes("header")) avatar = await avatarDataUri(stats.avatarUrl);

    const socialShow = ["handle", "name", "icon"].includes(q.social_show) ? q.social_show : "handle";

    const svg = composeCard(
      { stats, languages, streak, calendarWeeks, icons, avatarDataUri: avatar, socials },
      {
        colors,
        sections,
        animation: q.animation !== "false",
        hideBorder: q.hide_border === "true",
        mono: q.stack_mono === "true",
        socialShow,
        socialMono: q.social_mono === "true",
        stackAlign: align(q.stack_align),
        socialAlign: align(q.social_align),
      },
    );

    const seconds = resolveCacheSeconds({ requested: q.cache_seconds, ...CACHE_TTL.CARD }, env);
    return { status: 200, headers: { "Content-Type": SVG_TYPE, ...cacheHeaders(seconds) }, body: svg };
  } catch (err) {
    return { status: 200, headers: { "Content-Type": SVG_TYPE, ...errorCacheHeaders() }, body: errorCard(err, colors) };
  }
}
