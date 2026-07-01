import { esc, measureText } from "../measure.js";

const LABEL_H = 20;
const BAR_Y = LABEL_H;
const BAR_H = 9;
const LEGEND_Y = BAR_Y + BAR_H + 18;
const ROW_H = 18;

export default function langsBar({ c, W, data }) {
  const langs = data.languages;
  if (!langs.length) return { h: 0, draw: () => "" };

  let x = 0;
  const segs = langs
    .map((l) => {
      const w = Math.max(2, (l.pct / 100) * W);
      const r = `<rect x="${x.toFixed(2)}" y="${BAR_Y}" width="${w.toFixed(2)}" height="${BAR_H}" fill="${l.color}"/>`;
      x += w;
      return r;
    })
    .join("");

  let lx = 0;
  let ly = 0;
  const legend = langs
    .map((l) => {
      const text = `${l.name} ${l.pct.toFixed(1)}%`;
      const w = 14 + measureText(text, 11) + 16;
      if (lx + w > W && lx > 0) {
        lx = 0;
        ly += ROW_H;
      }
      const item = `<circle cx="${lx + 5}" cy="${LEGEND_Y + ly - 4}" r="5" fill="${l.color}"/>
<text x="${lx + 14}" y="${LEGEND_Y + ly}" fill="${c.text}" font-size="11">${esc(l.name)} <tspan fill="${c.muted}">${l.pct.toFixed(1)}%</tspan></text>`;
      lx += w;
      return item;
    })
    .join("\n");

  const h = LEGEND_Y + ly + 4;

  return {
    h,
    draw: () => `<text x="0" y="12" fill="${c.muted}" font-size="10" font-weight="600" letter-spacing="1">TOP LANGUAGES</text>
<clipPath id="lbar"><rect x="0" y="${BAR_Y}" width="${W}" height="${BAR_H}" rx="${BAR_H / 2}"/></clipPath>
<g clip-path="url(#lbar)"><g class="bar">${segs}</g></g>
${legend}`,
  };
}
