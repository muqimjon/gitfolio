import { esc } from "../measure.js";
import { flushOdometerCss } from "./odometer.js";
import header from "./header.js";
import statsBlock from "./statsBlock.js";
import langsBar from "./langsBar.js";
import streakBlock from "./streakBlock.js";
import activity from "./activity.js";
import techStack from "./techStack.js";
import social from "./social.js";

const WIDTH = 480;
const PAD = 24;
const GAP = 22;
const RADIUS = 14;

const BUILDERS = {
  header,
  stats: statsBlock,
  langs: langsBar,
  streak: streakBlock,
  activity,
  stack: techStack,
  social,
};

function style(anim, odoCss = "") {
  const font =
    "text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,Helvetica,Arial,sans-serif}";
  const on = `
${font}
.sec{animation:fadeIn .8s ease forwards}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.draw{animation:draw 3s ease-in-out forwards}
@keyframes draw{from{stroke-dashoffset:4000}to{stroke-dashoffset:0}}
.ring{animation:ring 2s ease-out forwards}
@keyframes ring{from{stroke-dashoffset:125.7}to{stroke-dashoffset:35.2}}
.bar{transform-box:fill-box;transform-origin:left center;animation:grow 1.5s ease-out forwards}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
${odoCss}`;
  return `<style>${anim ? on : font}</style>`;
}

export function composeCard(data, opts) {
  const { colors: c, sections, animation, hideBorder, mono, socialShow, socialMono, stackAlign, socialAlign } = opts;
  const W = WIDTH - PAD * 2;
  const ctx = { c, W, WIDTH, PAD, anim: animation, mono, socialShow, socialMono, stackAlign, socialAlign, data };

  const seen = new Set();
  const active = sections.filter((s) => BUILDERS[s] && !seen.has(s) && seen.add(s));
  const built = [];
  for (const name of active) {
    const sec = BUILDERS[name](ctx);
    if (sec && sec.h > 0) built.push(sec);
  }

  let y = PAD;
  const body = built
    .map((sec, i) => {
      const g = `<g transform="translate(${PAD},${y})"><g class="sec" style="animation-delay:${100 + i * 110}ms">${sec.draw()}</g></g>`;
      y += sec.h + GAP;
      return g;
    })
    .join("\n");
  const height = Math.round(y - GAP + PAD);
  const odoCss = flushOdometerCss();

  const grad = c.bgStops.length > 1;
  const defs = grad
    ? `<linearGradient id="bg" gradientTransform="rotate(${c.bgAngle})"><stop offset="0" stop-color="${c.bgStops[0]}"/><stop offset="1" stop-color="${c.bgStops[1]}"/></linearGradient>`
    : "";
  const bg = grad ? "url(#bg)" : c.bgStops[0];
  const border = hideBorder ? "none" : c.border;

  return `<svg width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(data.stats.name)}'s GitHub stats">
<defs>${defs}</defs>
${style(animation, odoCss)}
<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="${RADIUS}" fill="${bg}" stroke="${border}" stroke-width="1"/>
${body}
</svg>`;
}
