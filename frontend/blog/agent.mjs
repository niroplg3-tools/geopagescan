// ─────────────────────────────────────────────────────────────────────────
//  GeoPageScan — Blog Agent (agent.mjs)
//  Publishes 2–3 queued articles per run (twice a week), stamps each with the
//  publish date, regenerates all static pages + sitemap, and logs the run.
//  Free, no AI, no per-user cost — it just ships content from queue.mjs.
//
//  Run locally:        node frontend/blog/agent.mjs
//  Force a count:      ARTICLES_PER_RUN=3 node frontend/blog/agent.mjs
//  (Scheduled twice a week by .github/workflows/blog-agent.yml)
//
//  State it maintains (committed, so runs are idempotent across machines):
//    • articles.generated.json — every article the agent has published
//    • state.json              — ids already published (never repeat)
//    • AGENT_BLOG_LOG.md       — human-readable run log
// ─────────────────────────────────────────────────────────────────────────

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES } from "./articles.mjs";
import { QUEUE } from "./queue.mjs";
import { generateBlog } from "./generate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEN_PATH = join(__dirname, "articles.generated.json");
const STATE_PATH = join(__dirname, "state.json");
const LOG_PATH = join(__dirname, "AGENT_BLOG_LOG.md");

const today = () => new Date().toISOString().slice(0, 10);

function estRead(a) {
  const text = (a.sections || []).map((s) => [...(s.p || []), ...(s.list || []), s.code || ""].join(" ")).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.round(words / 200))} min`;
}

async function loadJSON(path, fallback) {
  try { return JSON.parse(await readFile(path, "utf8")); } catch { return fallback; }
}

async function main() {
  // 2 or 3 per run (deterministic-ish: 3 on Mondays, else 2) unless overridden
  const override = Number(process.env.ARTICLES_PER_RUN);
  const perRun = Number.isFinite(override) && override > 0 ? override : (new Date().getUTCDay() === 1 ? 3 : 2);

  const state = await loadJSON(STATE_PATH, { publishedIds: [] });
  const generated = await loadJSON(GEN_PATH, []);

  // anything already live (original + previously published) is off-limits
  const taken = new Set([...state.publishedIds, ...ARTICLES.map((a) => a.id), ...generated.map((a) => a.id)]);
  const pending = QUEUE.filter((t) => !taken.has(t.id));

  if (!pending.length) {
    console.log("⚠ Queue empty — add new entries to frontend/blog/queue.mjs (or enable AI mode). Nothing published this run.");
    process.exit(0);
  }

  const batch = pending.slice(0, perRun).map((t) => ({ ...t, date: today(), read: t.read || estRead(t) }));
  const newGenerated = [...generated, ...batch];

  await writeFile(GEN_PATH, JSON.stringify(newGenerated, null, 2), "utf8");
  state.publishedIds = [...new Set([...state.publishedIds, ...batch.map((a) => a.id)])];
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2), "utf8");

  // regenerate the whole blog from original + all agent-published articles
  const all = [...ARTICLES, ...newGenerated];
  const count = await generateBlog(all);

  // log (newest run at the bottom)
  let log = "";
  try { log = await readFile(LOG_PATH, "utf8"); } catch { log = "# GeoPageScan — Blog Agent Log\n\nA dated record of every automated publishing run.\n"; }
  const remaining = pending.length - batch.length;
  log += `\n## ${today()} — published ${batch.length} article(s)\n` +
    batch.map((a) => `- [${a.cat}] ${a.title}  →  /blog/${a.id}.html`).join("\n") +
    `\n\nBlog now has ${count} posts. Queue remaining: ${remaining}.\n`;
  await writeFile(LOG_PATH, log, "utf8");

  console.log(`✓ Published ${batch.length} article(s): ${batch.map((a) => a.id).join(", ")}`);
  console.log(`  Blog now has ${count} posts. Queue remaining: ${remaining}.`);
  if (remaining <= 4) console.log(`  ↳ Heads up: queue is running low (${remaining} left) — refill frontend/blog/queue.mjs.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
