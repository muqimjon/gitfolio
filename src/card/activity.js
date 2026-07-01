import { line, area, curveMonotoneX } from "d3-shape";

const LABEL_H = 18;
const GRAPH_H = 48;

export default function activity({ c, W, data }) {
  const weeks = data.calendarWeeks || [];
  const vals = weeks.map((w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, 0));
  if (vals.length < 2) return { h: 0, draw: () => "" };

  const max = Math.max(1, ...vals);
  const n = vals.length;
  const pts = vals.map((v, i) => [
    (i / (n - 1)) * W,
    GRAPH_H - (v / max) * (GRAPH_H - 6) - 2,
  ]);
  const ln = line().x((d) => d[0]).y((d) => d[1]).curve(curveMonotoneX)(pts);
  const ar = area().x((d) => d[0]).y0(GRAPH_H).y1((d) => d[1]).curve(curveMonotoneX)(pts);

  return {
    h: LABEL_H + GRAPH_H,
    draw: () => `<text x="0" y="12" fill="${c.muted}" font-size="10" font-weight="600" letter-spacing="1">ACTIVITY · LAST YEAR</text>
<linearGradient id="actfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.primary}" stop-opacity="0.35"/><stop offset="1" stop-color="${c.primary}" stop-opacity="0"/></linearGradient>
<g transform="translate(0,${LABEL_H})">
<line x1="0" y1="${GRAPH_H}" x2="${W}" y2="${GRAPH_H}" stroke="${c.border}" stroke-width="1"/>
<path d="${ar}" fill="url(#actfill)"/>
<path d="${ln}" fill="none" stroke="${c.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="draw" stroke-dasharray="4000" stroke-dashoffset="0"/>
</g>`,
  };
}
