// ─────────────────────────────────────────────────────────────────────────
//  GeoPageScan — Railway Deploy Trigger (deploy.js)
//  Fires the Railway deploy webhook, then polls deployment status (if a
//  RAILWAY_API_TOKEN + RAILWAY_SERVICE_ID are configured) every 6 seconds.
//  Used by the Optimizer Agent as the final DEPLOY step.
//  Usage:  node deploy.js
// ─────────────────────────────────────────────────────────────────────────

import "dotenv/config";

const WEBHOOK = process.env.RAILWAY_DEPLOY_WEBHOOK || "";
const API_TOKEN = process.env.RAILWAY_API_TOKEN || "";
const SERVICE_ID = process.env.RAILWAY_SERVICE_ID || "";

async function triggerDeploy() {
  if (!WEBHOOK) {
    console.error("✗ RAILWAY_DEPLOY_WEBHOOK is not set in .env — cannot deploy.");
    console.error("  Get it from: Railway dashboard → service → Settings → Deploy Webhook.");
    process.exit(1);
  }
  console.log("▸ Triggering Railway deploy…");
  const res = await fetch(WEBHOOK, { method: "POST" });
  if (!res.ok) throw new Error(`Webhook returned ${res.status}: ${await res.text()}`);
  console.log("✓ Deploy webhook accepted.");
}

async function pollStatus() {
  if (!API_TOKEN || !SERVICE_ID) {
    console.log("ℹ No RAILWAY_API_TOKEN/SERVICE_ID set — skipping status polling.");
    console.log("  Check the Railway dashboard for build progress.");
    return;
  }
  const query = `query($id: String!) {
    service(id: $id) { deployments(first: 1) { edges { node { id status createdAt } } } }
  }`;
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch("https://backboard.railway.app/graphql/v2", {
        method: "POST",
        headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { id: SERVICE_ID } }),
      });
      const json = await res.json();
      const node = json?.data?.service?.deployments?.edges?.[0]?.node;
      const status = node?.status || "UNKNOWN";
      console.log(`  [${i + 1}] status: ${status}`);
      if (status === "SUCCESS") { console.log("✓ Deployment live."); return; }
      if (["FAILED", "CRASHED", "REMOVED"].includes(status)) throw new Error(`Deployment ${status}`);
    } catch (e) {
      console.warn(`  poll error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  console.warn("⚠ Timed out waiting for SUCCESS — check Railway dashboard.");
}

(async () => {
  try {
    await triggerDeploy();
    await pollStatus();
  } catch (e) {
    console.error(`✗ Deploy failed: ${e.message}`);
    process.exit(1);
  }
})();
