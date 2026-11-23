<script setup lang="ts">
import { computed } from "vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import SimBadge from "./SimBadge.vue";
import { heroSeries, TICKER_ITEMS } from "@/lib/market-data";
import { ArrowRight, BookOpen } from "lucide-vue-next";

const series = computed(() => heroSeries(20260301, 110));
const W = 900;
const H = 320;
const min = computed(() => Math.min(...series.value));
const max = computed(() => Math.max(...series.value));
const pad = 12;

const pts = computed(() =>
  series.value.map((v, i) => {
    const x = (i / (series.value.length - 1)) * W;
    const y = H - pad - ((v - min.value) / (max.value - min.value)) * (H - pad * 2);
    return [x, y] as const;
  })
);
const line = computed(() => pts.value.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "));
const area = computed(() => `${line.value} L${W},${H} L0,${H} Z`);
const last = computed(() => pts.value[pts.value.length - 1]);
const first = computed(() => pts.value[0]);
const isUp = computed(() => series.value[series.value.length - 1] >= series.value[0]);

const tickerItems = computed(() => [...TICKER_ITEMS, ...TICKER_ITEMS]);
</script>

<template>
  <div id="top" class="bg-market-grid relative overflow-hidden">
    <div class="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-volt/10 blur-3xl" aria-hidden />
    <div class="relative mx-auto max-w-6xl 2xl:max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge variant="outline" class="mb-5 whitespace-normal border-gold/50 text-gold">
            Zero experience required · 100% practice, 0% real money
          </Badge>
          <h1 class="font-heading text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Understand the Market.
            <span class="text-volt">Build Your Financial Knowledge.</span>
          </h1>
          <p class="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            Learn stocks, crypto, investing and market fundamentals step by step — even if you are
            starting from zero. Interactive lessons, plain-language explanations and a risk-free
            simulator with fictional capital.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button as-child size="lg" class="bg-volt text-white hover:bg-volt/85 sm:flex-1 lg:flex-none">
              <a href="#fundamentals">
                Start Learning <ArrowRight class="ml-1 h-4 w-4" aria-hidden />
              </a>
            </Button>
            <Button as-child size="lg" variant="outline" class="sm:flex-1 lg:flex-none">
              <a href="#fundamentals">
                <BookOpen class="mr-1.5 h-4 w-4" aria-hidden /> Explore Market Basics
              </a>
            </Button>
          </div>
          <p class="mt-6 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Educational platform. All prices, charts and portfolios are simulated or illustrative —
            never live market data. Nothing here is investment advice.
          </p>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700 } }"
          class="bg-card/80 rounded-2xl border border-border p-3 shadow-xl backdrop-blur sm:p-5"
        >
          <div class="mb-2 flex items-center justify-between px-1">
            <div>
              <p class="font-heading text-sm font-semibold">The market in motion</p>
              <p class="text-muted-foreground text-xs">Fictional asset · price over time</p>
            </div>
            <span class="tnum text-bull text-sm font-semibold">+18.4%</span>
          </div>
          <div class="relative">
            <svg
              :viewBox="`0 0 ${W} ${H}`"
              class="h-auto w-full"
              role="img"
              aria-label="Animated illustrative chart of fictional price movement"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="isUp ? '#16c784' : '#ea3943'" stop-opacity="0.28" />
                  <stop offset="100%" :stop-color="isUp ? '#16c784' : '#ea3943'" stop-opacity="0" />
                </linearGradient>
              </defs>
              <!-- horizontal gridlines -->
              <line
                v-for="f in [0.25, 0.5, 0.75]"
                :key="f"
                x1="0"
                :x2="W"
                :y1="H * f"
                :y2="H * f"
                stroke="currentColor"
                stroke-opacity="0.08"
                stroke-dasharray="4 6"
              />
              <path class="hero-area" :d="area" fill="url(#hero-fill)" />
              <path
                class="hero-line"
                :d="line"
                fill="none"
                :stroke="isUp ? '#16c784' : '#ea3943'"
                stroke-width="2.5"
                stroke-linecap="round"
                pathLength="1"
              />
              <circle
                class="hero-first-dot"
                :cx="first[0]"
                :cy="first[1]"
                r="4"
                :fill="isUp ? '#16c784' : '#ea3943'"
              />
              <circle
                class="hero-last-dot animate-pulse-dot"
                :cx="last[0]"
                :cy="last[1]"
                r="5"
                :fill="isUp ? '#16c784' : '#ea3943'"
              />
            </svg>
            <div class="absolute top-3 right-3">
              <SimBadge>Illustrative price movement</SimBadge>
            </div>
          </div>
          <div class="mt-2 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
            <span>Every dip and peak here teaches a lesson you'll meet later.</span>
            <span class="tnum">Fictional data</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticker -->
    <div class="overflow-hidden border-y border-border bg-card/60 py-2.5" aria-label="Illustrative ticker of fictional instruments">
      <div class="animate-ticker flex w-max gap-10 whitespace-nowrap">
        <span v-for="(t, i) in tickerItems" :key="i" class="tnum flex items-center gap-2 text-xs sm:text-sm">
          <span class="text-muted-foreground">{{ t.symbol }}</span>
          <span class="font-semibold">{{ t.price }}</span>
          <span :class="t.change > 0 ? 'text-bull' : t.change < 0 ? 'text-bear' : 'text-muted-foreground'">
            {{ t.change > 0 ? "▲" : t.change < 0 ? "▼" : "—" }} {{ Math.abs(t.change).toFixed(1) }}%
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Replicates the original framer-motion pathLength / opacity animations */
.hero-area {
  opacity: 0;
  animation: hero-fade-in 1s ease forwards;
  animation-delay: 1.6s;
}
.hero-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: hero-draw 2.2s ease-in-out forwards;
}
.hero-first-dot {
  opacity: 0;
  animation: hero-flash 2.2s linear forwards;
}
.hero-last-dot {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation: hero-pop 0.35s ease-out forwards;
  animation-delay: 2.15s;
}
@keyframes hero-fade-in {
  to {
    opacity: 1;
  }
}
@keyframes hero-draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes hero-flash {
  0% {
    opacity: 0;
  }
  2% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes hero-pop {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
