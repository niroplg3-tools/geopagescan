# GeoPageScan — Blog Agent

Automatically publishes **2–3 new articles twice a week** with **zero per-user cost** and
**no server**. It simply ships pre-written articles from a queue and regenerates the static
pages; GitHub Actions runs it on a schedule and Vercel auto-redeploys.

## How it works

```
queue.mjs ──(agent picks 2–3)──▶ articles.generated.json ──(generate.mjs)──▶ public/blog/*.html
   │                                     │                                         + blog.html
   └ ready-to-publish backlog            └ everything ever published               + sitemap.xml
```

- `queue.mjs` — the backlog of ready articles (no date).
- `agent.mjs` — picks the next 2–3, stamps today's date, regenerates the whole blog, logs the run.
- `generate.mjs` — renders index + per-post pages (Article/FAQPage/Breadcrumb schema) + covers + sitemap.
- `state.json` / `articles.generated.json` — track what's been published (never repeats).
- `AGENT_BLOG_LOG.md` — dated log of every run.

## Run it

```bash
cd frontend
npm run blog:agent        # publish this run's 2–3 articles now
npm run blog:build        # just rebuild pages from current data (no publishing)
```

It posts **3 on Mondays, 2 on Thursdays** by default. Override: `ARTICLES_PER_RUN=3 npm run blog:agent`.

## Schedule (automatic, free)

`.github/workflows/blog-agent.yml` runs the agent every **Mon & Thu 14:00 UTC**, commits the new
pages, and pushes — Vercel redeploys automatically. Nothing to host. Requires the repo on GitHub
with default `GITHUB_TOKEN` write permission (already configured in the workflow).

You can also trigger it manually from the GitHub **Actions** tab ("Run workflow").

## Keep the queue full

The agent prints `Queue remaining: N` and warns at ≤4. To add more, append entries to `QUEUE` in
`queue.mjs` (copy an existing one's shape: `id, cat, emoji, title, dek, keywords, sections[], faq[],
optional comparison{}, related[]`). Each becomes a fully SEO/GEO/AEO-optimized page automatically.

## Optional: let Claude write the queue (later)

Today this is 100% free and template-free (you author the queue). When you want hands-off content,
add a step that calls the Claude API to generate new `queue.mjs`-shaped entries (≈ $0.01–0.05 per
article on Haiku/Sonnet — a few dollars a month at this cadence). That cost is fixed and unrelated
to user audits, which stay free/heuristic.
