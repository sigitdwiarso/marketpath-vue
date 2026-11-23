# Worklog — React → Vue rewrite

Rebuild of the Next.js/React MarketPath app as a Vue 3 + Vite SPA with shadcn-vue (reka-ui), 1:1 fidelity target.

## Decisions

- **UI kit:** shadcn-vue equivalents hand-built on **reka-ui** (the Vue port of Radix UI), because the original uses a small subset of shadcn/ui primitives. Class strings copied from the original `src/components/ui/*.tsx` for pixel parity.
- **Framework:** Vite + Vue 3 SPA (user choice) instead of Nuxt — single-page site, GitHub Pages static deploy.
- **Animations:** `@vueuse/motion` (user choice) for element reveals (hero card, candle stagger). framer-motion's `pathLength` SVG line-draw has no Vue equivalent, so the hero chart uses CSS `stroke-dasharray` + `pathLength="1"` normalization with the same 2.2s ease-in-out timing; the "last dot" pop and area fade keep the original delays (1.6s / 2.15s).
- **Data libs:** `market-data.ts` and `education-data.ts` ported verbatim (zero changes — pure TS).
- **Progress store:** React Context → module-level `reactive()` store with the same localStorage key (`marketpath-progress-v1`) and same persistence semantics; `useProgress()` keeps the same call signature.
- **Theme:** `next-themes` → `useTheme` composable + inline pre-paint script in `index.html` (default dark, class strategy, localStorage key `marketpath-theme`).
- **Toaster:** original renders a toast viewport but never fires a toast; kept as a stub for parity.

## Section-by-section notes

- **Nav** — sticky header + scroll blur, progress bar, ghost icon theme toggle, Sheet (reka-ui Dialog) mobile menu with lesson list + completion dots.
- **Hero** — animated SVG chart (CSS line-draw), duplicated ticker with `animate-ticker`, two `as-child` anchor buttons.
- **Fundamentals / StockEssentials / CryptoEssentials** — static educational content, Term popovers via reka-ui Popover, tables, market-cycle SVG, chain-visual with `animate-dash-flow`.
- **ChartReading + CandleChart** — interactive candlestick chart: asset toggle, timeframe buttons, MA switch, hover crosshair + tooltip positioning logic, per-candle stagger via `v-motion` (delay i×12ms, 300ms), volume bars, MA-7/MA-25 paths, guided exercise state machine.
- **Simulator** — trading desk (cash/qty/prices, BUY/SELL, 12-entry trade log, scenario multipliers, flash message with 3.5s timeout) + allocation lab (5 sliders, normalization, scenario returns, concentration meter, outcome bar). framer-motion `AnimatePresence` blurb → Vue `<Transition>`.
- **RiskManagement** — drawdown bars, position sizing calculator, leverage slider, four emotional traps.
- **QuizRunner + Practice** — quiz state machine (pick → reveal → explanation → next → finish), best-score persistence, badges, reset.
- **GlossaryFaq** — search-filtered glossary (`<details>`), reka-ui Accordion FAQ.

## Fixes vs the original

- `.github/workflows/deploy.yml`: broken `branches: ain]` trigger → `branches: [main]`; artifact path now `dist` (Vite output).

## Verification

- `vue-tsc --noEmit` clean.
- `vite build` succeeds (~390 kB JS / 58 kB CSS).
- 19 Vitest tests pass (market-data determinism/OHLC validity, progress store, UI components).
