# GeoPageScan — AI Visibility Scanner

> Free AI-visibility audit tool for the generative search era. Scan any website for **GEO**
> (Generative Engine Optimization), **AEO** (Answer Engine Optimization) and **SEO** signals,
> and get a scored report with prioritized, copy-ready fixes.

Dark, glassmorphic React UI with a **video-background hero** and the audit engine front-and-center.
Node/Express backend scrapes the target, checks `/llms.txt` and `/robots.txt`, and produces a
strict six-category JSON report — powered by Claude when an API key is present, or a built-in
**heuristic auditor** (no key required) that scores the real scraped signals.

```
app/
├── backend/
│   ├── server.js          # Express API: scrape + audit (Claude OR heuristic)
│   ├── audit-config.json  # living config: weights, crawlers, schema impacts
│   ├── test-agent.js      # quality gate: 3 domains × 10 checks
│   ├── deploy.js          # Railway deploy trigger + polling
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/{App.jsx, main.jsx, styles.css}
│   ├── public/{hero-bg.mp4, blog.html, logo.svg, llms.txt, robots.txt, sitemap.xml}
│   ├── index.html         # Vite entry (landing + audit tool)
│   └── vite.config.js      # proxy /api → backend:3001
├── CLAUDE.md              # Optimizer Agent instructions
├── AGENT_LOG.md
└── README.md
```

## Quick start (local)

Two terminals.

**1) Backend**
```bash
cd backend
cp .env.example .env          # optional: add ANTHROPIC_API_KEY for AI-powered audits
npm install
npm start                     # → http://localhost:3001
```
Without an API key the engine runs in **heuristic mode** — fully functional, real scores from
real scraped signals. Add `ANTHROPIC_API_KEY` to `.env` to switch to Claude-powered audits.

**2) Frontend**
```bash
cd frontend
npm install
npm run dev                   # → http://localhost:5173
```
Open http://localhost:5173 and scan any URL (try `github.com`, `stripe.com`, `example.com`).

## Verify the engine
```bash
# backend running, then:
cd backend
npm test                      # runs test-agent.js → 3 domains × 10 checks
curl http://localhost:3001/health
```

## API
| Method | Path      | Body / Result |
|--------|-----------|---------------|
| `POST` | `/audit`  | `{ "url": "https://site.com" }` → full audit JSON (see schema below) |
| `GET`  | `/health` | `{ "status": "ok", "engine": "claude\|heuristic" }` |
| `GET`  | `/config` | current crawler list + category weights |

**Audit JSON schema** (exact field names the frontend depends on):
`siteName`, `siteDescription`, `overallScore`, `scoreBreakdown{contentClarity, structuredData,
aiCrawlability, authoritySignals, llmsTxt}`, `categories[]{id, title, priority, score, summary,
items[]{issue, impact, fix, effort}}`, `quickWins[]`, `topRecommendation`.
The six category ids are always: `llms`, `structured-data`, `crawlability`, `authority`, `content`, `technical`.

## Deploy
- **Backend → Railway:** deploy `backend/`, set `ANTHROPIC_API_KEY` (and `PORT`). Note the generated URL.
- **Frontend → Vercel:** root `frontend/`, build `npm run build`, output `dist`, env `VITE_API_URL=<railway-url>`.
- **Domain:** point `geopagescan.com` at Vercel (A `@ → 76.76.21.21`, CNAME `www → cname.vercel-dns.com`).
- Static files (`blog.html`, `llms.txt`, `robots.txt`, `sitemap.xml`) are served from `frontend/public/`.

See `CLAUDE.md` for the autonomous Optimizer Agent that keeps the engine current.

## The hero video
The hero uses `frontend/public/hero-bg.mp4` (a dark navy-teal digital-network loop) at low opacity
behind the centered audit form, with an animated grid, pulsing scan rings and glow blobs layered on top.
Swap the file to rebrand — keep it dark and low-contrast so the form and copy stay readable.

## Notes
- The Anthropic API is **only** called from the backend (it's blocked from browser sandboxes). The Vite proxy handles CORS in dev.
- No CSS framework — pure CSS variables and inline styles for full control.
- Built with Claude · 2026.
