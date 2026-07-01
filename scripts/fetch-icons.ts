import { writeFileSync } from "node:fs";

const BASE = "https://raw.githubusercontent.com/devicons/devicon/master/icons";
const SPECS: Record<string, string> = {
  csharp: "csharp/csharp-plain",
  java: "java/java-plain",
  azure: "azure/azure-plain",
  aws: "amazonwebservices/amazonwebservices-plain-wordmark",
  vscode: "vscode/vscode-plain",
  nuxt: "nuxtjs/nuxtjs-plain",
  windows: "windows8/windows8-original",
  fsharp: "fsharp/fsharp-plain",
  linkedin: "linkedin/linkedin-plain",
  mssql: "microsoftsqlserver/microsoftsqlserver-plain",
  visualstudio: "visualstudio/visualstudio-plain",
  oracle: "oracle/oracle-original",
  playwright: "playwright/playwright-plain",
};

const out: Record<string, { path: string; vbW: number; vbH: number }> = {};
for (const [key, spec] of Object.entries(SPECS)) {
  try {
    const svg = await fetch(`${BASE}/${spec}.svg`).then((r) => r.text());
    const vb = svg.match(/viewBox="([\d.\s]+)"/);
    const d = svg.match(/\sd="([^"]+)"/);
    if (!d) { console.error(`SKIP ${key}: no path`); continue; }
    let vbW = 128, vbH = 128;
    if (vb) { const p = vb[1].trim().split(/\s+/).map(Number); vbW = p[2]; vbH = p[3]; }
    out[key] = { path: d[1], vbW, vbH };
    console.error(`ok ${key}: vb ${vbW}x${vbH}, d ${d[1].length} chars`);
  } catch (e) {
    console.error(`FAIL ${key}: ${(e as Error).message}`);
  }
}

const body =
  "export const EXTRA_ICONS: Record<string, { path: string; vbW: number; vbH: number }> = " +
  JSON.stringify(out, null, 2) + ";\n";
writeFileSync("src/icon-extra.ts", body);
console.error(`\nwrote src/icon-extra.ts with ${Object.keys(out).length} icons`);
