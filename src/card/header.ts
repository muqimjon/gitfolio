import { esc, truncate, kFormatter } from "../measure";
import type { CardContext, Section } from "../types";

export default function header({ c, W, data }: CardContext): Section {
  const s = data.stats;
  const AV = 54;
  const h = 58;
  const cy = h / 2;
  const tx = AV + 16;

  let avatar: string;
  if (data.avatarDataUri) {
    avatar = `<clipPath id="av"><circle cx="${AV / 2}" cy="${cy}" r="${AV / 2}"/></clipPath>
<image href="${data.avatarDataUri}" x="0" y="${cy - AV / 2}" width="${AV}" height="${AV}" clip-path="url(#av)"/>
<circle cx="${AV / 2}" cy="${cy}" r="${AV / 2 - 0.5}" fill="none" stroke="${c.primary}" stroke-width="1.5" opacity="0.55"/>`;
  } else {
    const initials = s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    avatar = `<circle cx="${AV / 2}" cy="${cy}" r="${AV / 2}" fill="${c.primary}" opacity="0.18"/>
<text x="${AV / 2}" y="${cy}" fill="${c.primary}" font-size="20" font-weight="700" text-anchor="middle" dominant-baseline="central">${esc(initials)}</text>`;
  }

  const name = truncate(s.name, W - tx, 18, 700);
  const meta = `${kFormatter(s.followers)} followers · ${kFormatter(s.following)} following`;

  return {
    h,
    draw: () => `${avatar}
<text x="${tx}" y="19" fill="${c.primary}" font-size="18" font-weight="700">${esc(name)}</text>
<text x="${tx}" y="37" fill="${c.muted}" font-size="12">@${esc(s.login)}</text>
<text x="${tx}" y="53" fill="${c.text}" font-size="11">${esc(meta)}</text>`,
  };
}
