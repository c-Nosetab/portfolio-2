# Portfolio Site — Sitemap & Content Plan

**Owner:** Chris Bateson
**Stack:** Next.js (App Router) · Headless CMS (Sanity or Payload) · Motion for animation · Tailwind · Cloudflare Turnstile (bot protection) · deploy on Vercel
**Positioning:** Balanced across three audiences — contract clients, full-time recruiters, and micro-app users — using one project dataset framed three ways.

---

## 1. Positioning strategy

The site serves three readers without feeling like three sites. The mechanism: **one project dataset, three lenses.**

| Audience | What they scan for | How the site answers |
|---|---|---|
| **Contract clients** | Can you ship, and what's the outcome? | Outcome-first case studies, a "Work with me" path, clear services |
| **Full-time recruiters** | Depth, code quality, range | Tech stack tags, links to source/live, an About with real signal |
| **Micro-app users** | Is this thing useful? | Live app links, "poke at it" demos, a products hub |

**The site itself is the flagship demo.** For someone selling design/animation/API skills, a fast, polished, smoothly-animated site proves the pitch before anyone reads a word. Perfect Lighthouse scores and buttery transitions are non-negotiable — they *are* the portfolio.

**Differentiator to lean on:** micro-apps that are live and in real use — shipped products, not just repos. Put a real metric on each when one exists (users, uptime; revenue later once monetization ships). *(Softened 2026-07-06: revenue claim on hold until supported by real numbers.)*

---

## 2. Sitemap & route structure (Next.js App Router)

```
apps/
├── web/                              # FRONTEND — Next.js 15 App Router
│   ├── app/
│   │   ├── layout.tsx                # Root: nav, footer, theme, fonts
│   │   ├── page.tsx                  # HOME
│   │   ├── work/
│   │   │   ├── page.tsx              # WORK INDEX (filterable project grid)
│   │   │   └── [slug]/page.tsx       # CASE STUDY (from Sanity)
│   │   ├── products/page.tsx         # PRODUCTS hub (projects where type == "product")
│   │   ├── lab/page.tsx              # LAB — experiments, demos, animations
│   │   ├── about/page.tsx            # ABOUT + resume
│   │   ├── contact/page.tsx          # CONTACT / "Work with me"
│   │   └── api/
│   │       ├── contact/route.ts      # Form handler (Turnstile-verified)
│   │       ├── reveal-email/route.ts # Email reveal (Turnstile-verified)
│   │       └── revalidate/route.ts   # Sanity webhook → on-demand ISR
│   └── public/
│       ├── resume.pdf                # Downloadable resume
│       └── og/                       # Social preview images
└── studio/                           # BACKEND — Sanity Studio v3
    └── schemas/                      # project doc type, ordering, draft flag

packages/                             # shared config as needed (ts/eslint/tokens)

content/
└── projects/*.mdx                    # Reference drafts — migrate INTO Sanity, then archive
```

**Monorepo:** pnpm workspaces + Turborepo, frontend (`apps/web`) and backend/CMS (`apps/studio`) in separate spaces — same shape as Pioneer v2.

**Note (2026-07-06): Sanity ships in v1** (not a v2 swap). Rationale: CMS decision is made, Chris already knows Sanity, and the screenshot/cover pipeline wants Sanity's image CDN before asset gathering. MDX-in-repo step deleted — the 6 drafts in `content/projects/` migrate straight into Sanity.

**Route priorities:** Home, Work, and Contact are essential for v1. Products, Lab, and About round it out but can ship in a fast follow.

---

## 3. Page-by-page content plan

### HOME `/`
The 10-second pitch. Sections top to bottom:

1. **Hero** — one-line value prop ("I design and build fast, polished web apps — from micro-SaaS to production frontends"), a subtle signature animation (this is your first flex), two CTAs: *See my work* / *Work with me*.
2. **Featured work** — 3–4 hand-picked case studies as large cards with a headline outcome each. Hover = live preview or motion.
3. **Products strip** — "Things I've shipped that are live right now" → logos/links to micro-apps, with one metric if you have it (users, revenue, uptime).
4. **Capabilities** — 3 columns: Design/UI · Animation/Interaction · APIs/Backend. One proof link per column.
5. **Selected stack** — the tools you actually reach for (TypeScript first). Signals seniority to recruiters.
6. **CTA band** — "Have something to build? / Hiring?" → Contact.

### WORK `/work`
Filterable grid of every project. Filter chips by type (Client · Product · Experiment) and by tag (React, Animation, API, etc.). Each card: thumbnail, title, one-liner, stack tags, links. Featured pinned to top; long-tail one-offs below.

### CASE STUDY `/work/[slug]`
Generated from MDX. Recommended structure:
- Hero: title, role, timeline, live + source links
- **Outcome up top** (for clients): the result in one bold sentence + metrics
- Problem → Approach → What I built → Result
- Tech decisions & tradeoffs (for recruiters — show the thinking)
- Visuals: embedded demo, before/after, short clips
- Next/prev project nav

### PRODUCTS `/products`
Your micro-app hub — doubles as a funnel to the apps themselves. Each: screenshot, what it does, who it's for, **live link + "try it" CTA**, and a metric if public. This is where the shipped-products story lives.

### LAB `/lab`
Playground for one-off experiments, animation studies, API demos. Lower-stakes, high-personality. Live embeds / interactive widgets beat screenshots — an API you can poke on the page is worth ten bullet points. Great for showing range without full case-study weight.

### ABOUT `/about`
Short narrative (who you are, what you care about building), a real photo, the resume inline + **download PDF**, and links (GitHub, LinkedIn, X, email). Keep it human — recruiters read this last and it closes the deal.

### CONTACT `/contact`
Dual-framed: "Work with me" (contract) and "Get in touch" (hiring). Simple form (name, email, project type, message). Set expectations ("I reply within a day").

**Contact info is gated behind human verification (Cloudflare Turnstile):**
- No raw email/phone anywhere in static HTML, RSC payload, or page source — scrapers and bots get nothing.
- Form submissions require a Turnstile token, verified server-side in `app/api/contact/route.ts` (siteverify API).
- Direct-email fallback becomes a **"Reveal email"** action: invisible/managed Turnstile challenge → verified API route returns the address → rendered client-side only after the pass.
- Public professional links (GitHub, LinkedIn) stay ungated — already public; recruiters get zero friction.

---

## 4. Project catalog — content model

Each project is one entry (a CMS document, or an MDX file if you skip the CMS). Same shape either way:

```
title            string
slug             string (unique)
type             "client" | "product" | "experiment"
featured         boolean          # surfaces on home + top of /work
order            number           # manual drag-to-reorder rank
summary          string           # one-line hook for cards
role             string
timeline         string
stack            string[]         # ["Next.js", "TypeScript", "Postgres"]
tags             string[]         # ["Animation", "API", "SaaS"]
outcome          string           # optional but gold
metrics          {label, value}[] # optional stat blocks
links            {live, source, writeup}
cover            image
demo             "embed" | "video" | "image"
body             rich text / MDX  # case-study narrative
publishedAt      date
```

**Card vs. case-study fields:** cards use `title, summary, stack, tags, links, cover, order`. Case studies use everything plus `body`.

**Ordering:** an `order` field (integer rank) is what makes drag-to-reposition work — the CMS updates the number, the query sorts by it, the page revalidates. `featured: true` controls what hits the home grid (cap at 4); everything else lives on `/work`.

---

## 4.5 Headless CMS — add / remove / reposition without redeploying

**Requirement:** change content and reorder projects live, no code commit, no rebuild.

**How it works with Next.js:** pages are statically generated but use **on-demand ISR** — publishing in the CMS fires a webhook to a `revalidate` route that refreshes only the affected pages. Content is live in seconds; no full redeploy. (Reordering = update the `order` field → publish → revalidate.)

**Recommended options:**

| CMS | Why it fits you | Tradeoff |
|---|---|---|
| **Sanity** *(top pick)* | TS-native, generous free tier, real-time Studio you can host at `/studio` inside the same repo, easy drag-reorder via ordering plugin, Portable Text for rich case studies | Content lives on Sanity's servers (fine for a portfolio) |
| **Payload** | TS-native, **you own the data** (Postgres/Mongo), admin UI, can run in the same Next app | You host the DB; slightly more setup |
| **TinaCMS** | Edit visually on the live site, git-backed | Still commits to git = a build per change (fails the "no redeploy" goal) |
| **Contentful / Prismic** | Mature, polished editors | Less TS-idiomatic; pricing scales up |

**My call:** **Sanity** for fastest path to the no-redeploy, drag-to-reorder experience you described. Choose **Payload** instead if owning your data / self-hosting matters to you. Skip Tina here since it rebuilds on every edit.

**✅ DECIDED (2026-07-06): Sanity confirmed, shipping in v1.** Deciding factors: Chris already runs Sanity Studio v3 in production (Pioneer District v2, 15 content types), and Sanity's image CDN (hotspot crop, transforms) doubles as the screenshot/cover pipeline. MDX-in-repo step deleted to avoid building the content layer twice — the 6 drafts migrate straight into Sanity (CBA-630).

**One caveat:** a CMS adds a small amount of infra and a content-fetching layer. If v1 timeline is tight, we can ship with MDX-in-repo first (identical model above) and swap in Sanity in v2 — the component code barely changes because the shape is the same.

---

## 5. Design & animation notes

- **Motion budget:** purposeful, not decorative. Page transitions, staggered card reveals on scroll, one signature hero moment. Respect `prefers-reduced-motion`.
- **Performance is the flex:** target 100 Lighthouse. Astro-level speed is achievable in Next with RSC + image optimization + minimal client JS. Keep animation islands small.
- **One strong type + color system.** Consistency reads as senior. Dark mode is expected.
- **Interactive proof over screenshots** wherever feasible (live iframes, sandboxes, a working API widget in Lab).
- **Accessibility = craft signal** for recruiters: semantic HTML, focus states, alt text, keyboard nav.

---

## 6. Content you need to gather

Before we build, collect:

- [ ] Full project inventory (client work, products, one-offs) — even rough
- [ ] For each: live URL, source URL (if public), stack, 1–2 line summary
- [ ] Any real metrics (users, revenue, performance, time-to-ship) — these do the heaviest lifting
- [ ] 3–4 projects you'd nominate as **featured**
- [ ] A photo + a short bio paragraph
- [ ] Current resume (for the PDF + About page)
- [ ] Your links: GitHub, LinkedIn, X, email
- [x] Domain name — **chrisbateson.dev** (primary); cbateson.com + chrisbateson.com redirect to it
- [ ] Cloudflare account + Turnstile site/secret keys

---

## 7. Deployment & ops

- **Host:** Vercel (native Next.js, free tier, preview deploys per PR, edge network). Cloudflare Pages is a fine alt.
- **Domain:** **chrisbateson.dev** (primary, purchased). cbateson.com and chrisbateson.com 301-redirect to it. Note: `.dev` is an HSTS-preloaded TLD — HTTPS only (automatic on Vercel). If Cloudflare DNS fronts Vercel, keep records DNS-only (gray cloud) — don't double-proxy.
- **Bot protection:** **Cloudflare Turnstile** (free) gates the contact form and the email reveal. Client widget + server-side siteverify in the route handler. Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
- **Analytics:** Vercel Analytics or Plausible (privacy-friendly).
- **Contact form:** a route handler + Resend, or a no-backend service (Formspree) for v1. Either way, submissions are rejected without a server-verified Turnstile token.
- **SEO:** per-page metadata, OG images (can auto-generate), sitemap.xml, structured data on case studies.

---

## 8. Suggested build phases

1. **v1 (ship fast):** Home + Work index + 2–3 case studies + Contact. A real, deployed site beats a perfect unshipped one.
2. **v2:** Products hub, About/resume, filtering, OG images.
3. **v3:** Lab, live demos/embeds, signature animations, analytics.

---

*Next step options: (a) I scaffold the v1 Next.js starter in this folder wired to MDX, or (b) we inventory your projects first and fill the content model. Say the word.*
