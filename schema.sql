CREATE TABLE IF NOT EXISTS usage (
  username TEXT PRIMARY KEY,
  name TEXT,
  requests INTEGER NOT NULL DEFAULT 0,
  stars INTEGER NOT NULL DEFAULT 0,
  contributions INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  country TEXT,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_usage_contributions ON usage (contributions DESC);
