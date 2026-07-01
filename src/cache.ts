import type { Env } from "./types";

export const CACHE_TTL = {
  CARD: { def: 86400, min: 43200, max: 172800 },
  ERROR: 600,
};

export function resolveCacheSeconds(
  { requested, def, min, max }: { requested?: string; def: number; min: number; max: number },
  env: Env = {},
): number {
  const override = parseInt(env.CACHE_SECONDS ?? "", 10);
  if (!isNaN(override)) return Math.max(0, override);
  const r = parseInt(requested ?? "", 10);
  const v = isNaN(r) ? def : r;
  return Math.max(min, Math.min(v, max));
}

export function cacheHeaders(seconds: number): Record<string, string> {
  return { "Cache-Control": `max-age=${seconds}, s-maxage=${seconds}, stale-while-revalidate=86400` };
}

export function errorCacheHeaders(): Record<string, string> {
  return { "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0" };
}
