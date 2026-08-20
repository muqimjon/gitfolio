interface Row {
  username: string;
  name: string | null;
  stars: number;
  contributions: number;
  streak: number;
  requests: number;
  country: string | null;
}

const fmt = (n: number): string => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));
const MEDALS = ["🥇", "🥈", "🥉"];
const flag = (cc: string | null): string =>
  cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "";

async function main(): Promise<void> {
  const { users, total, served } = (await (await fetch("/api/leaderboard")).json()) as {
    users: Row[];
    total: number;
    served: number;
  };
  const stats = document.getElementById("lb_stats")!;
  stats.innerHTML = `<span class="lb-stat"><b>${fmt(total)}</b> users</span><span class="lb-stat"><b>${fmt(served)}</b> cards served</span>`;
  const body = document.getElementById("lb_body")!;
  if (!users.length) {
    document.getElementById("lb_empty")!.hidden = false;
    return;
  }
  users.forEach((u, i) => {
    const tr = document.createElement("tr");
    if (i < 3) tr.className = `lb-top lb-top${i + 1}`;
    tr.style.animationDelay = `${i * 45}ms`;
    const rank = MEDALS[i] || String(i + 1);
    tr.innerHTML = `<td class="lb-rank">${rank}</td>
<td><a class="lb-user" href="https://github.com/${encodeURIComponent(u.username)}" target="_blank" rel="noopener">
<img src="https://github.com/${encodeURIComponent(u.username)}.png?size=48" alt="" loading="lazy">
<span><b></b><small>@${u.username} ${flag(u.country || "")}</small></span></a></td>
<td>${fmt(u.contributions)}</td><td>⭐ ${fmt(u.stars)}</td><td>${u.streak}🔥</td>
<td><a class="lb-card" href="/api/card?username=${encodeURIComponent(u.username)}" target="_blank" rel="noopener" title="View card">🪪</a></td>`;
    tr.querySelector("b")!.textContent = u.name || u.username;
    body.appendChild(tr);
  });
}

main();
