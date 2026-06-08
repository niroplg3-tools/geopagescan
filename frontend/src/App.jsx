import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   API base — dev uses the Vite proxy (/api → :3001). In production set
   VITE_API_URL to the deployed Railway backend.
   ═══════════════════════════════════════════════════════════════════════ */
const API = import.meta.env.VITE_API_URL || "/api";

/* ── inline SVG icons (no emoji for structural icons) ─────────────────── */
const Ic = {
  search: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
  bolt: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>),
  check: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5" /></svg>),
  arrow: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>),
  chevron: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6" /></svg>),
  star: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>),
  alert: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>),
  hex: (p) => (<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M12 2 21 7v10l-9 5-9-5V7l9-5z" /><path d="M12 7v5l4 2" strokeLinecap="round" /></svg>),
  // category icons
  llms: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></svg>),
  "structured-data": (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>),
  crawlability: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" /><path d="M12 5V2M12 22v-3M5 12H2M22 12h-3M7 7 5 5M17 7l2-2M7 17l-2 2M17 17l2 2" /></svg>),
  authority: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z" /><path d="m9 12 2 2 4-4" /></svg>),
  content: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>),
  technical: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9-4 3 4 3M18 9l4 3-4 3M14 4l-4 16" /></svg>),
};

/* ── logo ─────────────────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gps-g" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#00E5FF" /><stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path d="M24 3 41 13v22L24 45 7 35V13L24 3z" stroke="url(#gps-g)" strokeWidth="2.4" fill="rgba(0,229,255,0.05)" />
      <circle cx="24" cy="24" r="9" stroke="url(#gps-g)" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="3" fill="url(#gps-g)" />
      <path d="M24 15v-4M24 37v-4M33 24h4M11 24h4" stroke="url(#gps-g)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── data ─────────────────────────────────────────────────────────────── */
const CAT_META = {
  llms: { title: "LLM Optimization", tag: "GEO" },
  "structured-data": { title: "Structured Data & Schema", tag: "AEO" },
  crawlability: { title: "AI Crawlability", tag: "GEO" },
  authority: { title: "Authority Signals", tag: "SEO" },
  content: { title: "Content Clarity", tag: "AEO" },
  technical: { title: "Technical SEO", tag: "SEO" },
};

const FEATURES = [
  { id: "llms", tag: "GEO", title: "LLM Optimization", desc: "Checks for an llms.txt file, clear entity definitions and FAQ content that AI engines can quote directly.", bullets: ["llms.txt presence & quality", "Entity definition clarity", "FAQ content for AI Q&A"] },
  { id: "structured-data", tag: "AEO", title: "Structured Data & Schema", desc: "Detects JSON-LD and the Schema.org types that make your content machine-readable to AI.", bullets: ["JSON-LD detection", "FAQPage, LocalBusiness, Article", "HowTo & AggregateRating"] },
  { id: "crawlability", tag: "GEO", title: "AI Crawlability", desc: "Verifies AI bots can actually reach you — robots.txt rules, sitemaps and JS/video content barriers.", bullets: ["GPTBot, ClaudeBot, PerplexityBot", "Sitemap & robots directives", "JS / video content barriers"] },
  { id: "authority", tag: "SEO", title: "Authority Signals", desc: "Evaluates entity authority: author linking, review schema, About-page quality and external profiles.", bullets: ["Author / founder entity links", "Review & rating schema", "Wikidata / LinkedIn presence"] },
  { id: "content", tag: "AEO", title: "Content Clarity", desc: "Scores direct-answer structure, question-led headings and the informational-vs-promotional balance.", bullets: ["Direct-answer structure", "Q&A heading patterns", "Informational vs promotional"] },
  { id: "technical", tag: "SEO", title: "Technical SEO", desc: "The classic signals AI still relies on — canonical, hreflang, Open Graph, viewport and vitals.", bullets: ["Canonical & hreflang", "Open Graph & Twitter cards", "Mobile viewport & vitals"] },
];

const WHY = [
  { title: "AI answers skip your links", desc: "40–70% of searches now get an AI-generated answer. If AI can't read you, you're simply not in the conversation." },
  { title: "Zero-click is rising fast", desc: "Users get their answer without ever visiting a site. Being the cited source is the new page-one ranking." },
  { title: "Traditional SEO isn't enough", desc: "Keywords and backlinks don't tell an LLM what you are. Entity clarity and structure now decide visibility." },
  { title: "The window is open — for now", desc: "94% of sites score below 40/100 for AI visibility. Early movers get cited; latecomers stay invisible." },
];

const STEPS = [
  { n: "01", t: "Enter any URL", d: "No login, no credit card. Paste a website and hit scan." },
  { n: "02", t: "AI analyzes", d: "We scrape HTML, schema, llms.txt and robots.txt, then audit every signal." },
  { n: "03", t: "Get your score", d: "A 0–100 AI-visibility score across six GEO/AEO/SEO categories." },
  { n: "04", t: "Fix what matters", d: "Prioritized, copy-ready fixes with effort estimates and quick wins." },
];

const TESTIMONIALS = [
  { q: "We added an llms.txt and FAQ schema after our scan. Within weeks ChatGPT started citing us for our category. This tool paid for itself instantly — and it's free.", n: "Maya R.", r: "Head of Growth, B2B SaaS", a: "MR" },
  { q: "Finally a scanner that explains GEO in plain English. The prioritized fixes meant my team knew exactly what to do Monday morning.", n: "Daniel K.", r: "SEO Lead, Agency", a: "DK" },
  { q: "I audit every client site with GeoPageScan before onboarding. The report makes the AI-visibility gap impossible to ignore.", n: "Sofia L.", r: "Founder, Digital Studio", a: "SL" },
];

const FAQS = [
  { q: "What is GEO and how is it different from SEO?", a: "GEO (Generative Engine Optimization) is the practice of making your site easy for AI engines like ChatGPT, Claude, Gemini and Perplexity to understand and cite. Traditional SEO optimizes for blue-link rankings; GEO optimizes for being the answer the AI gives." },
  { q: "Is GeoPageScan really free?", a: "Yes. Enter any URL — no login, no credit card. You get a full scored report across six categories with prioritized, actionable fixes." },
  { q: "What is an llms.txt file?", a: "llms.txt is a simple markdown file at your domain root that gives AI assistants a clean, structured summary of your entity, services and key pages. It's one of the highest-impact, lowest-effort GEO improvements you can make." },
  { q: "Which AI crawlers does the audit check for?", a: "We check robots.txt access for the major AI user-agents including GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot and Google-Extended, plus whether you allow them to cite you." },
  { q: "How long does a scan take?", a: "Most scans complete in a few seconds. Complex sites audited with the AI engine can take up to 60–90 seconds for the deepest analysis." },
  { q: "Will this work for non-English or local businesses?", a: "Absolutely. The audit flags multilingual gaps (like missing hreflang) and checks LocalBusiness signals that matter for local AI queries." },
];

const BLOG_PREVIEW = [
  { e: "🧭", tag: "GEO", t: "The Complete Guide to Generative Engine Optimization (GEO) in 2026", x: "Everything you need to get cited by AI engines — from entity clarity to llms.txt.", d: "May 2026", r: "12 min", h: "geo-guide" },
  { e: "👻", tag: "GEO", t: "Why 94% of Websites Are Invisible to AI (And the Simple Fix)", x: "The single file and three schema types that move the needle most.", d: "May 2026", r: "7 min", h: "invisible-to-ai" },
  { e: "📑", tag: "AEO", t: "llms.txt: The Complete Guide — What It Is, Why It Matters", x: "A copy-paste template and the exact sections AI engines look for.", d: "May 2026", r: "9 min", h: "llms-txt-guide" },
];

/* ── scoring helpers ──────────────────────────────────────────────────── */
const scoreColor = (s) => (s >= 70 ? "#10B981" : s >= 40 ? "#F59E0B" : "#EF4444");
const scoreLabel = (s) => (s >= 70 ? "Good foundation" : s >= 40 ? "Needs improvement" : "Significant gaps");
const PRIORITY = {
  critical: { c: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  high: { c: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  medium: { c: "#00E5FF", bg: "rgba(0,229,255,0.12)" },
  low: { c: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
};
const EFFORT = {
  easy: { c: "#10B981", bg: "rgba(16,185,129,0.12)" },
  medium: { c: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  hard: { c: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

/* ── scroll reveal hook ───────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ── score ring ───────────────────────────────────────────────────────── */
function Ring({ score, size, stroke, mini = false }) {
  const dim = mini ? 72 : size || 170;
  const sw = mini ? 6 : stroke || 11;
  const r = (dim - sw) / 2;
  const c = 2 * Math.PI * r;
  const col = scoreColor(score);
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((score / 100) * c), 120);
    return () => clearTimeout(t);
  }, [score, c]);
  return (
    <div className={mini ? "mini-ring" : "ring"} style={mini ? {} : { width: dim, height: dim }}>
      <svg width={dim} height={dim}>
        <circle cx={dim / 2} cy={dim / 2} r={r} stroke="#1e293b" strokeWidth={sw} fill="none" />
        <circle cx={dim / 2} cy={dim / 2} r={r} stroke={col} strokeWidth={sw} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - dash}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)", filter: `drop-shadow(0 0 6px ${col}66)` }} />
      </svg>
      {mini ? (
        <div className="mini-num" style={{ color: col }}>{score}</div>
      ) : (
        <div className="ring-num"><b style={{ color: col }}>{score}</b><small>/ 100</small></div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REPORT
   ═══════════════════════════════════════════════════════════════════════ */
function Report({ data }) {
  const [active, setActive] = useState(data.categories[0]?.id);
  const cat = data.categories.find((c) => c.id === active) || data.categories[0];
  const breakdown = [
    ["Content Clarity", data.scoreBreakdown.contentClarity],
    ["Structured Data", data.scoreBreakdown.structuredData],
    ["AI Crawlability", data.scoreBreakdown.aiCrawlability],
    ["Authority Signals", data.scoreBreakdown.authoritySignals],
    ["llms.txt", data.scoreBreakdown.llmsTxt],
  ];

  return (
    <div className="report" id="report">
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <span className="eyebrow">AI Visibility Report</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, margin: "12px 0 6px", letterSpacing: "-0.02em" }}>{data.siteName}</h2>
        <p style={{ color: "var(--text-2)", maxWidth: 620, margin: "0 auto" }}>{data.siteDescription}</p>
      </div>

      <div className="report-top">
        <div className="glass score-ring-wrap">
          <Ring score={data.overallScore} />
          <div>
            <div className="score-label" style={{ color: scoreColor(data.overallScore) }}>{scoreLabel(data.overallScore)}</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              Engine: {data.engine === "claude" ? "Claude AI" : "heuristic"}
            </div>
          </div>
        </div>

        <div className="glass breakdown">
          <h4>Score Breakdown</h4>
          {breakdown.map(([label, val]) => (
            <div className="bar-row" key={label}>
              <div className="bar-top"><span>{label}</span><b style={{ color: scoreColor(val) }}>{val}</b></div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${val}%`, background: scoreColor(val) }} /></div>
            </div>
          ))}
        </div>
      </div>

      {data.quickWins?.length > 0 && (
        <div className="glass quickwins">
          <h4><Ic.bolt style={{ color: "var(--cyan)" }} /> Quick Wins — start here</h4>
          <ul>
            {data.quickWins.map((w, i) => (
              <li key={i}><span className="qn">{String(i + 1).padStart(2, "0")}</span><span>{w}</span></li>
            ))}
          </ul>
        </div>
      )}

      <div className="report-body">
        <div className="cat-nav">
          {data.categories.map((c) => {
            const I = Ic[c.id] || Ic.content;
            return (
              <button key={c.id} className={"cat-btn" + (c.id === active ? " active" : "")} onClick={() => setActive(c.id)}>
                <span className="ci"><I /></span>
                <span className="cmeta">
                  <div className="ct">{c.title}</div>
                  <div className="cs">{c.items.length} {c.items.length === 1 ? "finding" : "findings"}</div>
                </span>
                <span className="cscore" style={{ color: scoreColor(c.score) }}>{c.score}</span>
              </button>
            );
          })}
        </div>

        <div className="glass detail">
          <div className="detail-head">
            <Ring score={cat.score} mini />
            <div>
              <h3>{cat.title}</h3>
              <span className="priority-badge" style={{ color: PRIORITY[cat.priority]?.c, background: PRIORITY[cat.priority]?.bg }}>
                {cat.priority} priority
              </span>
            </div>
          </div>
          <p className="detail-summary">{cat.summary}</p>

          {cat.items.map((it, i) => (
            <div className="issue" key={i}>
              <div className="issue-top">
                <h4>{it.issue}</h4>
                <span className="effort" style={{ color: EFFORT[it.effort]?.c, background: EFFORT[it.effort]?.bg }}>{it.effort}</span>
              </div>
              <p className="imp">{it.impact}</p>
              <div className="fix"><b>Fix</b><span className="fix-txt">{it.fix}</span></div>
            </div>
          ))}
        </div>
      </div>

      {data.topRecommendation && (
        <div className="glass quickwins" style={{ marginTop: 24, borderColor: "var(--border-hover)" }}>
          <h4><Ic.arrow style={{ color: "var(--cyan)" }} /> Top Recommendation</h4>
          <p style={{ fontSize: 15.5, color: "var(--text)" }}>{data.topRecommendation}</p>
        </div>
      )}

      {data.meta && (
        <div className="report-meta">
          <span>scanned {new Date(data.meta.scannedAt).toLocaleString()}</span>
          <span>{data.meta.durationMs} ms</span>
          <span>{data.meta.signals.jsonLdCount} JSON-LD blocks</span>
          <span>llms.txt: {data.meta.signals.llmsTxt ? "found" : "missing"}</span>
          <span>{data.meta.signals.wordCount} words scanned</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO + AUDIT ENGINE
   ═══════════════════════════════════════════════════════════════════════ */
const LOADING_STEPS = ["Scraping website…", "Checking llms.txt & robots.txt…", "Analyzing with AI…", "Scoring GEO / AEO / SEO signals…", "Compiling your report…"];

function Hero() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const reportRef = useRef(null);

  const runAudit = useCallback(async (e) => {
    e?.preventDefault();
    const target = url.trim();
    if (!target) { setError("Please enter a website URL."); setStatus("error"); return; }
    setStatus("loading"); setError(""); setResult(null); setStep(0);

    const ticker = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 1400);
    try {
      const res = await fetch(`${API}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
      setResult(json);
      setStatus("done");
      // GA4: record each completed scan (the tool's core conversion)
      window.gtag?.("event", "scan_complete", { target_url: target, overall_score: json.overallScore, engine: json.engine });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try another URL.");
      setStatus("error");
    } finally {
      clearInterval(ticker);
    }
  }, [url]);

  return (
    <>
    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline poster="/hero-poster.jpg" aria-hidden="true">
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-grid" />
      <div className="blob blob-1" /><div className="blob blob-2" />
      <div className="scan-rings"><span /><span /><span /><span /></div>
      <div className="hero-overlay" />

      <div className="container hero-inner">
        <span className="eyebrow"><span className="dot-ok" /> Free · No login · GEO · AEO · SEO</span>
        <h1>Is your website <span className="gradient-text">visible to AI?</span></h1>
        <p className="hero-sub">
          Scan any site for its AI-visibility score across six GEO, AEO and SEO categories —
          and get prioritized, copy-ready fixes to get cited by ChatGPT, Claude, Gemini and Perplexity.
        </p>

        <form className="audit-form" onSubmit={runAudit}>
          <div className="field">
            <Ic.search />
            <input
              type="text" inputMode="url" autoComplete="url" aria-label="Website URL"
              placeholder="yourwebsite.com" value={url}
              onChange={(e) => setUrl(e.target.value)} disabled={status === "loading"}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Scanning…" : (<>Scan now <Ic.arrow /></>)}
          </button>
        </form>
        <div className="hero-hint">
          <span><span className="dot-ok" /> Results in seconds</span>
          <span>·</span>
          <span>Try: stripe.com, github.com, your-site.com</span>
        </div>

        {status !== "done" && (
          <div className="hero-stats">
            {[["40–70%", "of searches get AI answers"], ["94%", "of sites score below 40/100"], ["6", "audit categories"], ["0$", "always free to scan"]].map(([n, l]) => (
              <div className="glass stat" key={l}><div className="num gradient-text">{n}</div><div className="lbl">{l}</div></div>
            ))}
          </div>
        )}
      </div>
    </section>

    {status !== "idle" && (
      <section className="results" ref={reportRef}>
        <div className="container">
          {status === "loading" && (
            <div className="loading-box">
              <div className="hexspin"><Ic.hex /></div>
              <div className="loading-step">{LOADING_STEPS[step]}</div>
              <div className="loading-bar"><i /></div>
            </div>
          )}
          {status === "error" && (
            <div className="error-box"><Ic.alert /><div><b>Audit failed.</b>{"\n"}{error}</div></div>
          )}
          {status === "done" && result && <Report data={result} />}
        </div>
      </section>
    )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MARKETING SECTIONS
   ═══════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["Why", "#why"], ["How it works", "#how"], ["Features", "#features"], ["FAQ", "#faq"], ["Blog", "/blog.html"]];
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="container nav-inner">
        <a href="#top" className="brand">
          <Logo />
          <div><div className="brand-name">GeoPageScan</div><div className="brand-sub">AI Visibility Scanner</div></div>
        </a>
        <div className="nav-links">
          {links.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
        </div>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="/blog.html">Read the blog</a>
          <a className="btn btn-primary nav-scan" href="#top" aria-label="Scan a site">
            <Ic.search className="nav-scan-ico" />
            <span className="nav-scan-txt">Scan a site</span>
            <Ic.arrow className="nav-scan-arrow" />
          </a>
          <button className="hamburger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a className="btn btn-primary" href="#top" onClick={() => setOpen(false)}>Scan a site <Ic.arrow /></a>
        </div>
      )}
    </nav>
  );
}

function Why() {
  return (
    <section className="section section-alt" id="why">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">The shift</span>
          <h2>Search changed. Did your site?</h2>
          <p>AI engines now answer questions directly — and they choose which sites to cite. Here's why AI visibility is the new battleground.</p>
        </div>
        <div className="grid grid-4">
          {WHY.map((w, i) => (
            <div className="card reveal" key={w.title} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="feature-icon"><Ic.bolt /></div>
              <h3>{w.title}</h3><p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>From URL to action plan in seconds</h2>
          <p>No setup. No account. Just paste a link and get a prioritized roadmap.</p>
        </div>
        <div className="grid grid-4">
          {STEPS.map((s, i) => (
            <div className="card step-card reveal" key={s.n} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="step-num">{s.n}</div>
              <h3>{s.t}</h3><p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section section-alt" id="features">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">What we audit</span>
          <h2>Six categories. One visibility score.</h2>
          <p>Every scan grades your site across the signals that decide whether AI engines understand, trust and cite you.</p>
        </div>
        <div className="grid grid-3">
          {FEATURES.map((f, i) => {
            const I = Ic[f.id];
            return (
              <div className="card reveal" key={f.id} style={{ transitionDelay: `${i * 50}ms` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="feature-icon"><I /></div>
                  <span className="tag">{f.tag}</span>
                </div>
                <h3>{f.title}</h3><p>{f.desc}</p>
                <ul className="bullet-list">
                  {f.bullets.map((b) => <li key={b}><Ic.check />{b}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Loved by operators</span>
          <h2>Teams use it to win the AI answer</h2>
        </div>
        <div className="grid grid-3">
          {TESTIMONIALS.map((t, i) => (
            <div className="card reveal" key={t.n} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="stars">{Array.from({ length: 5 }).map((_, k) => <Ic.star key={k} />)}</div>
              <p className="quote">"{t.q}"</p>
              <div className="person"><div className="avatar">{t.a}</div><div><div className="pn">{t.n}</div><div className="pr">{t.r}</div></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section section-alt" id="faq">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="section-head reveal">
          <span className="eyebrow">FAQ</span>
          <h2>Questions, answered</h2>
        </div>
        <div className="reveal">
          {FAQS.map((f, i) => (
            <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
              <button className="faq-q" aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(open === i ? -1 : i); } }}>
                {f.q}<span className="chev"><Ic.chevron /></span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  return (
    <section className="section" id="blog">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">From the blog</span>
          <h2>Learn GEO, AEO &amp; AI search</h2>
          <p>Playbooks and guides to get your site cited by AI engines.</p>
        </div>
        <div className="grid grid-3">
          {BLOG_PREVIEW.map((b, i) => (
            <a className="card blog-card reveal" key={b.h} href={`/blog/${b.h}.html`} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="blog-thumb" aria-hidden="true">{b.e}</div>
              <span className="tag" style={{ marginBottom: 12, alignSelf: "flex-start" }}>{b.tag}</span>
              <h3>{b.t}</h3><p>{b.x}</p>
              <div className="meta"><span>{b.d}</span><span>{b.r} read</span></div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a className="btn btn-ghost" href="/blog.html">View all 15 articles <Ic.arrow /></a>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-wrap glass reveal">
          <div className="cta-glow" />
          <span className="eyebrow">Find out in 10 seconds</span>
          <h2>How visible is <span className="gradient-text">your</span> site to AI?</h2>
          <p>Run a free scan and see exactly what to fix to get cited by the engines answering your customers' questions.</p>
          <div className="cta-btns">
            <a className="btn btn-primary" href="#top">Scan my website <Ic.arrow /></a>
            <a className="btn btn-ghost" href="/blog.html">Read the GEO guide</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ["Product", [["Audit tool", "#top"], ["Features", "#features"], ["How it works", "#how"], ["FAQ", "#faq"]]],
    ["Learn", [["Blog", "/blog.html"], ["GEO guide", "/blog/geo-guide.html"], ["llms.txt guide", "/blog/llms-txt-guide.html"], ["What is AEO?", "/blog/aeo-guide.html"]]],
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#top" className="brand"><Logo /><div><div className="brand-name">GeoPageScan</div><div className="brand-sub">AI Visibility Scanner</div></div></a>
            <p>The free AI-visibility audit tool for the generative search era. Scan any site for GEO, AEO and SEO readiness.</p>
          </div>
          {cols.map(([h, links]) => (
            <div className="footer-col" key={h}>
              <h5>{h}</h5>
              {links.map(([l, href]) => <a key={l} href={href}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 GeoPageScan · geopagescan.com</span>
          <div className="links">
            <a href="/blog.html">Blog</a>
            <a href="mailto:hello@geopagescan.com">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  useReveal();
  // remove the static SEO first-paint fallback once the interactive app mounts
  useEffect(() => {
    document.getElementById("ssr-fallback")?.remove();
    document.getElementById("ssr-style")?.remove();
  }, []);
  return (
    <>
      <Nav />
      <Hero />
      <Why />
      <How />
      <Features />
      <Testimonials />
      <FAQ />
      <BlogPreview />
      <CTA />
      <Footer />
    </>
  );
}
