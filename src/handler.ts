import { fetchProfile, CardError } from "./fetcher";
import { normalizeStats } from "./stats";
import { topLanguages } from "./languages";
import { computeStreak } from "./streak";
import { resolveColors } from "./theme";
import { resolveCacheSeconds, cacheHeaders, errorCacheHeaders, CACHE_TTL } from "./cache";
import { avatarDataUri } from "./avatar";
import { resolveIcons } from "./icons";
import { composeCard } from "./card/index";
import { errorCard } from "./card/error";
import type { Align, CardResponse, Env, Query, Social, SocialShow } from "./types";

const SVG_TYPE = "image/svg+xml; charset=utf-8";
const DEFAULT_SECTIONS = ["header", "stats", "langs", "streak", "activity", "stack", "social"];
const align = (v: string | undefined): Align => (v === "left" || v === "center" || v === "right" ? v : "left");

function parseSocials(str: string | undefined): Social[] {
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

export async function handleCard(q: Query = {}, env: Env = {}): Promise<CardResponse> {
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

    let avatar: string | null = null;
    if (sections.includes("header")) avatar = await avatarDataUri(stats.avatarUrl);

    const ss = q.social_show;
    const socialShow: SocialShow = ss === "handle" || ss === "name" || ss === "icon" ? ss : "handle";

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
        brand: q.brand !== "false",
      },
    );

    const seconds = resolveCacheSeconds({ requested: q.cache_seconds, ...CACHE_TTL.CARD }, env);
    return { status: 200, headers: { "Content-Type": SVG_TYPE, ...cacheHeaders(seconds) }, body: svg };
  } catch (err) {
    return { status: 200, headers: { "Content-Type": SVG_TYPE, ...errorCacheHeaders() }, body: errorCard(err as CardError, colors) };
  }
}
