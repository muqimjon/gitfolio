import * as si from "simple-icons";
import { EXTRA_ICONS } from "./icon-extra.js";

const bySlug = new Map();
for (const key in si) {
  const ic = si[key];
  if (ic && ic.slug) bySlug.set(ic.slug, ic);
}

const INLINE_ICONS = {
  globe: {
    label: "Website",
    hex: "1F2328",
    vb: 16,
    fr: "evenodd",
    path: "M8 0a8 8 0 100 16A8 8 0 008 0zM5.78 8.75a9.64 9.64 0 001.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0010.22 8.75H5.78zm4.44-1.5a9.64 9.64 0 00-1.363-4.177c-.307-.51-.612-.919-.857-1.215-.245.296-.55.705-.857 1.215A9.64 9.64 0 005.78 7.25h4.44zm-5.944 1.5H1.543a6.507 6.507 0 004.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 00-4.666 5.5zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 004.666-5.5h-2.733zm2.733-1.5a6.507 6.507 0 00-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948h2.733z",
  },
};

const EXTRA_META = {
  csharp: { label: "C#", hex: "512BD4" },
  java: { label: "Java", hex: "ED8B00" },
  azure: { label: "Azure", hex: "0089D6" },
  aws: { label: "AWS", hex: "FF9900" },
  vscode: { label: "VS Code", hex: "007ACC" },
  nuxt: { label: "Nuxt", hex: "00DC82" },
  windows: { label: "Windows", hex: "0078D6" },
  fsharp: { label: "F#", hex: "378BBA" },
  linkedin: { label: "LinkedIn", hex: "0A66C2" },
  mssql: { label: "SQL Server", hex: "CC2927" },
  visualstudio: { label: "Visual Studio", hex: "9B4F96" },
  oracle: { label: "Oracle", hex: "F80000" },
  playwright: { label: "Playwright", hex: "2EAD33" },
};

const ALIAS = {
  node: "nodedotjs", nodejs: "nodedotjs",
  vue: "vuedotjs", vuejs: "vuedotjs",
  next: "nextdotjs", nextjs: "nextdotjs",
  nuxtjs: "nuxt",
  tailwind: "tailwindcss", tw: "tailwindcss",
  postgres: "postgresql", psql: "postgresql", pg: "postgresql",
  mongo: "mongodb", k8s: "kubernetes",
  ts: "typescript", js: "javascript", py: "python",
  html: "html5", css3: "css", scss: "sass",
  bash: "gnubash", sh: "gnubash", shell: "gnubash", zsh: "gnubash",
  website: "globe", web: "globe", site: "globe", portfolio: "globe", link: "globe",
  gh: "github", golang: "go", rb: "ruby",
  cpp: "cplusplus", "c++": "cplusplus", cs: "csharp", "c#": "csharp", "f#": "fsharp",
  gcp: "googlecloud", tf: "terraform", gql: "graphql", es: "elasticsearch",
  rn: "react", vs: "visualstudio", visualstudiocode: "vscode", vscode: "vscode",
  dotnet: "dotnet", ".net": "dotnet", net: "dotnet",
  amazonaws: "aws", amazonwebservices: "aws", microsoftazure: "azure",
  actions: "githubactions", gha: "githubactions",
  kafka: "apachekafka", rmq: "rabbitmq", rabbit: "rabbitmq",
  mssql: "mssql", sqlserver: "mssql", microsoftsqlserver: "mssql",
  twitter: "x", ig: "instagram", yt: "youtube", so: "stackoverflow",
  gmail: "gmail", email: "gmail", mail: "gmail",
};

const TEXT_FALLBACK = {
  wpf: { label: "WPF", hex: "512BD4" },
  maui: { label: ".NET MAUI", hex: "512BD4" },
  winforms: { label: "WinForms", hex: "512BD4" },
  xamarin: { label: "Xamarin", hex: "3498DB" },
  efcore: { label: "EF Core", hex: "512BD4" },
  blazor: { label: "Blazor", hex: "512BD4" },
};

export function resolveIcons(list, limit = 20) {
  const out = [];
  for (const raw of list.slice(0, limit)) {
    const key = raw.toLowerCase();
    const slug = ALIAS[key] || key;
    if (INLINE_ICONS[slug]) {
      const g = INLINE_ICONS[slug];
      out.push({ path: g.path, hex: g.hex, label: g.label, vb: g.vb, fr: g.fr });
      continue;
    }
    const ic = bySlug.get(slug);
    if (ic) {
      out.push({ path: ic.path, hex: ic.hex, label: ic.title, vb: 24 });
    } else if (EXTRA_ICONS[slug]) {
      const m = EXTRA_META[slug] || { label: slug, hex: "9CA3AF" };
      out.push({ path: EXTRA_ICONS[slug].path, hex: m.hex, label: m.label, vb: EXTRA_ICONS[slug].vbH });
    } else if (TEXT_FALLBACK[slug] || TEXT_FALLBACK[key]) {
      const f = TEXT_FALLBACK[slug] || TEXT_FALLBACK[key];
      out.push({ label: f.label, hex: f.hex });
    } else {
      out.push({ label: raw.toUpperCase(), hex: "9CA3AF" });
    }
  }
  return out;
}
