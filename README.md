# HiTech Labs - Website

Single-page marketing site for **HiTech Labs**, a Kauaʻi-based small-business IT
consultancy (Princeville · Hanalei · Kīlauea). Refined-editorial design: warm cream
paper, deep sage-forest greens, an earthy terracotta accent, and soft palm botanicals.

Built with React 18 + Vite + TypeScript + TailwindCSS.

## Stack

- [Vite](https://vitejs.dev) 5 + [React](https://react.dev) 18 + [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com) 3 - design tokens in `tailwind.config.mjs` + `src/index.css`
- [Framer Motion](https://www.framer.com/motion/) - effortless-subtle motion (smooth scroll, active-nav highlight, gentle reveals, floating hero palm)
- [Headless UI](https://headlessui.com) + [Heroicons](https://heroicons.com) - modals, disclosures, icons
- [Formspree](https://formspree.io) - contact and appointment request forms
- [Cloudflare Pages](https://pages.cloudflare.com) - hosting, SSL, security headers, and web analytics
- ESLint + Prettier + Vitest

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

```bash
npm run dev        # dev server with HMR
npm run build      # typecheck + production build to /dist
npm run serve      # preview the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest
npm run test:run   # one complete test run
npm run verify:static # structured data, CSP, legal pages, and PNG manifest icons
```

## Structure

```
src/
  components/      NavBar, Hero, TrustStrip, ServicesSection, ServiceCard,
                   AdvancedAccordion, FAQSection, BookingSection, ContactSection,
                   Footer, modals
  hooks/           useUiChrome (scroll state + active-section observer)
  index.css        design system (tokens, typography, cards, buttons)
public/assets/brand/   logos, palm art (palm-hero.png, palm-frond.png), textures
```

## Design notes

The brand system and rationale (colors, type, motion) are documented in
[`STYLE-UPDATE-NOTES.md`](./STYLE-UPDATE-NOTES.md).

## License

MIT - see [LICENSE](./LICENSE).
