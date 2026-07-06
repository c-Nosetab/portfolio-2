# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Monorepo scaffolded (CBA-629): pnpm workspaces + Turborepo. `apps/web` = Next.js 15
App Router (TypeScript strict, Tailwind v4, Motion), `apps/studio` = Sanity Studio
(projectId `45x5v0g5`, dataset `production`).

Commands (repo root): `pnpm dev` (all), `pnpm build`, `pnpm lint`, `pnpm typecheck`.
Per-app: `pnpm --filter @portfolio/web dev` (localhost:3000),
`pnpm --filter @portfolio/studio dev` (localhost:3333). Env: copy
`apps/web/.env.example` to `.env.local`.

## What this is

Chris Bateson's personal portfolio/resume site. One project dataset serves three
audiences — contract clients (outcomes), recruiters (craft + range), micro-app users
(live products). The site itself is the flagship demo: ~100 Lighthouse and smooth
animation are product requirements, not polish.

## Sources of truth

- `portfolio-site-plan.md` — sitemap, page-by-page content plan, content model, CMS decision
- Linear project "Portfolio / Resume Site" (team CBA, tickets CBA-627–635) — task tracking;
  branch names follow Linear's `chris/cba-NNN-slug` convention

## Planned stack & architecture

- **pnpm + Turborepo monorepo**, frontend and backend in separate spaces:
  `apps/web` (Next.js App Router + TypeScript + Tailwind + Motion) and
  `apps/studio` (Sanity Studio v3). Deployed on Vercel; domain chrisbateson.dev.
  **Cloudflare Turnstile** for bot protection (contact form + email reveal).
- Routes (in `apps/web`): `/` (home), `/work` + `/work/[slug]` (case studies),
  `/products`, `/lab`, `/about`, `/contact`, plus API routes: `contact`
  (Turnstile-verified form), `reveal-email` (Turnstile-verified), `revalidate`
  (Sanity webhook → on-demand ISR).
- **Content pipeline: Sanity from v1** (decided 2026-07-06 — Chris already runs
  Sanity v3 on Pioneer District; image CDN doubles as screenshot pipeline).
  Project schema per `portfolio-site-plan.md` §4 plus a `draft` flag (drafts never
  render publicly). On-demand ISR via revalidate webhook. The MDX files in
  `content/projects/` are reference drafts to migrate into Sanity, then archive —
  do NOT build an MDX loader.
- Ordering: integer `order` field drives manual reordering; `featured: true` caps the
  home grid at 4 projects.

## Hard constraints

- Target 100 Lighthouse: RSC-first, minimal client JS, small animation islands.
- **Contact info is human-gated:** never render Chris's email/phone in static HTML,
  RSC payload, or page source. Email is revealed only after a Cloudflare Turnstile
  pass, served from an API route that verifies the token. Contact form submissions
  without a server-verified Turnstile token are rejected. Public links (GitHub,
  LinkedIn) stay ungated.
- Motion is purposeful only; always respect `prefers-reduced-motion`.
- Accessibility is a portfolio signal: semantic HTML, focus states, keyboard nav.
- Dark mode is expected.

## Design workflow (required)

Design quality is the product here — the site must read as powerful and beautiful,
never templated. **Locked direction: Kinetic Editorial** (typography-led, light-first
paper+ink with auto dark, showpiece motion tier) — see `DESIGN-DIRECTION.md` for the
full aesthetic contract. For ALL frontend/UI work:

- **Invoke the `design-taste-frontend` skill before building or restyling any page or
  component.** It is the primary design skill for this project (portfolio/landing work
  is its exact scope). Supporting skills as fits the task: `frontend-design`,
  `high-end-visual-design`, `imagegen-frontend-web` (design reference comps before
  coding visually important sections).
- **Design is collaborative.** Present direction options (typography, palette, motion
  concepts, hero comps) to Chris and iterate with him before locking in — don't ship a
  first-pass aesthetic unilaterally.

## Linear Project

- **Team:** Cbateson
- **Team Key:** CBA
- **Project:** Portfolio / Resume Site
- **Default Labels:** (none configured yet)

## Build phases

1. **v1:** Home + Work index + 2–3 case studies + Contact — deployed on Vercel.
2. **v2:** Products hub, About/resume, filtering, CMS wired in, OG images.
3. **v3:** Lab, live demos/embeds, signature animations, analytics.
