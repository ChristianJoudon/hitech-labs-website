# HiTech Labs refresh — third pass (refined editorial)

Goal: make the site match the printed brand mockups (logo, business card, invoice)
as closely as possible — modern, minimal, effortless, Hawaiian, incredibly professional.
No about-me or reviews section.

## Brand system (now the single source of truth)

Colors sampled from the real logo (#2A3832) and business card (#3C4943):

- Paper `#F6F2EC`, card surface `#FCFAF6`
- Greens: headings `#33403A`, primary `#44534A`, darkest/forest `#2A3832`, body `#585F58`
  (replaces the old grayish `#515C54`)
- ONE earthy terracotta accent `#B56A4C` / `#A15C41`, used sparingly for the mono
  eyebrow, icons, links (replaces the old dusty pink `#CFA69D` / `coral` token)
- Pale sage fern watermark `#D8D1CB`

Type: ONE serif everywhere — Cormorant Garamond 600 (dropped Lora). Body: Manrope.
Detail/labels/phone: IBM Plex Mono (echoes the card + invoice).

## What changed

- New design system in `tailwind.config.mjs` + `src/index.css` (deeper greens, terracotta,
  unified serif, mono details, focus-visible rings, skip link).
- Hero: mono location eyebrow, refined CTA pair (solid-green primary + ghost "Explore
  services"), mono reassurance line, softened floating fern with gentle scroll parallax.
- New `TrustStrip` credibility band under the hero.
- Nav: smooth-scroll + active-section underline (`src/hooks/useUiChrome.ts`), firms up on
  scroll, "Free Consult" demoted to outline so the hero CTA leads.
- Service cards: left-aligned, mono index numbers, boxed terracotta icons, "View details" reveal.
- Sections given consistent eyebrows, rhythm, and hover treatment.
- Fixed the `url('public/assets/...')` texture bug → `/assets/...`.
- Recolored favicon + brand-kit logo SVGs to the deep green.

## Fixes from the adversarial review pass (a11y + code)

- Duplicate `id="home"` on the contact success state → `id="contact"`.
- Modal enter animations used non-existent `duration-250/350` → `duration-300`.
- Added accessible names to the mobile menu toggle + modal close buttons and form inputs.
- Darkened low-contrast text (eyebrow → claydeep, sage labels, form placeholders) for WCAG AA.
- Added a skip-to-content link, visible focus rings, and `MotionConfig reducedMotion="user"`.
- Stabilized the active-section observer (no more re-subscribe churn).
- Removed dead code: `AboutSection`, `LocalVoices`, unused `.reveal` CSS, `dialog-panel` class.

## Status

`npm run build` and `npx tsc --noEmit` pass. `npx eslint src` reports 0 errors (5 warnings
are just the tailwind plugin not recognizing valid arbitrary-opacity classes like `bg-clay/12`).
Vitest still can't run in this copy — it references a missing `.vitest/setup` file (pre-existing
infra issue, unrelated to the app).
