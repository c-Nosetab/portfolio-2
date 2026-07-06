# Design Direction — chrisbateson.dev

Locked with Chris on 2026-07-06. This is the aesthetic contract for all UI work.
The `design-taste-frontend` skill governs execution; this file records the decisions.

## Territory: Kinetic Editorial

Typography IS the visual. Big display type, choreographed scroll, disciplined
Awwwards energy. The site reads as "design-capable dev with real taste."

## Dials

- `DESIGN_VARIANCE: 7-8` — asymmetric grids, offset compositions, generous empty zones
- `MOTION_INTENSITY: 7-8` — showpiece tier (see Motion below)
- `VISUAL_DENSITY: 3` — airy, gallery-like spacing (`py-32`+ sections)

## Theme

- Light-first: paper + ink (off-white background, off-black text — never pure #fff/#000)
- Auto dark mode via `prefers-color-scheme`, tested in both from day one
- Page Theme Lock: no section-level theme flips

## Typography

- Display + body: **Switzer** (Fontshare, free, ITF license, variable). Chosen as the
  free stand-in for PP Neue Montreal (loved, but $980 blanket / pageview-capped sub).
  Self-host woff2 via `next/font/local`. Upgrade path to Neue Montreal = one font-file
  swap if the site ever justifies the license.
- Data/metrics: JetBrains Mono
- NO serif. Emphasis via italic/bold of the same family only.
- Display scale discipline: headlines ≤ 2 lines, hero stack ≤ 4 text elements

## Color

- Accent: **cobalt blue** `#1F3FFF` (locked page-wide; brightens to `#4D6BFF` on dark)
- Paper `#FAFAF7` / ink `#16161A` — never pure #fff/#000
- One gray family only. No AI-purple, no gradients-as-decoration

## Motion (Showpiece)

- One signature kinetic-type hero reveal — the first flex
- Choreographed scroll: staggered reveals, sticky-stack case-study cards,
  max ONE horizontal-pan section, max ONE marquee per page
- Motion (`motion/react`) for UI/reveals; GSAP ScrollTrigger only for pin/scrub work
- Every animation motivated (hierarchy / storytelling / feedback) — no motion-for-show
- `prefers-reduced-motion` fallback mandatory everywhere
- Lighthouse 100 stays non-negotiable — animation islands small, client JS minimal

## Open decisions

- [x] Accent color — cobalt `#1F3FFF`
- [x] Display font — Switzer (Neue Montreal upgrade path noted)
- [ ] Hero kinetic concept (design comps before build)
