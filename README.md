<div align="center">

# gitfolio

**One compact, animated, fully-customizable GitHub stats card.**
Self-hostable · one image · any username · exact colors.

<!-- After deploy, replace INSTANCE with your Vercel domain to show a live demo here -->
![gitfolio card](https://INSTANCE.vercel.app/api/card?username=muqimjon&theme=gold)

[Builder](https://INSTANCE.pages.dev) · [Deploy your own](#deploy-your-own)

</div>

---

## Why

Public stat-card services (`github-readme-stats`, `github-profile-trophy`) frequently go down (rate limits) and can't honor exact custom colors. **gitfolio** is a single, self-hosted endpoint that renders everything you need in **one** compact SVG — avatar, key stats, top languages, streak, contribution activity, and your tech stack — with full control over colors and which sections appear.

## Usage

Add one image to your profile `README.md` (swap `INSTANCE` for your deployed domain and set your username):

```md
![My GitHub stats](https://INSTANCE.vercel.app/api/card?username=YOUR_NAME&theme=gold)
```

Or build it visually with the **[interactive builder](https://INSTANCE.vercel.app)** — pick colors, toggle sections, choose your stack, copy the snippet.

## Parameters

`GET /api/card`

| Param | Description | Default |
|---|---|---|
| `username` | GitHub username (**required**) | — |
| `theme` | Preset: `dark`, `gold`, `light`, `radical`, `dracula`, `ocean`, `sunset`, `forest` | `dark` |
| `primary` | Accent/title color (hex, no `#`) | theme |
| `secondary` | Icons/streak-ring color | theme |
| `bg` | Background color, or gradient `deg,c1,c2` | theme |
| `bg2` | Second gradient stop | — |
| `sections` | Comma list of `header,stats,langs,streak,activity,stack,social` | all |
| `stack` | Comma list of tech slugs, e.g. `dotnet,react,docker` | — |
| `stack_mono` | Tint stack icons with the `secondary` color instead of brand colors | `false` |
| `social` | Comma list of `platform:handle`, e.g. `github:you,linkedin:you` | — |
| `social_show` | How each social renders: `handle`, `name`, or `icon` | `handle` |
| `social_mono` | Tint social icons with the `secondary` color | `false` |
| `all_commits` | Count all-time commits (slower) instead of last year | `false` |
| `animation` | Set `false` to disable animations | `true` |
| `hide_border` | Hide the card border | `false` |
| `cache_seconds` | Cache TTL (clamped 43200–172800) | `86400` |

### Tech stack slugs

Any [Simple Icons](https://simpleicons.org) slug works (e.g. `docker`, `redis`, `angular`, `typescript`). Friendly aliases: `node`, `vue`, `next`, `postgres`, `k8s`, `cs`, `dotnet`, `tailwind`, `html`, `css`, `gcp`, `kafka`, `mssql`. Brands dropped from Simple Icons for trademark reasons (`csharp`, `aws`, `azure`, `visualstudio`, …) ship as bundled logos. The few with no logo anywhere (`wpf`, `maui`, `winforms`, `blazor`, …) render as neat text badges. Near-black logos are auto-lightened for dark backgrounds.

### Social links

`social=github:muqimjon,linkedin:muqimjon,telegram:you` adds a **CONNECT** row. Each entry is `platform:handle` — `platform` is a Simple Icons slug (`github`, `linkedin`, `telegram`, `x`, `gmail`, `instagram`, `youtube`, `discord`, …) drawn as an icon, `handle` is your username on it. Pick the layout with `social_show`:

- `handle` (default) → `[logo] muqimjon`
- `name` → `[logo] Telegram`
- `icon` → `[logo]` only

Handles resolve to real links (`github:muqimjon` → `https://github.com/muqimjon`, `gmail:you@x.com` → `mailto:…`); pass a full `https://…` as the handle to override. The links are real `<a>` elements, so they're clickable when the card is opened as an SVG or embedded with `<object>`. **On a GitHub README the card is served through an `<img>` proxy, which renders it as a static image — per-icon links won't be clickable there.** To make the whole card a link, wrap it: `[![stats](CARD_URL)](https://github.com/you)`.

### Animation

When `animation` is on (default), sections fade in on load, the activity line draws left→right, the current-streak ring sweeps like a clock, and every number counts up from zero. Everything honors `prefers-reduced-motion` and falls back to a correct static card, so it stays readable even where GitHub's image proxy renders only the first frame.

## Deploy your own

gitfolio is a static folder (`public/`) plus one serverless function that shares a single platform‑neutral core (`src/handler.js`). It runs on **Cloudflare Pages** (via `functions/api/card.js`) or **Vercel** (via `api/card.js`) — no build step, one env var.

### Cloudflare Pages (recommended)

1. Fork this repo. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick your fork.
2. Build settings:
   - **Build command:** *(leave empty)*
   - **Build output directory:** `public`
   - Functions are auto‑detected from `/functions` — nothing else to set. No `nodejs_compat` flag needed (the code uses only Web APIs).
3. Create a **classic** [Personal Access Token](https://github.com/settings/tokens) with **no scopes checked** (public data only).
4. **Settings → Environment variables** → add `GH_TOKEN` = your token → redeploy.
5. Builder: `https://YOUR-PROJECT.pages.dev` · Card: `https://YOUR-PROJECT.pages.dev/api/card?username=ANYONE`.

### Vercel (alternative)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmuqimjon%2Fgitfolio&env=GH_TOKEN&envDescription=A%20no-scope%20GitHub%20token%20used%20to%20read%20public%20stats&envLink=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens&project-name=gitfolio&repository-name=gitfolio)

Import the repo, set `GH_TOKEN`, deploy. `public/` is served at the root and `api/card.js` becomes the function automatically.

### Environment variables

| Var | Purpose |
|---|---|
| `GH_TOKEN` | GitHub token (required). |
| `PAT_1`, `PAT_2`, … | Optional extra tokens; gitfolio rotates through them to multiply the rate limit. |
| `WHITELIST` | Optional comma-separated usernames this instance will serve. Empty = anyone. |
| `CACHE_SECONDS` | Optional fixed cache TTL (overrides the per-request clamp). |

## Local development

```bash
npm install
echo "GH_TOKEN=your_token" > .env
node scripts/serve.js                                     # http://localhost:8787  (builder + /api/card)
node scripts/preview.js muqimjon --theme=gold --out=out.svg   # render to a file
```

## Credits

- Tech icons from [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0). UI glyphs from [Octicons](https://github.com/primer/octicons) (MIT).
- Contribution/stat concepts inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) (MIT).

## License

[MIT](LICENSE) © Muqimjon Mamadaliyev
