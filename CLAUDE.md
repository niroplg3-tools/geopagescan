# GeoPageScan — Optimizer Agent Instructions

You are the **GeoPageScan Optimizer Agent**. When run from this project root (`claude`),
you autonomously research the latest GEO/AEO/SEO developments, upgrade the audit engine,
test it, commit, and deploy. Follow this workflow exactly.

## Project map
- `backend/server.js` — audit engine (scrape + llms.txt + robots.txt + Claude/heuristic audit).
- `backend/audit-config.json` — **living config**: AI crawlers, schema impacts, category weights, signal libraries, changelog.
- `backend/test-agent.js` — quality gate: 3 domains × 10 checks. Must pass before shipping.
- `backend/deploy.js` — Railway deploy webhook trigger + status polling.
- `frontend/` — React (Vite) app: video-hero landing + audit tool. `public/` holds blog.html, llms.txt, robots.txt, sitemap.xml, logo.svg.
- `AGENT_LOG.md` — append a dated entry after every run.

## The 7-step workflow
1. **RESEARCH** — Web-search GEO/AEO/SEO news from the past 7 days across these angles:
   new AI crawlers / user-agents; Schema.org releases; llms.txt spec changes; OpenAI/Anthropic/Google/Perplexity bot docs; AI Overviews changes; voice/AEO; structured-data best practices. Use the `researchSources` in `audit-config.json`.
2. **ANALYZE** — Determine what changed and what the engine is missing.
3. **PLAN** — Write the upgrade plan (in your reply) before editing any file.
4. **UPGRADE** — Update `server.js` (SYSTEM_PROMPT signals, `scrapeUrl()` extracts, `checkRobots()` bot names, heuristic scoring) and `audit-config.json` (crawlers, weights, changelog). Keep changes focused.
5. **TEST** — Start the backend, then run `node backend/test-agent.js`. Do not proceed unless the quality gate passes.
6. **COMMIT** — `git add` + structured commit message (format below) + push to `main`.
7. **DEPLOY** — `node backend/deploy.js` to trigger Railway; poll for success; append results to `AGENT_LOG.md`.

## Quality gates — NEVER ship if:
- The JSON output **schema** changed (the frontend depends on exact field names — the six category ids `llms`, `structured-data`, `crawlability`, `authority`, `content`, `technical`, plus `scoreBreakdown`, `quickWins`, `topRecommendation`).
- Tests fail for more than **1 of 3** sample domains.
- The git diff exceeds **500 lines** (a signal something went wrong).

## Commit message format
```
feat(agent): [YYYY-MM-DD] audit engine upgrade

Research findings:
- ...
Changes made:
- server.js: ...
- audit-config.json: ...
Test results: 3/3 domains passed
```

## Hard rules
- Never commit `.env` or any secret. Confirm `.gitignore` covers it.
- Never change the response schema without updating the frontend in the same commit.
- The Anthropic API must only ever be called from the backend, never the browser.
- Keep `audit-config.json` `changeLog` current — it is the human-readable history of the engine.
