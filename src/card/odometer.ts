import { esc } from "../measure";

let uid = 0;
let kf: string[] = [];

export function flushOdometerCss(): string {
  const s = kf.join("");
  kf = [];
  return s;
}

function charW(ch: string, size: number): number {
  if (ch >= "0" && ch <= "9") return size * 0.62;
  if (ch === ".") return size * 0.3;
  if (ch === " ") return size * 0.3;
  return size * 0.56;
}

interface CountUpOpts {
  x?: number;
  cy?: number;
  size?: number;
  weight?: number;
  color?: string;
  anchor?: "start" | "middle";
  dur?: number;
}

export function countUp(
  value: string | number,
  { x = 0, cy = 0, size = 16, weight = 700, color = "#fff", anchor = "start", dur = 0.8 }: CountUpOpts = {},
): string {
  const str = String(value);
  const cellH = size * 1.25;
  const chars = [...str].map((ch) => ({ ch, digit: ch >= "0" && ch <= "9", w: charW(ch, size) }));
  const total = chars.reduce((s, c) => s + c.w, 0);
  let cx = anchor === "middle" ? x - total / 2 : x;
  const top = cy - cellH / 2;
  const parts: string[] = [];

  for (const c of chars) {
    if (c.digit) {
      const d = +c.ch;
      const id = `o${uid++}`;
      const finalTy = -(d * cellH);
      kf.push(`@keyframes k${id}{from{transform:translateY(0)}to{transform:translateY(${finalTy.toFixed(1)}px)}}`);
      let cells = "";
      for (let n = 0; n <= d; n++) {
        cells += `<text x="${(c.w / 2).toFixed(1)}" y="${(cellH / 2 + n * cellH).toFixed(1)}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="middle" dominant-baseline="central">${n}</text>`;
      }
      parts.push(
        `<clipPath id="${id}"><rect x="0" y="0" width="${c.w.toFixed(1)}" height="${cellH.toFixed(1)}"/></clipPath>` +
        `<g transform="translate(${cx.toFixed(1)},${top.toFixed(1)})" clip-path="url(#${id})">` +
        `<g transform="translate(0,${finalTy.toFixed(1)})" style="animation:k${id} ${dur}s cubic-bezier(.2,.7,.2,1) forwards">${cells}</g></g>`,
      );
    } else {
      parts.push(`<text x="${(cx + c.w / 2).toFixed(1)}" y="${cy.toFixed(1)}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="middle" dominant-baseline="central">${esc(c.ch)}</text>`);
    }
    cx += c.w;
  }
  return parts.join("");
}
