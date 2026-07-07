// ─────────────────────────────────────────────────────────────────────────
//  GeoPageScan Blog generator
//  Emits, into frontend/public:
//    • blog.html                     — index (cards + FAQ + FAQPage schema)
//    • blog/<id>.html                — one fully SEO/GEO/AEO page per post
//    • blog-img/<id>.svg             — branded cover art (also the OG image)
//    • blog-assets.css               — shared stylesheet (header/footer/article)
//  Run:  node frontend/blog/generate.mjs
// ─────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ARTICLES, CATS, CAT_GRAD, SITE } from "./articles.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escText = (s = "") => String(s).replace(/<[^>]+>/g, ""); // strip tags for meta/schema
const fmtDate = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
let LOOKUP = Object.fromEntries(ARTICLES.map((a) => [a.id, a]));

/* ── shared chrome ──────────────────────────────────────────────────────── */
function header() {
  const links = [["Why", "/#why"], ["How it works", "/#how"], ["Features", "/#features"], ["FAQ", "/#faq"], ["Blog", "/blog.html"]];
  return `<nav class="nav"><div class="container nav-inner">
    <a href="/" class="brand">
      <img src="/logo.svg" width="36" height="36" alt="GeoPageScan logo" />
      <div><div class="brand-name">GeoPageScan</div><div class="brand-sub">AI Visibility Scanner</div></div>
    </a>
    <div class="nav-links">${links.map(([l, h]) => `<a href="${h}">${l}</a>`).join("")}</div>
    <div class="nav-cta">
      <a class="btn btn-ghost" href="/blog.html">Blog</a>
      <a class="btn btn-primary nav-scan" href="/" aria-label="Scan a site">
        <svg class="nav-scan-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="nav-scan-txt">Scan a site →</span>
      </a>
    </div>
  </div></nav>`;
}

function footer() {
  const cols = [
    ["Product", [["Audit tool", "/#top"], ["Features", "/#features"], ["How it works", "/#how"], ["FAQ", "/#faq"]]],
    ["Learn", [["Blog", "/blog.html"], ["GEO guide", "/blog/geo-guide.html"], ["llms.txt guide", "/blog/llms-txt-guide.html"], ["What is AEO?", "/blog/aeo-guide.html"]]],
  ];
  return `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="brand"><img src="/logo.svg" width="36" height="36" alt="GeoPageScan logo" /><div><div class="brand-name">GeoPageScan</div><div class="brand-sub">AI Visibility Scanner</div></div></a>
        <p>The free AI-visibility audit tool for the generative search era. Scan any site for GEO, AEO and SEO readiness.</p>
      </div>
      ${cols.map(([h, ls]) => `<div class="footer-col"><h5>${h}</h5>${ls.map(([l, href]) => `<a href="${href}">${l}</a>`).join("")}</div>`).join("")}
    </div>
    <div class="footer-bottom">
      <span>© 2026 GeoPageScan · geopagescan.com</span>
      <div class="links"><a href="/blog.html">Blog</a><a href="mailto:hello@geopagescan.com">Contact</a></div>
    </div>
  </div></footer>`;
}

const fontsHead = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T7258HE2G8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T7258HE2G8');
</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<link rel="stylesheet" href="/blog-assets.css" />`;

/* ── SVG cover art (also used as the OG image) ──────────────────────────── */
function svgCover(a) {
  const [c1, c2] = CAT_GRAD[a.cat] || CAT_GRAD.GEO;
  // word-wrap the title into <=3 lines
  const words = a.title.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 26) { lines.push(cur.trim()); cur = w; } else cur += " " + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  const top = lines.slice(0, 3);
  const tspans = top.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 64}">${esc(l)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(a.title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#030712"/><stop offset="1" stop-color="#0a0f1e"/>
    </linearGradient>
    <linearGradient id="ac" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.7"><stop offset="0" stop-color="${c1}" stop-opacity="0.35"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g stroke="${c1}" stroke-opacity="0.08" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`).join("")}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}"/>`).join("")}
  </g>
  <circle cx="1000" cy="150" r="120" fill="none" stroke="url(#ac)" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="1000" cy="150" r="70" fill="none" stroke="url(#ac)" stroke-width="2" stroke-opacity="0.8"/>
  <text x="1000" y="170" font-size="90" text-anchor="middle">${a.emoji}</text>
  <rect x="80" y="120" width="${50 + a.cat.length * 17}" height="40" rx="8" fill="none" stroke="url(#ac)" stroke-width="1.5"/>
  <text x="100" y="147" font-family="JetBrains Mono, monospace" font-size="20" font-weight="700" fill="${c1}" letter-spacing="3">${esc(a.cat.toUpperCase())}</text>
  <text x="80" y="300" font-family="Outfit, sans-serif" font-size="52" font-weight="800" fill="#f1f5f9">${tspans}</text>
  <text x="80" y="560" font-family="JetBrains Mono, monospace" font-size="22" fill="#8c99b0">geopagescan.com</text>
  <text x="80" y="592" font-family="JetBrains Mono, monospace" font-size="18" fill="#475569">${a.read} read · ${fmtDate(a.date).toUpperCase()}</text>
</svg>`;
}

/* ── article body rendering ─────────────────────────────────────────────── */
function renderSections(a) {
  return a.sections.map((s) => {
    let html = `<h2>${esc(s.h)}</h2>`;
    if (s.p) html += s.p.map((p) => `<p>${p}</p>`).join("");
    if (s.img) html += `<figure class="post-figure"><img src="${esc(s.img.src)}" alt="${esc(s.img.alt || "")}" loading="lazy" />${s.img.caption ? `<figcaption>${esc(s.img.caption)}</figcaption>` : ""}</figure>`;
    if (s.code) html += `<pre><code>${esc(s.code)}</code></pre>`;
    if (s.list) html += `<ul>${s.list.map((li) => `<li>${li}</li>`).join("")}</ul>`;
    return html;
  }).join("");
}

function renderComparison(c) {
  if (!c) return "";
  return `<div class="cmp"><h3>${esc(c.title)}</h3><div class="cmp-scroll"><table>
    <thead><tr>${c.cols.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${c.rows.map((r) => `<tr>${r.map((cell, i) => `<td${i === 0 ? ' class="lead"' : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div></div>`;
}

function renderFaq(a) {
  return `<section class="post-faq"><h2>Frequently asked questions</h2>
    ${a.faq.map((f) => `<details class="faq-item"><summary>${esc(f.q)}<span class="chev">⌄</span></summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}
  </section>`;
}

function renderRelated(a) {
  const rel = (a.related || []).map((id) => LOOKUP[id]).filter(Boolean).slice(0, 3);
  if (!rel.length) return "";
  return `<section class="related"><h2>Keep reading</h2><div class="rel-grid">
    ${rel.map((r) => `<a class="rel-card" href="/blog/${r.id}.html"><img src="/blog-img/${r.id}.svg" alt="${esc(r.title)}" loading="lazy" /><span class="tag">${r.cat}</span><h3>${esc(r.title)}</h3></a>`).join("")}
  </div></section>`;
}

/* ── per-post page ──────────────────────────────────────────────────────── */
function articlePage(a) {
  const url = `${SITE.url}/blog/${a.id}.html`;
  const img = `${SITE.url}/blog-img/${a.id}.svg`;
  const desc = escText(a.dek);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: a.title, description: desc, image: img,
    datePublished: a.date, dateModified: a.date,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/logo.svg` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: a.keywords, articleSection: a.cat,
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: a.faq.map((f) => ({ "@type": "Question", name: escText(f.q), acceptedAnswer: { "@type": "Answer", text: escText(f.a) } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: SITE.url + "/blog.html" },
      { "@type": "ListItem", position: 3, name: a.title, item: url },
    ],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(a.title)} | GeoPageScan</title>
<meta name="description" content="${esc(desc)}" />
<meta name="keywords" content="${esc(a.keywords)}" />
<meta name="author" content="GeoPageScan" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${url}" />
<meta name="llms-txt" content="${SITE.url}/llms.txt" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(a.title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${img}" />
<meta property="og:site_name" content="GeoPageScan" />
<meta property="article:published_time" content="${a.date}" />
<meta property="article:section" content="${a.cat}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${SITE.twitter}" />
<meta name="twitter:title" content="${esc(a.title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${img}" />
${fontsHead}
<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>
${header()}
<main class="article-wrap">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/blog.html">Blog</a> <span>/</span> <span class="current">${esc(a.cat)}</span></nav>
    <article class="post">
      <header class="post-head">
        <span class="tag">${a.cat}</span>
        <h1>${esc(a.title)}</h1>
        <p class="dek">${esc(a.dek)}</p>
        <div class="byline"><span>By <strong>GeoPageScan</strong></span><span>·</span><span>${fmtDate(a.date)}</span><span>·</span><span>${a.read} read</span></div>
      </header>
      <img class="cover" src="/blog-img/${a.id}.svg" alt="${esc(a.title)}" width="1200" height="630" />
      <div class="post-body">
        ${renderSections(a)}
        ${renderComparison(a.comparison)}
      </div>
      ${renderFaq(a)}
      <aside class="post-cta">
        <h3>How visible is your site to AI?</h3>
        <p>Run a free GeoPageScan audit and get prioritized fixes across six GEO/AEO/SEO categories.</p>
        <a class="btn btn-primary" href="/">Scan my website →</a>
      </aside>
      ${renderRelated(a)}
    </article>
  </div>
</main>
${footer()}
</body>
</html>`;
}

/* ── blog index ─────────────────────────────────────────────────────────── */
const INDEX_FAQ = [
  { q: "What is GeoPageScan's blog about?", a: "Playbooks and guides on GEO (Generative Engine Optimization), AEO (Answer Engine Optimization) and the technical SEO signals that make AI engines understand and cite your website." },
  { q: "What is the difference between GEO, AEO and SEO?", a: "SEO optimizes for ranking in a list of links. AEO optimizes for being the single direct answer, including voice. GEO optimizes for being understood and cited by generative AI engines like ChatGPT, Claude, Gemini and Perplexity." },
  { q: "How do I get my website cited by AI?", a: "Publish an llms.txt, add Organization and FAQPage schema, allow AI crawlers in robots.txt, and write answer-first, factual content. Run a free GeoPageScan audit to see exactly what to fix." },
  { q: "Is GeoPageScan free to use?", a: "Yes. Enter any URL with no login or credit card and get a full scored AI-visibility report with prioritized, copy-ready fixes." },
  { q: "How often should I re-audit my site?", a: "Re-scan after each fix to measure the lift, and run a fresh audit monthly — the AI search landscape and crawler list evolve quickly." },
];

function indexPage(articles) {
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: INDEX_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const blogSchema = {
    "@context": "https://schema.org", "@type": "Blog", name: "GeoPageScan Blog", url: SITE.url + "/blog.html",
    description: "Guides on GEO, AEO, llms.txt, schema and getting cited by AI search engines.",
    blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${SITE.url}/blog/${a.id}.html`, datePublished: a.date, image: `${SITE.url}/blog-img/${a.id}.svg` })),
  };
  const cards = articles.map((a) => `<a class="post-card" data-cat="${a.cat}" href="/blog/${a.id}.html">
      <div class="card-cover"><img src="/blog-img/${a.id}.svg" alt="${esc(a.title)}" loading="lazy" width="1200" height="630" /></div>
      <span class="tag">${a.cat}</span>
      <h2>${esc(a.title)}</h2>
      <p>${esc(a.dek)}</p>
      <div class="meta"><span>${fmtDate(a.date)}</span><span>${a.read} read</span></div>
    </a>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GeoPageScan Blog — GEO, AEO &amp; AI Search Strategy</title>
<meta name="description" content="Guides and playbooks on Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), llms.txt, schema markup and getting cited by AI search engines." />
<meta name="keywords" content="GEO, AEO, AI search, llms.txt, schema, generative engine optimization, answer engine optimization" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${SITE.url}/blog.html" />
<meta name="llms-txt" content="${SITE.url}/llms.txt" />
<meta property="og:type" content="website" />
<meta property="og:title" content="GeoPageScan Blog — GEO, AEO &amp; AI Search" />
<meta property="og:description" content="Guides on GEO, AEO, llms.txt and getting cited by AI search engines." />
<meta property="og:url" content="${SITE.url}/blog.html" />
<meta property="og:image" content="${SITE.url}/blog-img/geo-guide.svg" />
<meta name="twitter:card" content="summary_large_image" />
${fontsHead}
<script type="application/ld+json">${JSON.stringify(blogSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
${header()}
<header class="blog-hero"><div class="container">
  <span class="eyebrow">The GeoPageScan Blog</span>
  <h1>Get cited by <span class="gradient-text">AI search</span></h1>
  <p>Playbooks and guides on GEO, AEO, llms.txt and the structured signals that make AI engines understand and recommend your site.</p>
</div></header>
<main class="container">
  <div class="filters" id="filters">${CATS.map((c, i) => `<button class="filter${i === 0 ? " active" : ""}" data-cat="${c}">${c}</button>`).join("")}</div>
  <div class="post-grid" id="grid">${cards}</div>

  <section class="index-faq" id="faq">
    <div class="section-head"><span class="eyebrow">FAQ</span><h2>GEO &amp; AEO, answered</h2></div>
    ${INDEX_FAQ.map((f) => `<details class="faq-item"><summary>${esc(f.q)}<span class="chev">⌄</span></summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}
  </section>
</main>
${footer()}
<script>
  const grid=document.getElementById('grid');
  document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const c=b.dataset.cat;
    grid.querySelectorAll('.post-card').forEach(card=>{
      card.style.display=(c==='All'||card.dataset.cat===c)?'':'none';
    });
  });
</script>
</body>
</html>`;
}

/* ── shared CSS ─────────────────────────────────────────────────────────── */
const CSS = `:root{--cyan:#00e5ff;--violet:#7c3aed;--violet-light:#a78bfa;--bg:#030712;--bg-2:#0a0f1e;--bg-3:#0f172a;--border-dark:#1e293b;--text:#f1f5f9;--text-2:#94a3b8;--text-muted:#475569;--green:#10b981;--yellow:#f59e0b;--red:#ef4444;--border:rgba(124,58,237,.2);--border-hover:rgba(0,229,255,.15);--grad:linear-gradient(135deg,#00e5ff,#7c3aed);--grad-soft:linear-gradient(135deg,rgba(0,229,255,.12),rgba(124,58,237,.12));--font:"Outfit",system-ui,sans-serif;--mono:"JetBrains Mono",monospace}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
img{max-width:100%;display:block}
::selection{background:rgba(0,229,255,.3);color:#fff}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border-dark);border-radius:8px}
.container{max-width:1180px;margin:0 auto;padding:0 24px}
.gradient-text{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);font-weight:600}
.tag{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.08em;padding:4px 9px;border-radius:6px;text-transform:uppercase;border:1px solid var(--border);color:var(--violet-light);display:inline-block}
/* nav */
.nav{position:sticky;top:0;z-index:50;background:rgba(3,7,18,.82);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border-dark)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:72px}
.brand{display:flex;align-items:center;gap:11px}
.brand-name{font-weight:800;font-size:19px;letter-spacing:-.01em}.brand-sub{font-family:var(--mono);font-size:9px;letter-spacing:.2em;color:#8c99b0;text-transform:uppercase}
.nav-links{display:flex;align-items:center;gap:28px}.nav-links a{color:var(--text-2);font-size:15px;font-weight:500;transition:color .2s}.nav-links a:hover{color:var(--text)}
.nav-cta{display:flex;align-items:center;gap:12px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:0 20px;height:44px;border-radius:11px;font-weight:600;font-size:14.5px;transition:transform .2s,box-shadow .25s,border-color .25s,background .25s}
.btn-primary{background:var(--grad);color:#05080f;box-shadow:0 8px 24px -8px rgba(0,229,255,.5)}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 34px -8px rgba(0,229,255,.65)}
.btn-ghost{background:rgba(255,255,255,.03);color:var(--text);border:1px solid var(--border)}.btn-ghost:hover{border-color:var(--border-hover);background:rgba(0,229,255,.06)}
/* blog hero */
.blog-hero{padding:80px 0 30px;text-align:center;position:relative;overflow:hidden}
.blog-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(700px 320px at 50% -20%,rgba(124,58,237,.22),transparent 60%);z-index:-1}
.blog-hero h1{font-size:clamp(34px,5.5vw,58px);font-weight:900;letter-spacing:-.03em;margin:16px 0 14px}
.blog-hero p{color:var(--text-2);font-size:18px;max-width:600px;margin:0 auto}
/* filters */
.filters{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:34px 0 44px}
.filter{padding:9px 18px;border-radius:10px;border:1px solid var(--border-dark);color:var(--text-2);font-size:14px;font-weight:500;font-family:var(--mono);transition:.2s}
.filter:hover{border-color:var(--border-hover);color:var(--text)}.filter.active{background:var(--grad);color:#05080f;border-color:transparent}
/* index grid */
.post-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:24px;padding-bottom:40px}
.post-card{background:linear-gradient(180deg,rgba(15,23,42,.6),rgba(10,15,30,.5));border:1px solid var(--border-dark);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s,border-color .25s,box-shadow .25s}
.post-card:hover{transform:translateY(-6px);border-color:rgba(0,229,255,.55);box-shadow:0 24px 60px -20px rgba(0,0,0,.7),0 0 0 1px rgba(0,229,255,.18),0 14px 50px -14px rgba(0,229,255,.3)}
.card-cover{aspect-ratio:1200/630;overflow:hidden;border-bottom:1px solid var(--border-dark)}
.card-cover img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.post-card:hover .card-cover img{transform:scale(1.04)}
.post-card .tag{margin:18px 22px 0}
.post-card h2{font-size:19px;font-weight:700;line-height:1.3;margin:12px 22px 8px;letter-spacing:-.01em}
.post-card p{color:var(--text-2);font-size:14.5px;margin:0 22px;flex:1}
.post-card .meta{margin:16px 22px 20px;padding-top:14px;border-top:1px solid var(--border-dark);font-family:var(--mono);font-size:12px;color:var(--text-muted);display:flex;gap:14px}
/* index faq */
.index-faq{max-width:820px;margin:30px auto 90px}
.section-head{text-align:center;margin-bottom:30px}.section-head h2{font-size:clamp(26px,4vw,38px);font-weight:800;margin-top:12px;letter-spacing:-.02em}
/* faq accordion (details) */
.faq-item{border:1px solid var(--border-dark);border-radius:12px;margin-bottom:12px;background:rgba(15,23,42,.4);overflow:hidden;transition:border-color .2s}
.faq-item[open]{border-color:var(--border-hover)}
.faq-item summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 22px;font-size:16px;font-weight:600;color:var(--text)}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item .chev{color:var(--cyan);font-size:20px;transition:transform .25s}.faq-item[open] .chev{transform:rotate(180deg)}
.faq-a{padding:0 22px 20px;color:var(--text-2);font-size:14.5px}
/* article */
.article-wrap{padding:36px 0 20px}
.breadcrumb{font-family:var(--mono);font-size:12.5px;color:var(--text-muted);margin-bottom:26px;display:flex;gap:10px;align-items:center}
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--cyan)}.breadcrumb .current{color:var(--cyan)}
.post{max-width:760px;margin:0 auto}
.post-head .tag{margin-bottom:16px}
.post-head h1{font-size:clamp(28px,4.6vw,46px);font-weight:800;letter-spacing:-.025em;line-height:1.12;margin-bottom:16px}
.post-head .dek{font-size:19px;color:var(--text-2);margin-bottom:18px;line-height:1.55}
.byline{font-family:var(--mono);font-size:13px;color:var(--text-muted);display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:28px}
.cover{width:100%;border-radius:16px;border:1px solid var(--border);margin-bottom:36px}
.post-body h2{font-size:26px;font-weight:700;letter-spacing:-.01em;margin:38px 0 14px;scroll-margin-top:90px}
.post-body p{color:var(--text-2);font-size:17px;margin-bottom:16px}
.post-body ul{color:var(--text-2);font-size:17px;margin:0 0 16px 4px;list-style:none;display:grid;gap:10px}
.post-body ul li{position:relative;padding-left:28px}
.post-body ul li::before{content:"";position:absolute;left:4px;top:11px;width:8px;height:8px;border-radius:2px;background:var(--grad)}
.post-body strong{color:var(--text)}
.post-body a{color:var(--cyan);text-decoration:underline;text-decoration-color:rgba(0,229,255,.45);text-underline-offset:2px;font-weight:500;transition:color .2s}
.post-body a:hover{color:#5ff0ff;text-decoration-color:var(--cyan)}
.post-body code{font-family:var(--mono);font-size:14px;background:var(--bg-3);border:1px solid var(--border-dark);border-radius:6px;padding:2px 7px;color:var(--cyan)}
.post-body pre{background:var(--bg-3);border:1px solid var(--border-dark);border-radius:12px;padding:20px;overflow-x:auto;margin:8px 0 18px}
.post-body pre code{background:none;border:none;padding:0;color:var(--text-2);font-size:13.5px;line-height:1.7;white-space:pre}
.post-figure{margin:26px 0;border:1px solid var(--border-dark);border-radius:14px;overflow:hidden;background:var(--bg-3)}
.post-figure img{width:100%;display:block}
.post-figure figcaption{padding:12px 16px;font-family:var(--mono);font-size:12.5px;color:var(--text-muted);border-top:1px solid var(--border-dark);text-align:center}
/* comparison */
.cmp{margin:34px 0}.cmp h3{font-size:20px;font-weight:700;margin-bottom:16px}
.cmp-scroll{overflow-x:auto;border:1px solid var(--border-dark);border-radius:14px}
.cmp table{width:100%;border-collapse:collapse;font-size:15px;min-width:480px}
.cmp th{background:var(--bg-3);color:var(--cyan);font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;text-align:left;padding:14px 18px;border-bottom:1px solid var(--border-dark)}
.cmp td{padding:14px 18px;border-bottom:1px solid var(--border-dark);color:var(--text-2)}
.cmp td.lead{color:var(--text);font-weight:600}
.cmp tr:last-child td{border-bottom:none}
/* post faq + cta + related */
.post-faq{max-width:760px;margin:48px auto 0}.post-faq h2{font-size:24px;font-weight:700;margin-bottom:18px}
.post-cta{max-width:760px;margin:44px auto 0;text-align:center;padding:40px 30px;border-radius:20px;background:var(--grad-soft);border:1px solid var(--border)}
.post-cta h3{font-size:24px;font-weight:800;margin-bottom:10px}.post-cta p{color:var(--text-2);margin-bottom:22px;max-width:480px;margin-left:auto;margin-right:auto}
.related{max-width:1180px;margin:64px auto 0}.related h2{font-size:22px;font-weight:700;margin-bottom:22px;text-align:center}
.rel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.rel-card{background:linear-gradient(180deg,rgba(15,23,42,.6),rgba(10,15,30,.5));border:1px solid var(--border-dark);border-radius:14px;overflow:hidden;transition:transform .25s,border-color .25s}
.rel-card:hover{transform:translateY(-5px);border-color:rgba(0,229,255,.5)}
.rel-card img{width:100%;aspect-ratio:1200/630;object-fit:cover;border-bottom:1px solid var(--border-dark)}
.rel-card .tag{margin:16px 18px 0}.rel-card h3{font-size:16px;font-weight:600;margin:10px 18px 18px;line-height:1.35}
/* footer */
.footer{border-top:1px solid var(--border-dark);padding:64px 0 30px;background:var(--bg-2);margin-top:80px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
.nav-scan-ico{display:none}
.footer-brand p{color:var(--text-2);font-size:14px;margin-top:16px;max-width:280px}
.footer-col h5{font-size:13px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:16px}
.footer-col a{display:block;color:var(--text-2);font-size:14.5px;padding:6px 0;transition:color .2s}.footer-col a:hover{color:var(--cyan)}
.footer-bottom{margin-top:48px;padding-top:24px;border-top:1px solid var(--border-dark);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--text-muted)}
.footer-bottom .links{display:flex;gap:20px}.footer-bottom .links a:hover{color:var(--cyan)}
@media(max-width:768px){.nav-links,.nav-cta .btn-ghost{display:none}.footer-grid{grid-template-columns:1fr 1fr;gap:32px}.post-body p,.post-body ul{font-size:16px}.nav-scan .nav-scan-txt{display:none}.nav-scan .nav-scan-ico{display:block}.nav-scan{width:46px;padding:0;gap:0}}
@media(max-width:480px){.footer-grid{grid-template-columns:1fr}.post-grid{grid-template-columns:1fr}}`;

/* ── build everything for a given article set (newest first) ─────────────── */
export async function generateBlog(articles) {
  const ordered = [...articles].sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
  LOOKUP = Object.fromEntries(articles.map((a) => [a.id, a]));

  await mkdir(join(PUBLIC, "blog"), { recursive: true });
  await mkdir(join(PUBLIC, "blog-img"), { recursive: true });

  await writeFile(join(PUBLIC, "blog-assets.css"), CSS, "utf8");
  await writeFile(join(PUBLIC, "blog.html"), indexPage(ordered), "utf8");

  for (const a of ordered) {
    await writeFile(join(PUBLIC, "blog-img", `${a.id}.svg`), svgCover(a), "utf8");
    await writeFile(join(PUBLIC, "blog", `${a.id}.html`), articlePage(a), "utf8");
  }

  // sitemap includes home, blog index and every post
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${SITE.url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `  <url><loc>${SITE.url}/blog.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n` +
    ordered.map((a) => `  <url><loc>${SITE.url}/blog/${a.id}.html</loc><lastmod>${a.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  await writeFile(join(PUBLIC, "sitemap.xml"), sitemap, "utf8");

  return ordered.length;
}

async function main() {
  const n = await generateBlog(ARTICLES);
  console.log(`✓ Generated blog index + ${n} post pages + covers + blog-assets.css + sitemap.xml`);
}

// run as a CLI only when invoked directly (so agent.mjs can import generateBlog)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
