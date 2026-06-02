// ─────────────────────────────────────────────────────────────────────────
//  GeoPageScan Blog — article source data
//  Consumed by generate.mjs to emit fully SEO/GEO/AEO-optimized static pages
//  (one real URL per post) + the blog index. Edit content here, then run:
//     node frontend/blog/generate.mjs
// ─────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "GeoPageScan",
  url: "https://geopagescan.com",
  twitter: "@geopagescan",
};

export const CATS = ["All", "GEO", "AEO", "SEO", "Tool"];

// gradient stops per category — used for the generated SVG cover art
export const CAT_GRAD = {
  GEO: ["#00E5FF", "#7C3AED"],
  AEO: ["#7C3AED", "#00E5FF"],
  SEO: ["#3B82F6", "#7C3AED"],
  Tool: ["#00E5FF", "#10B981"],
};

export const ARTICLES = [
  {
    id: "geo-guide", cat: "GEO", emoji: "🧭",
    title: "The Complete Guide to Generative Engine Optimization (GEO) in 2026",
    dek: "Everything you need to get cited by AI engines in 2026 — entity clarity, llms.txt, schema and the three pillars of GEO, explained with a concrete action plan.",
    date: "2026-05-28", read: "12 min",
    keywords: "GEO, generative engine optimization, AI visibility, get cited by ChatGPT, llms.txt, schema",
    sections: [
      { h: "What is Generative Engine Optimization?", p: [
        "Generative Engine Optimization (GEO) is the discipline of structuring your website so that generative AI engines — ChatGPT, Claude, Gemini, Perplexity and Google's AI Overviews — can understand what you are, trust you, and cite you in their answers.",
        "Where classic SEO competes for a blue link, GEO competes to <strong>be the answer</strong>. The unit of victory is a citation inside an AI-generated response, not a position in a list of ten links." ] },
      { h: "Why does GEO matter now?", p: [
        "Between 40% and 70% of searches now return an AI-generated answer, and a large share are zero-click — the user never visits a website. If the AI can't parse and trust your content, you are invisible to that entire surface.",
        "Today an estimated 94% of sites score below 40/100 for AI visibility. That gap is the opportunity: early movers get cited repeatedly while competitors stay invisible." ] },
      { h: "The three pillars of GEO", list: [
        "<strong>Entity clarity</strong> — the AI can state plainly what you are, who runs you and what you offer.",
        "<strong>Machine-readable structure</strong> — schema (JSON-LD), an llms.txt file, clean server-rendered HTML and FAQ blocks.",
        "<strong>Authority signals</strong> — named people, reviews with markup, and external profile links (LinkedIn, Wikidata, Crunchbase)." ],
        p: ["Nail all three and you become the kind of source an LLM is comfortable quoting — specific, structured and verifiable."] },
      { h: "Your first five GEO moves", p: [
        "Start with the highest-leverage, lowest-effort changes, then re-scan to measure the lift." ],
        list: [
        "Publish an <code>llms.txt</code> at your domain root.",
        "Add Organization + FAQPage JSON-LD.",
        "Explicitly allow AI crawlers in robots.txt.",
        "Rewrite hero copy as plain, factual, question-led content.",
        "Mark up reviews with AggregateRating." ] },
    ],
    comparison: {
      title: "GEO vs AEO vs SEO at a glance",
      cols: ["Discipline", "Optimizes for", "Primary signal"],
      rows: [
        ["SEO", "Blue-link rankings", "Keywords, links, crawlability"],
        ["AEO", "Direct answers & voice", "Q&A structure, FAQ schema, concise answers"],
        ["GEO", "Citations inside AI answers", "Entity clarity, llms.txt, structured trust signals"],
      ],
    },
    faq: [
      { q: "Is GEO the same as SEO?", a: "No. SEO optimizes for ranking in a list of links; GEO optimizes for being understood and cited by generative AI engines. They share a technical foundation but GEO adds entity clarity, llms.txt and structured trust signals." },
      { q: "What is the single highest-impact GEO change?", a: "Publishing an llms.txt file. It hands AI a clean, structured summary of your entity, services and key pages — and most competitors don't have one yet." },
      { q: "How do I measure my AI visibility?", a: "Run a free GeoPageScan audit. It scores your site 0–100 across six GEO/AEO/SEO categories and returns prioritized fixes." },
    ],
    related: ["invisible-to-ai", "chatgpt-cite", "llms-txt-guide"],
  },

  {
    id: "invisible-to-ai", cat: "GEO", emoji: "👻",
    title: "Why 94% of Websites Are Invisible to AI (And the Simple Fix)",
    dek: "Most sites tell AI engines almost nothing. Here are the single file and three schema types that move the needle most for AI visibility — and why they work.",
    date: "2026-05-21", read: "7 min",
    keywords: "AI visibility, invisible to AI, llms.txt, schema, FAQPage, GPTBot",
    sections: [
      { h: "Why are most websites invisible to AI?", p: [
        "Most sites were built for human readers and Google's keyword era. AI engines work differently: they extract entities, facts and relationships from structured, crawlable text.",
        "A beautiful video hero with three words of HTML text tells an LLM almost nothing — so it skips you in favor of a competitor it can actually read." ] },
      { h: "Fix #1 — publish an llms.txt", p: [
        "A single markdown file at <code>/llms.txt</code> gives AI a clean summary of who you are, what you offer and where your key pages live. It is the highest-impact, lowest-effort change available, and most competitors don't have one." ] },
      { h: "Fix #2 — add three schema types", p: [
        "Add <strong>Organization</strong> (brand entity), <strong>FAQPage</strong> (the content AI quotes most), and <strong>AggregateRating</strong> (trust). These three cover the majority of AI citation triggers for a typical business." ] },
      { h: "Fix #3 — let the bots in", p: [
        "Check robots.txt. If GPTBot, ClaudeBot and PerplexityBot aren't explicitly allowed, fix that today — a blocked bot can never cite you." ] },
    ],
    faq: [
      { q: "Why are 94% of websites invisible to AI?", a: "Because they lack the machine-readable signals AI relies on — no llms.txt, little or no schema, and content locked in images, video or JavaScript instead of crawlable HTML." },
      { q: "What's the fastest way to become visible to AI?", a: "Publish an llms.txt, add Organization + FAQPage + AggregateRating schema, and explicitly allow AI crawlers in robots.txt. Most of this takes under a day." },
      { q: "Does a video hero hurt AI visibility?", a: "It can — if the key messaging lives only inside the video. Ensure the same information also exists as real HTML text so crawlers can read it." },
    ],
    related: ["geo-guide", "schema-7-types", "llms-txt-guide"],
  },

  {
    id: "chatgpt-cite", cat: "GEO", emoji: "💬",
    title: "How to Get ChatGPT to Cite Your Website: A GEO Playbook",
    dek: "A concrete, step-by-step playbook to become a source ChatGPT pulls into its answers — from crawler access to answer-first content and entity resolution.",
    date: "2026-04-30", read: "10 min",
    keywords: "ChatGPT citations, GPTBot, OAI-SearchBot, GEO playbook, get cited by ChatGPT",
    sections: [
      { h: "How does ChatGPT choose which sources to cite?", p: [
        "With browsing and ChatGPT Search, OpenAI retrieves pages, then favors those that are crawlable, clearly structured and factually dense. Your job is to remove every reason for it to skip you." ] },
      { h: "Step 1 — be reachable", p: [
        "Allow <code>GPTBot</code>, <code>ChatGPT-User</code> and <code>OAI-SearchBot</code> in robots.txt and publish a sitemap. Make sure key content is server-rendered HTML, not JavaScript-only." ] },
      { h: "Step 2 — answer the question first", p: [
        "Lead each section with a one-sentence direct answer, then elaborate. ChatGPT loves to lift that first sentence verbatim into its response." ] },
      { h: "Step 3 — prove it's you", p: [
        "Add Organization schema with a <code>sameAs</code> array linking LinkedIn, Crunchbase and Wikidata so the model can resolve your entity confidently and attribute the citation correctly." ] },
    ],
    faq: [
      { q: "Which user-agents does ChatGPT use?", a: "GPTBot for indexing, ChatGPT-User for live user-triggered browsing, and OAI-SearchBot for ChatGPT Search. Allow all three in robots.txt to be citable." },
      { q: "Does allowing GPTBot mean my content is used for training?", a: "GPTBot can be used for training; you control access per user-agent in robots.txt. Many sites allow it to gain citation visibility — decide based on your goals." },
      { q: "How do I increase the odds of being cited?", a: "Be crawlable, answer questions directly in the first sentence, add FAQ and Organization schema, and link your entity with sameAs profiles." },
    ],
    related: ["geo-guide", "invisible-to-ai", "entity-authority"],
  },

  {
    id: "local-geo", cat: "GEO", emoji: "📍",
    title: "Local Business GEO: How to Get Cited by AI for Local Queries",
    dek: "LocalBusiness schema, NAP consistency and the trust signals that win local AI recommendations like \"best [service] near me\".",
    date: "2026-04-16", read: "8 min",
    keywords: "local GEO, LocalBusiness schema, near me, local AI search, AggregateRating",
    sections: [
      { h: "Why is local a key AI battleground?", p: [
        "\"Best dentist near me\" increasingly returns an AI answer naming two or three businesses. Being one of them is the entire game for local operators." ] },
      { h: "LocalBusiness schema is non-negotiable", p: [
        "Add LocalBusiness JSON-LD with name, address, geo coordinates, openingHours, telephone and priceRange. This is how AI resolves you as a real place it can recommend." ] },
      { h: "Reviews and ratings", p: [
        "Mark up your reviews with AggregateRating. AI weighs star ratings heavily when recommending local options — an unmarked 5-star reputation is invisible to it." ] },
      { h: "NAP consistency", p: [
        "Keep your Name, Address and Phone identical across your site, Google Business Profile and directories. Inconsistency makes AI distrust the entity and drop it from recommendations." ] },
    ],
    faq: [
      { q: "What schema does a local business need for AI?", a: "LocalBusiness (or a subtype like Restaurant/Dentist) with address, geo, hours and phone, plus AggregateRating for reviews. Add Organization and sameAs for entity authority." },
      { q: "Does my Google Business Profile affect AI answers?", a: "Yes. Consistent NAP between your site and your Google Business Profile strengthens entity trust, which feeds local AI recommendations." },
      { q: "How do I show ratings to AI?", a: "Wrap your existing reviews in AggregateRating JSON-LD with ratingValue and reviewCount so engines can read and surface them." },
    ],
    related: ["schema-7-types", "geo-guide", "entity-authority"],
  },

  {
    id: "geo-content", cat: "GEO", emoji: "✍️",
    title: "GEO Content Strategy: Writing for AI Engines, Not Just Humans",
    dek: "Question-led headings, direct answers and the informational tone AI rewards — how to write content generative engines actually quote.",
    date: "2026-03-26", read: "9 min",
    keywords: "GEO content, writing for AI, answer-first, question headings, informational content",
    sections: [
      { h: "Write the question, then answer it", p: [
        "Reframe headings as the literal questions your audience asks, then follow each with a direct, self-contained answer. This maps perfectly to how AI extracts and quotes content." ] },
      { h: "Facts beat adjectives", p: [
        "\"World-class, leading, best-in-class\" tells an LLM nothing. Specific numbers, dates, named outcomes and comparisons give it something concrete to cite." ] },
      { h: "Structure for extraction", p: [
        "Use a clear H2/H3 hierarchy, short paragraphs, lists and tables. A wall of text is hard for both humans and machines; scannable structure wins." ] },
    ],
    faq: [
      { q: "What writing style does AI prefer?", a: "Informational and factual: question-led headings, a direct answer in the first sentence, specific numbers and named entities, and minimal marketing hype." },
      { q: "Should I keep marketing copy?", a: "Keep persuasive copy for conversion sections, but lead informational pages with plain, factual, answer-first content that AI can quote." },
      { q: "How long should answers be?", a: "Aim for a 40–60 word direct answer immediately under each question heading, then expand with supporting detail." },
    ],
    related: ["aeo-guide", "geo-guide", "voice-aeo"],
  },

  {
    id: "aeo-guide", cat: "AEO", emoji: "🎯",
    title: "What Is AEO? The Complete Answer Engine Optimization Guide",
    dek: "How AEO differs from SEO and GEO, and how to win direct-answer surfaces like featured snippets, voice assistants and AI chat.",
    date: "2026-05-14", read: "10 min",
    keywords: "AEO, answer engine optimization, featured snippets, FAQPage, voice search",
    sections: [
      { h: "What is Answer Engine Optimization?", p: [
        "Answer Engine Optimization (AEO) is optimizing for surfaces that return a single direct answer — featured snippets, voice assistants and AI chat. It overlaps with GEO but focuses on the <strong>answer format</strong> itself." ] },
      { h: "The anatomy of an answerable page", p: [
        "A clear question heading, a concise 40–60 word answer immediately below it, then supporting detail. Wrap it in FAQPage schema and you've built an AEO magnet." ] },
      { h: "Voice and assistants", p: [
        "Add SpeakableSpecification to mark the sentences best suited to be read aloud by voice assistants, and phrase headings the way people speak." ] },
    ],
    comparison: {
      title: "AEO vs SEO",
      cols: ["Dimension", "SEO", "AEO"],
      rows: [
        ["Goal", "Rank in the list", "Be the single answer"],
        ["Content unit", "The page", "The question + answer"],
        ["Key markup", "Title, meta, links", "FAQPage, HowTo, Speakable"],
      ],
    },
    faq: [
      { q: "Is AEO different from SEO?", a: "Yes. SEO aims to rank a page in a list; AEO aims to be the single direct answer a search or assistant returns, using concise answers and FAQ/HowTo schema." },
      { q: "What schema helps AEO most?", a: "FAQPage and HowTo are the highest-impact, plus SpeakableSpecification for voice. They mark your content explicitly as answers." },
      { q: "How do I win a featured snippet?", a: "Put a 40–60 word direct answer right under a question heading, support it with structure, and mark it up with FAQPage schema." },
    ],
    related: ["llms-txt-guide", "schema-7-types", "voice-aeo"],
  },

  {
    id: "llms-txt-guide", cat: "AEO", emoji: "📑",
    title: "llms.txt: The Complete Guide — What It Is, Why It Matters, How to Create Yours",
    dek: "A copy-paste llms.txt template and the exact sections AI engines look for — the robots.txt of the AI era, explained.",
    date: "2026-05-07", read: "9 min",
    keywords: "llms.txt, llms.txt guide, llms.txt template, AI visibility, entity summary",
    sections: [
      { h: "What is llms.txt?", p: [
        "llms.txt is a simple markdown file at your domain root that gives AI assistants a curated, structured summary of your site — your entity, services, key definitions, important URLs and contact info." ] },
      { h: "Why does llms.txt work?", p: [
        "Instead of forcing an LLM to infer your business from marketing copy, you hand it the facts in the format it likes. It's the robots.txt of the AI era — low effort, high signal." ] },
      { h: "A minimal llms.txt template", p: [
        "Copy this, fill in your details, and serve it at <code>/llms.txt</code>:" ],
        code: `# Your Company

> One-sentence description of what you do.

## Services
- Service one — short description
- Service two — short description

## Key Pages
- Home: https://example.com/
- Pricing: https://example.com/pricing

## Contact
- Email: hello@example.com` },
      { h: "Where do I put llms.txt?", p: [
        "Serve it at <code>https://yourdomain.com/llms.txt</code> and reference it with a <code>&lt;meta name=\"llms-txt\"&gt;</code> tag in your HTML head so engines can discover it." ] },
    ],
    faq: [
      { q: "Where does llms.txt go?", a: "At your domain root: https://yourdomain.com/llms.txt. Optionally reference it with a meta tag named llms-txt in your HTML head." },
      { q: "What should llms.txt contain?", a: "A one-paragraph overview, founding year, a services list, key page URLs with descriptions, target audience, key term definitions, and contact info." },
      { q: "Is llms.txt an official standard?", a: "It's an emerging community convention (llmstxt.org). Adoption is still low, which makes it a strong early-mover advantage." },
    ],
    related: ["aeo-guide", "geo-guide", "invisible-to-ai"],
  },

  {
    id: "schema-7-types", cat: "AEO", emoji: "🏷️",
    title: "Schema Markup for AI Search: The 7 Types That Drive AI Citations",
    dek: "FAQPage, LocalBusiness, Organization, Article, HowTo, AggregateRating and Product — the JSON-LD types that turn your content into AI-citable facts.",
    date: "2026-04-23", read: "11 min",
    keywords: "schema markup, JSON-LD, FAQPage, LocalBusiness, HowTo, AggregateRating, AI citations",
    sections: [
      { h: "Why is schema the AI's cheat sheet?", p: [
        "JSON-LD turns your content into structured facts an AI can ingest without guessing. These seven types cover the vast majority of citation triggers." ] },
      { h: "The critical three", p: [
        "<strong>FAQPage</strong> marks Q&A for direct extraction. <strong>LocalBusiness</strong> defines a place. <strong>Organization</strong> establishes the brand entity and knowledge-graph node." ] },
      { h: "The high-impact four", p: [
        "<strong>Article/BlogPosting</strong> (author + date editorial signals), <strong>HowTo</strong> (step-by-step AEO magnet), <strong>AggregateRating</strong> (trust), and <strong>Product</strong> (e-commerce recommendations)." ] },
      { h: "Validate everything", p: [
        "Run your markup through Google's Rich Results Test before shipping — malformed JSON-LD is worse than none." ] },
    ],
    comparison: {
      title: "Schema types by GEO impact",
      cols: ["Type", "Impact", "What it does"],
      rows: [
        ["FAQPage", "Critical", "Marks Q&A for AI extraction"],
        ["LocalBusiness", "Critical", "Defines a local entity / place"],
        ["Organization", "High", "Brand entity + knowledge graph"],
        ["Article", "High", "Editorial signal (author + date)"],
        ["HowTo", "High", "Step-by-step AEO content"],
        ["AggregateRating", "High", "Star ratings in AI recommendations"],
        ["Product", "Medium", "E-commerce AI recommendations"],
      ],
    },
    faq: [
      { q: "Which schema type drives the most AI citations?", a: "FAQPage, because it explicitly maps questions to answers in a format AI lifts directly. LocalBusiness and Organization are close behind for entity definition." },
      { q: "Can I use multiple schema types on one page?", a: "Yes. Combine them in an @graph — for example Organization + FAQPage + BreadcrumbList on a homepage." },
      { q: "Does invalid schema hurt me?", a: "Malformed JSON-LD can be ignored or flagged. Always validate with Google's Rich Results Test before publishing." },
    ],
    related: ["local-geo", "schema-7-types", "ecommerce-aeo"],
  },

  {
    id: "voice-aeo", cat: "AEO", emoji: "🎙️",
    title: "Voice Search & AEO: Optimizing for Spoken Queries in 2026",
    dek: "Conversational keywords, Speakable schema and concise answers — how to optimize for voice assistants and spoken AI queries.",
    date: "2026-03-19", read: "7 min",
    keywords: "voice search, AEO, SpeakableSpecification, conversational queries, voice assistants",
    sections: [
      { h: "How are voice queries different?", p: [
        "People speak full questions. Optimize for natural language — \"how do I…\", \"what's the best…\" — and match those phrasings in your headings." ] },
      { h: "Use Speakable schema", p: [
        "Add SpeakableSpecification pointing at the sentences you want read aloud — typically your direct answers — so assistants know exactly what to say." ] },
      { h: "Keep answers short", p: [
        "Voice answers run ~30 words. Make sure your direct answer stands on its own within that span, without needing surrounding context." ] },
    ],
    faq: [
      { q: "What schema helps voice search?", a: "SpeakableSpecification marks the specific sentences best suited to be read aloud by voice assistants. Pair it with FAQPage for question matching." },
      { q: "How long should a voice answer be?", a: "About 30 words — a single, self-contained sentence or two that answers the spoken question directly." },
      { q: "Do conversational keywords matter?", a: "Yes. Phrase headings the way people speak (full questions) so voice engines match the query to your answer." },
    ],
    related: ["aeo-guide", "geo-content", "schema-7-types"],
  },

  {
    id: "ecommerce-aeo", cat: "AEO", emoji: "🛒",
    title: "AEO for E-Commerce: How to Get Your Products Recommended by AI",
    dek: "Product schema, review markup and structured specs that win AI shopping answers like \"what's the best [product] for [use]\".",
    date: "2026-03-12", read: "9 min",
    keywords: "ecommerce AEO, Product schema, AI shopping, product recommendations, AggregateRating",
    sections: [
      { h: "AI is the new shelf", p: [
        "Shoppers increasingly ask an AI \"what's the best X for Y\". To be recommended, your products must be machine-readable, not buried in images and JavaScript." ] },
      { h: "Product + Offer schema", p: [
        "Mark up price, availability, brand, GTIN and key attributes with Product and Offer JSON-LD. Add AggregateRating and Review so trust signals travel with the product." ] },
      { h: "Structured specs", p: [
        "Put specifications in real HTML tables, not images. AI can read a table; it can't read a JPEG of one." ] },
    ],
    faq: [
      { q: "What schema do product pages need for AI?", a: "Product with Offer (price, availability, brand) plus AggregateRating and Review. Add structured specs in HTML tables for machine readability." },
      { q: "Why aren't my products recommended by AI?", a: "Usually because key details live in images or JavaScript. Expose price, specs and reviews as crawlable HTML with Product schema." },
      { q: "Do reviews help product AEO?", a: "Strongly. AggregateRating and Review markup let AI factor your ratings into shopping recommendations." },
    ],
    related: ["schema-7-types", "aeo-guide", "technical-seo-checklist"],
  },

  {
    id: "seo-ai-era", cat: "SEO", emoji: "⚙️",
    title: "Traditional SEO in the AI Era: What Still Works, What's Dead",
    dek: "The classic SEO signals that still matter for AI — and the tactics to retire. A clear-eyed look at SEO in the age of generative search.",
    date: "2026-05-02", read: "8 min",
    keywords: "SEO in AI era, technical SEO, entity authority, what still works, AI Overviews",
    sections: [
      { h: "What still works in SEO?", p: [
        "Crawlability, fast Core Web Vitals, clean information architecture, canonical tags and genuine topical authority all still matter — AI engines lean on the same crawl infrastructure as classic search." ] },
      { h: "What's fading fast?", p: [
        "Keyword stuffing, thin doorway pages and link schemes do nothing for AI and increasingly nothing for Google. Entity clarity has replaced keyword density as the core signal." ] },
      { h: "The synthesis", p: [
        "Treat SEO as the foundation and GEO/AEO as the layer on top. Good technical SEO makes your GEO work actually reach the engines." ] },
    ],
    comparison: {
      title: "What still works vs what's dead",
      cols: ["Still works", "Dead / fading"],
      rows: [
        ["Crawlability & fast Core Web Vitals", "Keyword stuffing"],
        ["Clean site architecture & canonicals", "Thin doorway pages"],
        ["Topical & entity authority", "Link schemes / PBNs"],
        ["Structured data (schema)", "Exact-match keyword density"],
      ],
    },
    faq: [
      { q: "Is SEO dead in the AI era?", a: "No. Technical SEO is the foundation AI engines crawl. What's dead are manipulative tactics like keyword stuffing and link schemes — replaced by entity clarity and structure." },
      { q: "What SEO work matters most for AI?", a: "Crawlability, fast Core Web Vitals, clean architecture, canonicals and structured data. These let AI reach and trust your content." },
      { q: "Do backlinks still matter?", a: "Genuine authority and citations still help, but manipulative link building does not. Focus on being a credible, well-linked entity." },
    ],
    related: ["technical-seo-checklist", "entity-authority", "geo-guide"],
  },

  {
    id: "technical-seo-checklist", cat: "SEO", emoji: "✅",
    title: "The Complete Technical SEO Checklist for 2026",
    dek: "Canonical, hreflang, Open Graph, viewport, Core Web Vitals and the crawl essentials — a practical technical SEO checklist for the AI era.",
    date: "2026-04-09", read: "10 min",
    keywords: "technical SEO checklist, canonical, hreflang, Open Graph, Core Web Vitals, sitemap",
    sections: [
      { h: "Crawl & index essentials", p: [
        "Ship a sitemap, a sane robots.txt that allows AI bots, canonical tags on every page, and avoid JavaScript-only content for anything important." ] },
      { h: "International signals", p: [
        "Use hreflang to connect language and region variants — critical for multilingual brands and the single most common miss for .co.il / .de / .fr sites." ] },
      { h: "Social & mobile", p: [
        "Complete Open Graph and Twitter Card tags, a proper viewport meta, and Core Web Vitals in the green." ] },
      { h: "Metadata hygiene", p: [
        "Unique titles (~55 chars) and meta descriptions (~155 chars) on every page, plus an <code>&lt;html lang&gt;</code> attribute on every document." ] },
    ],
    faq: [
      { q: "What are the most overlooked technical SEO items?", a: "hreflang for multilingual sites, canonical tags, html lang attributes, and ensuring AI bots are allowed in robots.txt." },
      { q: "Do Core Web Vitals affect AI visibility?", a: "Indirectly — they affect crawl efficiency and user experience signals that feed both classic and AI search surfaces." },
      { q: "How long should titles and descriptions be?", a: "Titles around 55–60 characters and meta descriptions around 150–160 characters, unique per page." },
    ],
    related: ["seo-ai-era", "entity-authority", "ecommerce-aeo"],
  },

  {
    id: "entity-authority", cat: "SEO", emoji: "🛡️",
    title: "Building Entity Authority: The SEO Strategy That Works for Google and AI",
    dek: "sameAs links, author entities and the trust graph AI engines rely on — how to become an unambiguous, well-connected entity.",
    date: "2026-03-05", read: "9 min",
    keywords: "entity authority, sameAs, knowledge graph, author entity, Wikidata, brand entity",
    sections: [
      { h: "Think in entities, not just pages", p: [
        "Both Google and LLMs think in entities — people, organizations, products. Your goal is to be an unambiguous, well-connected entity in that graph." ] },
      { h: "The sameAs technique", p: [
        "Link your Organization and Person schema to authoritative profiles (LinkedIn, Wikidata, Crunchbase) via <code>sameAs</code>. This is how machines confirm you're real and the same entity across the web." ] },
      { h: "Named authors", p: [
        "Editorial content with a named, linkable author and a publish date carries far more authority than anonymous copy — for Google E-E-A-T and for AI trust." ] },
    ],
    faq: [
      { q: "What is entity authority?", a: "It's how clearly and credibly search and AI systems can identify your brand or people as a known entity, reinforced by schema and external profile links." },
      { q: "How does sameAs help?", a: "A sameAs array in Organization/Person schema links you to authoritative profiles, letting machines confirm and connect your entity across the web." },
      { q: "Do author bylines matter for AI?", a: "Yes. Named, linkable authors with Person schema and publish dates increase editorial trust for both Google E-E-A-T and AI engines." },
    ],
    related: ["seo-ai-era", "chatgpt-cite", "schema-7-types"],
  },

  {
    id: "introducing-geopagescan", cat: "Tool", emoji: "🚀",
    title: "Introducing GeoPageScan: The Free AI Visibility Audit Tool Your Website Needs",
    dek: "Why we built a free scanner for the generative search era — and how to use it to find and fix your AI-visibility gaps in minutes.",
    date: "2026-05-30", read: "6 min",
    keywords: "GeoPageScan, AI visibility audit, free GEO tool, AI visibility scanner, audit",
    sections: [
      { h: "The gap we saw", p: [
        "Plenty of tools audit classic SEO. Almost none tell you whether AI engines can understand and cite you. So we built GeoPageScan — free, no login, instant." ] },
      { h: "What does GeoPageScan do?", p: [
        "Enter any URL. We scrape the HTML, schema, llms.txt and robots.txt, then score you 0–100 across six GEO/AEO/SEO categories with prioritized, copy-ready fixes." ] },
      { h: "How to use it", p: [
        "Scan your site, start with the Quick Wins, re-scan after each change, and watch your score climb. Then scan your competitors to see where you stand." ] },
    ],
    faq: [
      { q: "Is GeoPageScan free?", a: "Yes. Enter any URL — no login, no credit card — and get a full scored report across six categories with prioritized fixes." },
      { q: "What does GeoPageScan check?", a: "Six categories: LLM Optimization (llms.txt), Structured Data, AI Crawlability, Authority Signals, Content Clarity and Technical SEO." },
      { q: "How long does a scan take?", a: "Usually a few seconds. Deeper AI-powered audits of complex sites can take up to 60–90 seconds." },
    ],
    related: ["agency-workflow", "geo-guide", "invisible-to-ai"],
  },

  {
    id: "agency-workflow", cat: "Tool", emoji: "🏢",
    title: "The GeoPageScan Agency Workflow: Auditing 10 Sites a Week for GEO/AEO",
    dek: "A repeatable agency process for turning AI-visibility audits into client wins — from onboarding scans to a monthly score KPI.",
    date: "2026-04-02", read: "8 min",
    keywords: "agency workflow, GEO audit, client reporting, AI visibility KPI, GeoPageScan agency",
    sections: [
      { h: "Audit at onboarding", p: [
        "Run a GeoPageScan audit on every prospect before the first call. The score and gap list make the AI-visibility problem impossible to ignore." ] },
      { h: "Turn findings into a roadmap", p: [
        "Group fixes by effort: ship the Quick Wins in week one, then schedule schema and content work across the month." ] },
      { h: "Prove impact", p: [
        "Re-scan monthly and track the score trend. A rising AI-visibility score is a clean, client-friendly KPI everyone understands." ] },
      { h: "Scale it", p: [
        "Standardize an llms.txt + schema starter kit so your team can lift a new client's score fast and consistently." ] },
    ],
    faq: [
      { q: "How do agencies use GeoPageScan?", a: "To audit prospects at onboarding, build a prioritized fix roadmap, and track a monthly AI-visibility score as a client KPI." },
      { q: "How many sites can I audit?", a: "It's free with no login, so audit as many client and prospect sites as you need." },
      { q: "What's a good client KPI for GEO?", a: "The overall AI-visibility score (0–100) tracked monthly, plus the count of resolved critical/high findings." },
    ],
    related: ["introducing-geopagescan", "geo-guide", "schema-7-types"],
  },
];
