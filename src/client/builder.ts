import type { Social } from "../types";

interface ThemeDef {
  primary: string;
  secondary: string;
  bg: string;
  bg2: string;
}

const THEMES: Record<string, ThemeDef> = {
  dark: { primary: "58A6FF", secondary: "56D364", bg: "0D1117", bg2: "" },
  gold: { primary: "A69139", secondary: "C9B458", bg: "1F222E", bg2: "" },
  light: { primary: "0969DA", secondary: "1A7F37", bg: "FFFFFF", bg2: "" },
  radical: { primary: "FE428E", secondary: "F8D847", bg: "141321", bg2: "" },
  dracula: { primary: "FF6E96", secondary: "79DAFA", bg: "282A36", bg2: "" },
  ocean: { primary: "22D3EE", secondary: "38BDF8", bg: "0F172A", bg2: "" },
  sunset: { primary: "FB923C", secondary: "F472B6", bg: "2A1A1F", bg2: "" },
  forest: { primary: "4ADE80", secondary: "A3E635", bg: "0F1F14", bg2: "" },
};
const DEFAULT_THEME = "dark";
const SECTIONS = ["header", "stats", "langs", "streak", "activity", "stack", "social"];
const SUGGEST = ["dotnet", "csharp", "fsharp", "java", "typescript", "javascript", "python", "go", "rust", "cpp", "php", "ruby", "kotlin", "swift", "dart", "scala", "elixir", "react", "angular", "vue", "nuxt", "svelte", "nextjs", "blazor", "nodejs", "express", "nestjs", "django", "flask", "fastapi", "spring", "laravel", "rails", "tailwind", "bootstrap", "sass", "html", "css", "docker", "kubernetes", "nginx", "terraform", "ansible", "githubactions", "jenkins", "gitlab", "postgres", "mysql", "mariadb", "mssql", "sqlite", "redis", "mongodb", "kafka", "rabbitmq", "elasticsearch", "graphql", "prisma", "firebase", "supabase", "aws", "azure", "gcp", "vercel", "netlify", "cloudflare", "grafana", "prometheus", "git", "github", "linux", "bash", "vscode", "visualstudio", "intellijidea", "postman", "figma", "flutter", "unity", "tensorflow", "pytorch"];
const SOCIAL_SUGGEST = ["github", "linkedin", "telegram", "x", "gmail", "instagram", "youtube", "discord", "facebook", "dribbble", "behance", "medium", "devdotto", "stackoverflow", "website"];

const $ = (id: string): HTMLInputElement => document.getElementById(id) as HTMLInputElement;
const debounce = (fn: (...a: unknown[]) => void, ms = 350) => {
  let t = 0;
  return (...a: unknown[]) => { window.clearTimeout(t); t = window.setTimeout(() => fn(...a), ms); };
};

const stack: string[] = [];
const socials: Social[] = [];
let dragIdx: number | null = null;
let dragEl: HTMLElement | null = null;
let dragging = false;

function attachReorder(el: HTMLElement, i: number, arr: unknown[], rerender: () => void) {
  el.draggable = true;
  el.ondragstart = (e: DragEvent) => { dragIdx = i; dragging = true; el.classList.add("dragging"); e.dataTransfer!.effectAllowed = "move"; };
  el.ondragend = () => { el.classList.remove("dragging"); dragIdx = null; setTimeout(() => (dragging = false), 0); };
  el.ondragover = (e: DragEvent) => { e.preventDefault(); e.dataTransfer!.dropEffect = "move"; };
  el.ondrop = (e: DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const [m] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, m);
    rerender();
    render();
  };
}
function attachSectionReorder(el: HTMLElement) {
  el.draggable = true;
  el.ondragstart = (e: DragEvent) => { dragEl = el; dragging = true; el.classList.add("dragging"); e.dataTransfer!.effectAllowed = "move"; };
  el.ondragend = () => { el.classList.remove("dragging"); dragEl = null; setTimeout(() => (dragging = false), 0); };
  el.ondragover = (e: DragEvent) => { e.preventDefault(); e.dataTransfer!.dropEffect = "move"; };
  el.ondrop = (e: DragEvent) => {
    e.preventDefault();
    if (!dragEl || dragEl === el) return;
    const kids = [...el.parentNode!.children];
    if (kids.indexOf(dragEl) < kids.indexOf(el)) el.after(dragEl); else el.before(dragEl);
    render();
  };
}

function buildSections() {
  const box = $("sections");
  SECTIONS.forEach((s) => {
    const el = document.createElement("span");
    el.className = "chip on";
    el.textContent = s;
    el.dataset.sec = s;
    el.onclick = () => { if (dragging) return; el.classList.toggle("on"); render(); };
    attachSectionReorder(el);
    box.appendChild(el);
  });
}

function buildSuggest() {
  const box = $("stack_suggest");
  SUGGEST.forEach((s) => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = s;
    el.dataset.slug = s;
    el.onclick = () => addStack(s);
    box.appendChild(el);
  });
  syncSuggest();
}
function syncSuggest() {
  document.querySelectorAll<HTMLElement>("#stack_suggest .chip").forEach((el) => {
    el.style.display = stack.includes(el.dataset.slug!) ? "none" : "";
  });
}

function addStack(s: string) {
  s = s.trim().toLowerCase();
  if (!s || stack.includes(s)) return;
  stack.push(s);
  renderStack();
  syncSuggest();
  render();
}
function removeStack(s: string) {
  const i = stack.indexOf(s);
  if (i > -1) stack.splice(i, 1);
  renderStack();
  syncSuggest();
  render();
}
function renderStack() {
  const box = $("stack_selected");
  box.innerHTML = "";
  stack.forEach((s, i) => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = s;
    el.onclick = () => { if (dragging) return; removeStack(s); };
    attachReorder(el, i, stack, renderStack);
    box.appendChild(el);
  });
}

function buildSocialSuggest() {
  const box = $("social_suggest");
  SOCIAL_SUGGEST.forEach((s) => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = s;
    el.dataset.slug = s;
    el.onclick = () => { const inp = $("social_input"); inp.value = s + ":"; inp.focus(); };
    box.appendChild(el);
  });
  syncSocialSuggest();
}
function syncSocialSuggest() {
  const used = new Set(socials.map((x) => x.platform));
  document.querySelectorAll<HTMLElement>("#social_suggest .chip").forEach((el) => {
    el.style.display = used.has(el.dataset.slug!) ? "none" : "";
  });
}
function addSocial(str: string) {
  str = str.trim();
  if (!str) return;
  const i = str.indexOf(":");
  const platform = (i === -1 ? str : str.slice(0, i)).trim().toLowerCase();
  const handle = i === -1 ? "" : str.slice(i + 1).trim();
  if (!platform || socials.some((s) => s.platform === platform)) return;
  socials.push({ platform, handle });
  renderSocials();
  syncSocialSuggest();
  render();
}
function removeSocial(platform: string) {
  const i = socials.findIndex((s) => s.platform === platform);
  if (i > -1) socials.splice(i, 1);
  renderSocials();
  syncSocialSuggest();
  render();
}
function renderSocials() {
  const box = $("social_selected");
  box.innerHTML = "";
  socials.forEach((s, i) => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = s.handle ? `${s.platform}:${s.handle}` : s.platform;
    el.onclick = () => { if (dragging) return; removeSocial(s.platform); };
    attachReorder(el, i, socials, renderSocials);
    box.appendChild(el);
  });
}

function applyTheme(name: string) {
  const t = THEMES[name] || THEMES[DEFAULT_THEME];
  setColor("primary", t.primary);
  setColor("secondary", t.secondary);
  setColor("bg", t.bg);
  setColor("bg2", t.bg2 || t.bg);
}
function setColor(id: string, hex: string) {
  hex = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return;
  $(id).value = "#" + hex;
  $(id + "_hex").value = "#" + hex.toUpperCase();
}
function getColor(id: string): string { return $(id).value.replace("#", ""); }

function checkedSections(): string[] {
  return [...document.querySelectorAll<HTMLElement>("#sections .chip.on")].map((c) => c.dataset.sec!);
}

function buildParams(): URLSearchParams {
  const p = new URLSearchParams();
  const user = $("username").value.trim();
  if (user) p.set("username", user);

  const theme = $("theme").value;
  const t = THEMES[theme];
  if (theme !== DEFAULT_THEME) p.set("theme", theme);

  const diff = (id: string, base: string) => getColor(id).toLowerCase() !== (base || "").toLowerCase();
  if (diff("primary", t.primary)) p.set("primary", getColor("primary"));
  if (diff("secondary", t.secondary)) p.set("secondary", getColor("secondary"));
  if (diff("bg", t.bg)) p.set("bg", getColor("bg"));
  if ($("use_bg2").checked) p.set("bg2", getColor("bg2"));

  const secs = checkedSections();
  const secsDefault = secs.length === SECTIONS.length && secs.every((s, i) => s === SECTIONS[i]);
  if (!secsDefault) p.set("sections", secs.join(","));
  if (stack.length && secs.includes("stack")) {
    p.set("stack", stack.join(","));
    if ($("stack_align").value !== "left") p.set("stack_align", $("stack_align").value);
  }
  if (socials.length && secs.includes("social")) {
    p.set("social", socials.map((s) => (s.handle ? `${s.platform}:${s.handle}` : s.platform)).join(","));
    if ($("social_show").value !== "handle") p.set("social_show", $("social_show").value);
    if ($("social_align").value !== "left") p.set("social_align", $("social_align").value);
    if ($("social_mono").checked) p.set("social_mono", "true");
  }

  if (!$("animation").checked) p.set("animation", "false");
  if ($("all_commits").checked) p.set("all_commits", "true");
  if ($("hide_border").checked) p.set("hide_border", "true");
  if ($("stack_mono").checked) p.set("stack_mono", "true");
  return p;
}

function render() {
  const p = buildParams();
  const hasUser = p.has("username");
  $("hint").style.display = hasUser ? "none" : "block";
  const qs = p.toString();
  const rel = `/api/card?${qs}`;
  const abs = `${location.origin}/api/card?${qs}`;
  $("card").src = hasUser ? rel : "";
  const user = $("username").value.trim() || "USERNAME";
  $("url").textContent = abs;
  $("md").textContent = `![${user}'s GitHub stats](${abs})`;
  $("html").textContent = `<img src="${abs}" alt="${user}'s GitHub stats" />`;
}
const renderDebounced = debounce(render);

async function copy(text: string, btn: HTMLElement) {
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    const old = btn.textContent; btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = old), 1400);
  } catch { btn.textContent = "Ctrl+C"; }
}

function init() {
  const sel = $("theme");
  Object.keys(THEMES).forEach((name) => {
    const o = document.createElement("option");
    o.value = name; o.textContent = name;
    sel.appendChild(o);
  });
  sel.value = DEFAULT_THEME;
  buildSections();
  buildSuggest();
  buildSocialSuggest();
  applyTheme(DEFAULT_THEME);

  sel.onchange = () => { applyTheme(sel.value); render(); };

  ["primary", "secondary", "bg", "bg2"].forEach((id) => {
    $(id).oninput = () => { $(id + "_hex").value = $(id).value.toUpperCase(); renderDebounced(); };
    $(id + "_hex").oninput = () => {
      const v = $(id + "_hex").value.replace("#", "");
      if (/^[0-9a-fA-F]{6}$/.test(v)) { $(id).value = "#" + v; renderDebounced(); }
    };
  });

  $("username").oninput = renderDebounced;
  ["animation", "all_commits", "hide_border", "stack_mono", "social_mono", "use_bg2"].forEach((id) => ($(id).onchange = render));
  ["social_show", "stack_align", "social_align"].forEach((id) => ($(id).onchange = render));

  document.querySelectorAll<HTMLElement>(".legend.toggle").forEach((btn) => {
    btn.onclick = () => {
      const body = $(btn.dataset.target!);
      const opening = body.hasAttribute("hidden");
      body.toggleAttribute("hidden", !opening);
      btn.closest(".collapsible")!.classList.toggle("open", opening);
    };
  });

  $("stack_input").addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = e.target as HTMLInputElement;
      t.value.split(",").forEach(addStack);
      t.value = "";
    }
  });

  $("social_input").addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const t = e.target as HTMLInputElement;
      t.value.split(",").forEach(addSocial);
      t.value = "";
    }
  });

  $("refresh").onclick = () => {
    const p = buildParams();
    if (!p.has("username")) return;
    p.set("_", String(Date.now()));
    $("card").src = `/api/card?${p.toString()}`;
  };

  document.querySelectorAll<HTMLElement>(".copy").forEach((b) => {
    b.onclick = () => copy($(b.dataset.copy!).textContent ?? "", b);
  });

  render();
}

init();
