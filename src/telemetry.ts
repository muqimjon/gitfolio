import type { CardMeta, D1Database } from "./types";

export interface UsageRow {
  username: string;
  name: string | null;
  stars: number;
  contributions: number;
  streak: number;
  requests: number;
}

export async function recordUsage(db: D1Database, m: CardMeta, country: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO usage (username, name, requests, stars, contributions, streak, country, first_seen, last_seen)
       VALUES (?1, ?2, 1, ?3, ?4, ?5, ?6, ?7, ?7)
       ON CONFLICT(username) DO UPDATE SET
         name = excluded.name, requests = usage.requests + 1, stars = excluded.stars,
         contributions = excluded.contributions, streak = excluded.streak,
         country = COALESCE(excluded.country, usage.country), last_seen = excluded.last_seen`,
    )
    .bind(m.username.toLowerCase(), m.name, m.stars, m.contributions, m.streak, country, now)
    .run();
}

export async function topUsers(db: D1Database, limit = 50): Promise<{ users: UsageRow[]; total: number }> {
  const { results } = await db
    .prepare(
      `SELECT username, name, stars, contributions, streak, requests FROM usage
       ORDER BY contributions DESC, stars DESC LIMIT ?1`,
    )
    .bind(limit)
    .all<UsageRow>();
  const count = await db.prepare("SELECT COUNT(*) AS total FROM usage").all<{ total: number }>();
  return { users: results, total: count.results[0]?.total ?? 0 };
}
