import { esc, kFormatter, measureText } from "../measure";
import { glyph } from "./glyphs";
import { countUp } from "./odometer";
import type { CardContext, Section } from "../types";

export default function statsBlock({ c, W, data }: CardContext): Section {
  const s = data.stats;
  const items = [
    { g: "star", v: s.stars, l: "Stars" },
    { g: "commit", v: s.commits, l: "Commits" },
    { g: "pr", v: s.prs, l: "PRs" },
    { g: "issue", v: s.issues, l: "Issues" },
    { g: "repo", v: s.contributed, l: "Contrib" },
  ];
  const h = 46;
  const cellW = W / items.length;
  const GS = 14;

  const cells = items.map((it, i) => {
    const cx = i * cellW + cellW / 2;
    const val = kFormatter(it.v);
    const vw = measureText(val, 15, 700);
    const total = GS + 5 + vw;
    const startX = cx - total / 2;
    return `${glyph(it.g, startX, 2, GS, c.secondary)}
${countUp(val, { x: startX + GS + 5, cy: 9, size: 15, weight: 700, color: c.text, anchor: "start", dur: 1.3 + i * 0.12 })}
<text x="${cx}" y="33" fill="${c.muted}" font-size="10" text-anchor="middle">${esc(it.l)}</text>`;
  });

  return { h, draw: () => cells.join("\n") };
}
