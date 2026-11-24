# MarketPath (Vue 3)

Learn crypto & stock market basics from zero — interactive charts, paper-trading simulator, quizzes & glossary. **Not financial advice.**

This is a full rewrite of the original **Next.js 16 + React 19 + shadcn/ui** app into **Vue 3**, keeping a 1:1 visual and behavioral match. See `worklog.md` for the section-by-section porting notes.

## Stack

| Layer | Original (React) | This rewrite |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | **Vue 3.5 + Vite 7** (SPA) |
| UI kit | shadcn/ui (Radix primitives) | **shadcn-vue** equivalents built on **reka-ui** (the Radix port for Vue) |
| Styling | Tailwind CSS 4 | Tailwind CSS 4 (same tokens, same design) |
| Animation | framer-motion | **@vueuse/motion** + CSS keyframes for SVG path drawing |
| Icons | lucide-react | lucide-vue-next |
| State | React Context | Vue reactive store (`src/lib/progress.ts`) |
| Theme | next-themes | custom `useTheme` composable (same `dark`-class strategy, default dark) |
| Tests | — | **Vitest + Vue Test Utils** |
| Deploy | GitHub Pages Actions | GitHub Pages Actions (`dist/`, fixed `branches: [main]` trigger) |

## Getting started

```bash
bun install        # or npm install / pnpm install
bun run dev        # dev server at http://localhost:5173
bun run test       # run the Vitest suite (19 tests)
bun run build      # type-check + production build to dist/
bun run preview    # serve the production build locally
```

## Project structure

```
src/
  App.vue                    # page composition (same section order as the original page.tsx)
  main.ts                    # app bootstrap + @vueuse/motion plugin
  assets/globals.css         # original design tokens, light + dark themes, utilities
  lib/
    education-data.ts        # glossary + quiz banks (ported verbatim)
    market-data.ts           # seeded candlestick/price generators (ported verbatim)
    progress.ts              # localStorage-backed progress store (Vue version of the context)
  composables/useTheme.ts    # dark/light toggle with pre-paint script in index.html
  components/ui/             # shadcn-vue style primitives (Button, Badge, Input, Label,
                             # Slider, Progress, Switch, Popover, Accordion, Sheet, Toaster)
  components/site/           # the 12 page sections, ported 1:1 (Nav, Hero, Fundamentals,
                             # StockEssentials, CryptoEssentials, ChartReading, CandleChart,
                             # Simulator, RiskManagement, QuizRunner, Practice, GlossaryFaq,
                             # plus shared Term/Takeaway/SectionShell/InfoCard/SimBadge)
  tests/                     # Vitest unit tests (data, store, components)
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on every push to `main` (and via manual dispatch). The Vite config uses a relative `base: "./"` so it works at `https://<user>.github.io/<repo>/` without extra configuration.

Note: the original workflow had a broken trigger (`branches: ain]`) that silently disabled auto-deploys; it is fixed here.

## Educational disclaimer

All prices, charts and portfolio values are simulated or purely illustrative and never represent live market data. Nothing on MarketPath is financial, investment or tax advice.
