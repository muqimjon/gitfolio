interface Row {
  username: string;
  name: string | null;
  stars: number;
  contributions: number;
  streak: number;
  requests: number;
}

const fmt = (n: number): string => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));
const MEDALS = ["🥇", "🥈", "🥉"];

async function main(): Promise<void> {
  const { users, total } = (await (await fetch("/api/leaderboard")).json()) as { users: Row[]; total: number };
  document.getElementById("lb_total")!.textContent = total ? `${total} users so far.` : "";
  const body = document.getElementById("lb_body")!;
  if (!users.length) {
    document.getElementById("lb_empty")!.hidden = false;
    return;
  }
  users.forEach((u, i) => {
    const tr = document.createElement("tr");
    const rank = MEDALS[i] || String(i + 1);
    tr.innerHTML = `<td class="lb-rank">${rank}</td>
<td><a class="lb-user" href="https://github.com/${encodeURIComponent(u.username)}" target="_blank" rel="noopener">
<img src="https://github.com/${encodeURIComponent(u.username)}.png?size=48" alt="" loading="lazy">
<span><b></b><small>@${u.username}</small></span></a></td>
<td>${fmt(u.contributions)}</td><td>${fmt(u.stars)}</td><td>${u.streak}🔥</td>`;
    tr.querySelector("b")!.textContent = u.name || u.username;
    body.appendChild(tr);
  });
}

main();
