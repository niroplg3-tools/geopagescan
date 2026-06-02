// ─────────────────────────────────────────────────────────────────────────
//  GeoPageScan — Agent Test Suite (test-agent.js)
//  Runs the audit engine against 3 sample domains and asserts 10 checks each.
//  The Optimizer Agent refuses to commit/deploy unless this passes.
//  Usage:  node test-agent.js     (backend must be running on TEST_BACKEND_URL)
// ─────────────────────────────────────────────────────────────────────────

import "dotenv/config";

const BACKEND = process.env.TEST_BACKEND_URL || "http://localhost:3001";
const DOMAINS = ["https://example.com", "https://github.com", "https://fullpower.co.il"];
const REQUIRED_IDS = ["llms", "structured-data", "crawlability", "authority", "content", "technical"];

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function checks(audit) {
  const isNum = (n) => typeof n === "number" && n >= 0 && n <= 100;
  const cats = Array.isArray(audit.categories) ? audit.categories : [];
  const ids = cats.map((x) => x.id);
  const sb = audit.scoreBreakdown || {};
  return [
    ["has siteName", typeof audit.siteName === "string" && audit.siteName.length > 0],
    ["has one-sentence description", typeof audit.siteDescription === "string"],
    ["overallScore in 0-100", isNum(audit.overallScore)],
    ["6 categories present", cats.length === 6],
    ["all required ids present", REQUIRED_IDS.every((id) => ids.includes(id))],
    ["every category score valid", cats.every((x) => isNum(x.score))],
    ["every category has priority", cats.every((x) => ["critical", "high", "medium", "low"].includes(x.priority))],
    ["every item has issue/impact/fix/effort", cats.every((x) => Array.isArray(x.items) && x.items.every((i) => i.issue && i.impact && i.fix && ["easy", "medium", "hard"].includes(i.effort)))],
    ["scoreBreakdown has 5 keys", ["contentClarity", "structuredData", "aiCrawlability", "authoritySignals", "llmsTxt"].every((k) => isNum(sb[k]))],
    ["quickWins + topRecommendation present", Array.isArray(audit.quickWins) && typeof audit.topRecommendation === "string"],
  ];
}

async function waitForHealth(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(`${BACKEND}/health`);
      if (r.ok) return (await r.json());
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Backend not reachable at ${BACKEND}/health`);
}

async function auditDomain(url) {
  const r = await fetch(`${BACKEND}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

async function main() {
  console.log(c.cyan("\n  GeoPageScan — Agent Test Suite\n"));
  const health = await waitForHealth();
  console.log(c.dim(`  Backend: ${BACKEND}  ·  engine: ${health.engine}\n`));

  let domainsPassed = 0;
  let totalChecks = 0;
  let passedChecks = 0;

  for (const url of DOMAINS) {
    process.stdout.write(`  ${c.cyan("▸")} ${url}\n`);
    try {
      const audit = await auditDomain(url);
      const results = checks(audit);
      let ok = 0;
      for (const [name, pass] of results) {
        totalChecks++;
        if (pass) { ok++; passedChecks++; }
        console.log(`     ${pass ? c.green("✓") : c.red("✗")} ${name}`);
      }
      const allPass = ok === results.length;
      if (allPass) domainsPassed++;
      console.log(`     ${allPass ? c.green(`PASS ${ok}/${results.length}`) : c.red(`FAIL ${ok}/${results.length}`)}  ${c.dim(`score ${audit.overallScore}/100`)}\n`);
    } catch (e) {
      console.log(`     ${c.red("✗ request failed:")} ${e.message}\n`);
    }
  }

  console.log(c.cyan("  ── Summary ──"));
  console.log(`  Domains passed: ${domainsPassed}/${DOMAINS.length}`);
  console.log(`  Checks passed:  ${passedChecks}/${totalChecks}\n`);

  // Quality gate: agent ships only if at least 2 of 3 domains fully pass.
  if (domainsPassed >= 2) {
    console.log(c.green("  ✓ QUALITY GATE PASSED — safe to commit & deploy\n"));
    process.exit(0);
  } else {
    console.log(c.red("  ✗ QUALITY GATE FAILED — do NOT ship\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(c.red(`\n  Fatal: ${e.message}\n`));
  process.exit(1);
});
