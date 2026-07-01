import { esc, measureText, isDark } from "../measure.js";

const LABEL_H = 18;
const SIZE = 24;
const GAP = 10;
const ROW_H = 32;

export default function techStack({ c, W, mono, data, stackAlign = "left" }) {
  const icons = data.icons || [];
  if (!icons.length) return { h: 0, draw: () => "" };

  const rows = [[]];
  let x = 0;
  for (const ic of icons) {
    const wpx = ic.path ? SIZE : Math.max(SIZE, 14 + measureText(ic.label, 11, 700));
    if (x + wpx > W && x > 0) {
      rows.push([]);
      x = 0;
    }
    rows[rows.length - 1].push({ ic, wpx });
    x += wpx + GAP;
  }

  const nodes = [];
  rows.forEach((row, r) => {
    const rowW = row.reduce((s, it) => s + it.wpx + GAP, 0) - GAP;
    let ox = stackAlign === "center" ? (W - rowW) / 2 : stackAlign === "right" ? W - rowW : 0;
    if (ox < 0) ox = 0;
    const y = LABEL_H + r * ROW_H;
    for (const { ic, wpx } of row) {
      const fill = mono ? c.secondary : isDark(ic.hex) ? c.text : "#" + ic.hex;
      if (ic.path) {
        nodes.push(`<g transform="translate(${ox.toFixed(1)},${y}) scale(${(SIZE / (ic.vb || 24)).toFixed(4)})"><path d="${ic.path}" fill="${fill}"${ic.fr ? ` fill-rule="${ic.fr}"` : ""}/></g>`);
      } else {
        nodes.push(`<rect x="${ox.toFixed(1)}" y="${y}" width="${wpx}" height="${SIZE}" rx="5" fill="none" stroke="${fill}" stroke-width="1.5"/>
<text x="${(ox + wpx / 2).toFixed(1)}" y="${y + SIZE / 2}" fill="${fill}" font-size="11" font-weight="700" text-anchor="middle" dominant-baseline="central">${esc(ic.label)}</text>`);
      }
      ox += wpx + GAP;
    }
  });

  const h = LABEL_H + (rows.length - 1) * ROW_H + SIZE;
  return {
    h,
    draw: () => `<text x="0" y="12" fill="${c.muted}" font-size="10" font-weight="600" letter-spacing="1">TECH STACK</text>
${nodes.join("\n")}`,
  };
}
