import type { Colors, Query } from "./types";

const DEFAULT_THEME = "dark";

interface ThemePreset {
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  bg: string;
  bg2: string;
}

export const themes: Record<string, ThemePreset> = {
  gold: { primary: "A69139", secondary: "C9B458", text: "C9D1D9", muted: "8B949E", border: "2A2E3B", bg: "1F222E", bg2: "" },
  dark: { primary: "58A6FF", secondary: "56D364", text: "C9D1D9", muted: "8B949E", border: "30363D", bg: "0D1117", bg2: "" },
  light: { primary: "0969DA", secondary: "1A7F37", text: "1F2328", muted: "656D76", border: "D0D7DE", bg: "FFFFFF", bg2: "" },
  radical: { primary: "FE428E", secondary: "F8D847", text: "A9FEF7", muted: "A9FEF7", border: "30363D", bg: "141321", bg2: "" },
  dracula: { primary: "FF6E96", secondary: "79DAFA", text: "F8F8F2", muted: "BD93F9", border: "44475A", bg: "282A36", bg2: "" },
  ocean: { primary: "22D3EE", secondary: "38BDF8", text: "E2E8F0", muted: "94A3B8", border: "1E293B", bg: "0F172A", bg2: "" },
  sunset: { primary: "FB923C", secondary: "F472B6", text: "FFEDD5", muted: "FDBA74", border: "3B2A2A", bg: "2A1A1F", bg2: "" },
  forest: { primary: "4ADE80", secondary: "A3E635", text: "DCFCE7", muted: "86EFAC", border: "1F2E22", bg: "0F1F14", bg2: "" },
};

const isHex = (s?: string): boolean => /^([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s || "");

const isGradient = (s?: string): boolean => {
  const p = String(s || "").split(",");
  return p.length >= 3 && !isNaN(parseFloat(p[0])) && p.slice(1).every((x) => isHex(x));
};

const rawHex = (v: string | undefined, fb: string): string => (isHex(v) ? (v as string) : fb);
const pickHex = (v: string | undefined, fb: string): string => "#" + (isHex(v) ? (v as string) : fb);

export function resolveColors(q: Query = {}, themeName?: string): Colors {
  const base = themes[themeName || ""] || themes[DEFAULT_THEME];

  let bgStops: string[];
  let bgAngle = 135;
  if (q.bg && isGradient(q.bg)) {
    const parts = q.bg.split(",");
    bgAngle = parseFloat(parts[0]);
    bgStops = parts.slice(1).map((h) => "#" + h);
  } else {
    const b1 = rawHex(q.bg, base.bg);
    const b2 = rawHex(q.bg2, base.bg2);
    bgStops = b2 ? ["#" + b1, "#" + b2] : ["#" + b1];
  }

  return {
    primary: pickHex(q.primary, base.primary),
    secondary: pickHex(q.secondary, base.secondary),
    text: pickHex(q.text, base.text),
    muted: pickHex(q.muted, base.muted),
    border: pickHex(q.border, base.border),
    bgStops,
    bgAngle,
  };
}
