import type { CardMeta, D1Database } from "./types";

export interface UsageRow {
  username: string;
  name: string | null;
  stars: number;
  contributions: number;
  streak: number;
  requests: number;
  country: string | null;
}

export async function recordUsage(db: D1Database, m: CardMeta): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO usage (username, name, requests, stars, contributions, streak, first_seen, last_seen)
       VALUES (?1, ?2, 1, ?3, ?4, ?5, ?6, ?6)
       ON CONFLICT(username) DO UPDATE SET
         name = excluded.name, requests = usage.requests + 1, stars = excluded.stars,
         contributions = excluded.contributions, streak = excluded.streak, last_seen = excluded.last_seen`,
    )
    .bind(m.username.toLowerCase(), m.name, m.stars, m.contributions, m.streak, now)
    .run();
}

export async function topUsers(db: D1Database, limit = 50): Promise<{ users: UsageRow[]; total: number; served: number }> {
  const { results } = await db
    .prepare(
      `SELECT username, name, stars, contributions, streak, requests, country FROM usage
       ORDER BY contributions DESC, stars DESC LIMIT ?1`,
    )
    .bind(limit)
    .all<UsageRow>();
  const agg = await db
    .prepare("SELECT COUNT(*) AS total, COALESCE(SUM(requests), 0) AS served FROM usage")
    .all<{ total: number; served: number }>();
  return { users: results, total: agg.results[0]?.total ?? 0, served: agg.results[0]?.served ?? 0 };
}
