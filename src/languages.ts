import type { GHUser, Language } from "./types";

export function topLanguages(user: GHUser, count = 5): Language[] {
  const map: Record<string, { name: string; color: string; size: number }> = {};
  for (const repo of user.repositories.nodes || []) {
    for (const edge of repo.languages?.edges || []) {
      const name = edge.node.name;
      if (!map[name]) map[name] = { name, color: edge.node.color || "#858585", size: 0 };
      map[name].size += edge.size;
    }
  }
  const langs = Object.values(map)
    .sort((a, b) => b.size - a.size)
    .slice(0, count);
  const total = langs.reduce((s, l) => s + l.size, 0) || 1;
  return langs.map((l) => ({ ...l, pct: (l.size / total) * 100 }));
}
