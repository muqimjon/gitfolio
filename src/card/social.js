import { esc, measureText, isDark } from "../measure.js";
import { resolveIcons } from "../icons.js";
import { socialUrl } from "../social-url.js";

const LABEL_H = 18;
const SIZE = 18;
const GAP_X = 18;
const ROW_H = 26;

export default function social({ c, W, data, socialShow = "handle", socialMono = false, socialAlign = "left" }) {
  const items = data.socials || [];
  if (!items.length) return { h: 0, draw: () => "" };

  const icons = resolveIcons(items.map((i) => i.platform));
  const rows = [[]];
  let x = 0;
  items.forEach((it, idx) => {
    const ic = icons[idx];
    const text = socialShow === "name" ? ic.label : socialShow === "icon" ? "" : it.handle || ic.label;
    const w = SIZE + (text ? 6 + measureText(text, 11) : 0);
    if (x + w > W && x > 0) {
      rows.push([]);
      x = 0;
    }
    rows[rows.length - 1].push({ it, ic, text, w });
    x += w + GAP_X;
  });

  const nodes = [];
  rows.forEach((row, r) => {
    const rowW = row.reduce((s, it) => s + it.w + GAP_X, 0) - GAP_X;
    let ox = socialAlign === "center" ? (W - rowW) / 2 : socialAlign === "right" ? W - rowW : 0;
    if (ox < 0) ox = 0;
    const y = LABEL_H + r * ROW_H;
    for (const { it, ic, text, w } of row) {
      const fill = socialMono ? c.secondary : isDark(ic.hex) ? c.text : "#" + ic.hex;
      const inner = [];
      if (ic.path) inner.push(`<g transform="translate(${ox.toFixed(1)},${y}) scale(${(SIZE / (ic.vb || 24)).toFixed(4)})"><path d="${ic.path}" fill="${fill}"${ic.fr ? ` fill-rule="${ic.fr}"` : ""}/></g>`);
      else inner.push(`<circle cx="${(ox + SIZE / 2).toFixed(1)}" cy="${y + SIZE / 2}" r="${SIZE / 2}" fill="none" stroke="${fill}" stroke-width="1.5"/>`);
      if (text) inner.push(`<text x="${(ox + SIZE + 6).toFixed(1)}" y="${y + SIZE / 2}" fill="${c.text}" font-size="11" dominant-baseline="central">${esc(text)}</text>`);
      const url = socialUrl(it.platform, it.handle);
      nodes.push(url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${inner.join("")}</a>` : inner.join(""));
      ox += w + GAP_X;
    }
  });

  const h = LABEL_H + (rows.length - 1) * ROW_H + SIZE;
  return {
    h,
    draw: () => `<text x="0" y="12" fill="${c.muted}" font-size="10" font-weight="600" letter-spacing="1">CONNECT</text>
${nodes.join("\n")}`,
  };
}
