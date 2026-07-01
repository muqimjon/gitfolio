import { esc } from "../measure";
import type { Colors } from "../types";

export function errorCard(err: { message?: string; code?: string } | null | undefined, c: Colors): string {
  const W = 480;
  const H = 120;
  const msg = err?.message || "Something went wrong";
  const hint =
    err?.code === "NO_TOKEN"
      ? "Set GH_TOKEN on your gitfolio instance."
      : err?.code === "NOT_FOUND"
        ? "Double-check the username."
        : err?.code === "RATE"
          ? "Try again later or add more PATs."
          : "";
  const bg = c.bgStops[0];
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="gitfolio error">
<style>text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,Helvetica,Arial,sans-serif}</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${bg}" stroke="${c.border}" stroke-width="1"/>
<text x="24" y="46" fill="${c.primary}" font-size="16" font-weight="700">gitfolio</text>
<text x="24" y="72" fill="${c.text}" font-size="13">${esc(msg)}</text>
${hint ? `<text x="24" y="94" fill="${c.muted}" font-size="11">${esc(hint)}</text>` : ""}
</svg>`;
}
