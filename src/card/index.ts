import { esc } from "../measure";
import { flushOdometerCss } from "./odometer";
import header from "./header";
import statsBlock from "./statsBlock";
import langsBar from "./langsBar";
import streakBlock from "./streakBlock";
import activity from "./activity";
import techStack from "./techStack";
import social from "./social";
import type { CardContext, CardData, CardOptions, Section } from "../types";

const WIDTH = 480;
const PAD = 24;
const GAP = 22;
const RADIUS = 14;
const BRAND = "gitcrest.pages.dev";

const BUILDERS: Record<string, (ctx: CardContext) => Section> = {
  header,
  stats: statsBlock,
  langs: langsBar,
  streak: streakBlock,
  activity,
  stack: techStack,
  social,
};

function style(anim: boolean, odoCss = ""): string {
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

export function composeCard(data: CardData, opts: CardOptions): string {
  const { colors: c, sections, animation, hideBorder, mono, socialShow, socialMono, stackAlign, socialAlign, brand } = opts;
  const W = WIDTH - PAD * 2;
  const ctx: CardContext = { c, W, WIDTH, PAD, anim: animation, mono, socialShow, socialMono, stackAlign, socialAlign, data };

  const seen = new Set<string>();
  const active = sections.filter((s) => BUILDERS[s] && !seen.has(s) && seen.add(s));
  const built: Section[] = [];
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
  const mark = brand
    ? `<text x="${WIDTH - 10}" y="${height - 9}" text-anchor="end" font-size="9" fill="${c.muted}" opacity="0.6">${BRAND}</text>`
    : "";

  return `<svg width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(data.stats.name)}'s GitHub stats">
<defs>${defs}</defs>
${style(animation, odoCss)}
<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="${RADIUS}" fill="${bg}" stroke="${border}" stroke-width="1"/>
${body}
${mark}
</svg>`;
}
