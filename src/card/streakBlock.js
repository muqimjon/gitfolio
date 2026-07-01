import { esc } from "../measure.js";
import { countUp } from "./odometer.js";

function fmt(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function streakBlock({ c, W, data }) {
  const st = data.streak;
  const h = 78;
  const colW = W / 3;

  const cols = [
    { v: st.total, l: "Contributions", d: "past year" },
    { v: st.current, l: "Current Streak", d: st.current ? `${fmt(st.curStart)} – ${fmt(st.curEnd)}` : "—", ring: true },
    { v: st.longest, l: "Longest Streak", d: st.longest ? `${fmt(st.longStart)} – ${fmt(st.longEnd)}` : "—" },
  ];

  const draw = cols
    .map((col, i) => {
      const cx = i * colW + colW / 2;
      const numColor = col.ring ? c.primary : c.text;
      let ring = "";
      if (col.ring) {
        const r = 20;
        const circ = 2 * Math.PI * r;
        ring = `<circle cx="${cx}" cy="22" r="${r}" fill="none" stroke="${c.border}" stroke-width="2"/>
<circle cx="${cx}" cy="22" r="${r}" fill="none" stroke="${c.secondary}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ * 0.28).toFixed(1)}" transform="rotate(-90 ${cx} 22)" class="ring"/>`;
      }
      return `${ring}
${countUp(col.v, { x: cx, cy: 22, size: 22, weight: 800, color: numColor, anchor: "middle", dur: 1.6 + i * 0.15 })}
<text x="${cx}" y="57" fill="${c.text}" font-size="11" font-weight="600" text-anchor="middle">${esc(col.l)}</text>
<text x="${cx}" y="71" fill="${c.muted}" font-size="9" text-anchor="middle">${esc(col.d)}</text>`;
    })
    .join("\n");

  return { h, draw: () => draw };
}
