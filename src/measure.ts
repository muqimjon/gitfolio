export const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(v, max));

export const kFormatter = (n: number): string => {
  const abs = Math.abs(n);
  if (abs < 1000) return String(n);
  const v = n / 1000;
  return (Math.round(v * 10) / 10).toString().replace(/\.0$/, "") + "k";
};

export function measureText(str: unknown, fontSize = 10, weight = 400): number {
  let units = 0;
  for (const ch of String(str ?? "")) {
    if (" iIl.,:;'`|!".includes(ch)) units += 0.3;
    else if ("ftrjJ()[]{}/\\-".includes(ch)) units += 0.38;
    else if ("mwMW@".includes(ch)) units += 0.9;
    else if (ch >= "A" && ch <= "Z") units += 0.68;
    else units += 0.54;
  }
  return units * fontSize * (weight >= 600 ? 1.05 : 1);
}

export function isDark(hex: string): boolean {
  const n = parseInt(hex, 16);
  if (isNaN(n)) return false;
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] < 0.06;
}

export function truncate(str: unknown, maxWidth: number, fontSize = 10, weight = 400): string {
  const s = String(str ?? "");
  if (measureText(s, fontSize, weight) <= maxWidth) return s;
  let out = s;
  while (out.length > 1 && measureText(out + "…", fontSize, weight) > maxWidth) {
    out = out.slice(0, -1);
  }
  return out + "…";
}
