<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Slider from "@/components/ui/Slider.vue";
import SimBadge from "./SimBadge.vue";
import SectionShell from "./SectionShell.vue";
import Takeaway from "./Takeaway.vue";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, Trash2 } from "lucide-vue-next";

/* ---------- Fictional assets on the paper-trading desk ---------- */

type DeskAsset = {
  key: string;
  name: string;
  ticker: string;
  price: number;
  decimals: number;
  volNote: string;
};

const DESK_ASSETS: DeskAsset[] = [
  { key: "acme", name: "Acme Corp (fictional stock)", ticker: "ACME", price: 142.0, decimals: 2, volNote: "Typical stock volatility" },
  { key: "etf", name: "Everything ETF (fictional)", ticker: "ALLX", price: 51.1, decimals: 2, volNote: "Diversified basket" },
  { key: "demo", name: "DemoCoin (fictional crypto)", ticker: "DEMO", price: 31250, decimals: 0, volNote: "High volatility!" },
  { key: "bond", name: "Bond fund (fictional)", ticker: "BND", price: 98.6, decimals: 2, volNote: "Low volatility" },
];

type ScenarioKey = "bull" | "bear" | "crash" | "sideways";

const SCENARIOS: Record<ScenarioKey, { label: string; mult: number[]; blurb: string; color: string }> = {
  bull: {
    label: "Bull market",
    mult: [1.28, 1.14, 1.65, 1.03],
    blurb: "Optimism lifts everything — risky assets fly highest.",
    color: "text-bull",
  },
  bear: {
    label: "Bear market",
    mult: [0.78, 0.9, 0.52, 0.96],
    blurb: "Fear dominates. Crypto historically falls hardest.",
    color: "text-bear",
  },
  crash: {
    label: "Flash crash",
    mult: [0.62, 0.82, 0.38, 0.9],
    blurb: "Panic selling — even good assets get dumped.",
    color: "text-bear",
  },
  sideways: {
    label: "Sideways",
    mult: [1.01, 1.0, 0.98, 1.005],
    blurb: "The market goes nowhere. Boredom is part of investing.",
    color: "text-muted-foreground",
  },
};

const START_CASH = 10_000;

type Trade = { id: number; side: "BUY" | "SELL"; ticker: string; qty: number; price: number; usd: number };

function fmtUsd(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
function fmtPrice(v: number, d: number) {
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
}

const scenarioKeys = Object.keys(SCENARIOS) as ScenarioKey[];

/* ---------- Paper trading desk ---------- */
const cash = ref(START_CASH);
const qty = ref<Record<string, number>>({ acme: 0, etf: 0, demo: 0, bond: 0 });
const prices = ref<Record<string, number>>(Object.fromEntries(DESK_ASSETS.map((a) => [a.key, a.price])));
const amount = ref("500");
const log = ref<Trade[]>([]);
const scenario = ref<ScenarioKey | null>(null);
const flash = ref<string | null>(null);
let nextId = 1;
let flashTimer: ReturnType<typeof setTimeout> | null = null;

const holdingsValue = computed(() => DESK_ASSETS.reduce((s, a) => s + (qty.value[a.key] ?? 0) * prices.value[a.key], 0));
const total = computed(() => cash.value + holdingsValue.value);
const pnl = computed(() => total.value - START_CASH);
const pnlPct = computed(() => (pnl.value / START_CASH) * 100);
const amt = computed(() => Math.max(0, Math.min(cash.value, parseFloat(amount.value) || 0)));

function applyScenario(key: ScenarioKey) {
  scenario.value = key;
  DESK_ASSETS.forEach((a, i) => {
    prices.value[a.key] = +(a.price * SCENARIOS[key].mult[i]).toFixed(a.decimals);
  });
  flash.value = `Simulated a ${SCENARIOS[key].label.toLowerCase()} — watch your portfolio react.`;
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(() => (flash.value = null), 3500);
}

function trade(a: DeskAsset, side: "BUY" | "SELL") {
  const price = prices.value[a.key];
  if (side === "BUY") {
    if (amt.value < 0.01) return;
    const bought = amt.value / price;
    cash.value = +(cash.value - amt.value).toFixed(2);
    qty.value[a.key] = (qty.value[a.key] ?? 0) + bought;
    log.value = [{ id: nextId++, side, ticker: a.ticker, qty: bought, price, usd: amt.value }, ...log.value].slice(0, 12);
  } else {
    const held = qty.value[a.key] ?? 0;
    if (held < 1e-9) return;
    const proceeds = held * price;
    cash.value = +(cash.value + proceeds).toFixed(2);
    qty.value[a.key] = 0;
    log.value = [{ id: nextId++, side, ticker: a.ticker, qty: held, price, usd: proceeds }, ...log.value].slice(0, 12);
  }
}

function reset() {
  cash.value = START_CASH;
  qty.value = { acme: 0, etf: 0, demo: 0, bond: 0 };
  prices.value = Object.fromEntries(DESK_ASSETS.map((a) => [a.key, a.price]));
  log.value = [];
  scenario.value = null;
}

function heldLabel(held: number): string {
  return held < 0.0001 ? held.toExponential(2) : held.toLocaleString("en-US", { maximumFractionDigits: held < 1 ? 6 : 2 });
}
function logQtyLabel(q: number): string {
  return q < 0.0001 ? q.toExponential(2) : q.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
function logPriceDecimals(t: Trade): number {
  return t.price < 1000 ? 2 : 0;
}

/* ---------- Allocation lab ---------- */

const BUCKETS = [
  { key: "stock", label: "Fictional stock", mult: { bull: 1.28, bear: 0.78, crash: 0.62, sideways: 1.01 } },
  { key: "etf", label: "Diversified ETF", mult: { bull: 1.14, bear: 0.9, crash: 0.82, sideways: 1.0 } },
  { key: "crypto", label: "Fictional crypto", mult: { bull: 1.65, bear: 0.52, crash: 0.38, sideways: 0.98 } },
  { key: "bonds", label: "Bonds", mult: { bull: 1.03, bear: 0.96, crash: 0.9, sideways: 1.005 } },
  { key: "cash", label: "Cash", mult: { bull: 1.0, bear: 1.0, crash: 1.0, sideways: 1.0 } },
] as const;

const weights = ref<number[]>([30, 30, 20, 10, 10]);
const labScenario = ref<ScenarioKey>("bull");

const sum = computed(() => weights.value.reduce((a, b) => a + b, 0));
const normalized = computed(() => weights.value.map((w) => (sum.value === 0 ? 0 : (w / sum.value) * 100)));
const outcome = computed(() =>
  BUCKETS.reduce((s, b, i) => s + (normalized.value[i] / 100) * START_CASH * b.mult[labScenario.value], 0)
);
const ret = computed(() => ((outcome.value - START_CASH) / START_CASH) * 100);
const concentration = computed(() => Math.max(...normalized.value));

function setBucket(i: number, v: number) {
  weights.value[i] = v;
}

const markerLeft = computed(() => `${Math.min(96, Math.max(1, 50 + (ret.value / 70) * 45))}%`);
</script>

<template>
  <SectionShell id="simulation" module-id="simulation" :number="5" title="Learn by Simulation">
    <template #intro>
      Theory becomes intuition through practice. Below you get
      <strong class="text-foreground">{{ fmtUsd(START_CASH) }} of fictional capital</strong> — no
      deposits, no real money, no accounts. Buy and sell fictional assets, throw bull and bear
      markets at your portfolio, and see how different asset allocations behave under stress.
    </template>

    <!-- Paper trading desk -->
    <div class="bg-card rounded-xl border border-border p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="font-heading flex items-center gap-2 text-xl font-semibold">
          <Wallet class="text-volt h-5 w-5" aria-hidden /> The paper trading desk
        </h3>
        <SimBadge>Fictional capital · nothing here is real money</SimBadge>
      </div>

      <!-- Portfolio summary -->
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Total portfolio value</p>
          <p class="tnum mt-1 text-xl font-bold sm:text-2xl">{{ fmtUsd(total) }}</p>
        </div>
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Cash available</p>
          <p class="tnum mt-1 text-xl font-bold sm:text-2xl">{{ fmtUsd(cash) }}</p>
        </div>
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Hypothetical P/L</p>
          <p :class="cn('tnum mt-1 text-xl font-bold sm:text-2xl', pnl >= 0 ? 'text-bull' : 'text-bear')">
            {{ pnl >= 0 ? "+" : "" }}{{ fmtUsd(pnl) }} ({{ pnlPct >= 0 ? "+" : "" }}{{ pnlPct.toFixed(2) }}%)
          </p>
        </div>
      </div>

      <!-- Scenario buttons -->
      <div class="mt-4">
        <p class="mb-2 text-xs font-medium text-muted-foreground">
          Step 1 — throw a market scenario at your portfolio:
        </p>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="k in scenarioKeys"
            :key="k"
            size="sm"
            :variant="scenario === k ? 'default' : 'outline'"
            :class="cn('h-9', scenario === k && 'bg-volt text-white hover:bg-volt/85')"
            @click="applyScenario(k)"
          >
            <TrendingUp v-if="k === 'bull' || k === 'sideways'" class="mr-1 h-3.5 w-3.5" />
            <TrendingDown v-else class="mr-1 h-3.5 w-3.5" />
            {{ SCENARIOS[k].label }}
          </Button>
          <Button size="sm" variant="ghost" class="h-9" @click="reset">
            <Trash2 class="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
        <Transition name="blurb">
          <p v-if="scenario" :key="scenario" class="text-muted-foreground mt-2 text-xs">
            {{ SCENARIOS[scenario].blurb }}
          </p>
        </Transition>
        <p v-if="flash" class="text-gold mt-2 text-xs">{{ flash }}</p>
      </div>

      <!-- Assets -->
      <p class="text-muted-foreground mt-5 mb-2 text-xs font-medium">
        Step 2 — buy and sell with your fictional ${{ START_CASH.toLocaleString() }}:
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="a in DESK_ASSETS" :key="a.key" class="rounded-lg border border-border p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold">
                <span class="tnum mr-2 rounded bg-muted px-1.5 py-0.5 text-xs">{{ a.ticker }}</span>
                {{ a.name }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-[11px]">{{ a.volNote }}</p>
            </div>
            <p class="tnum text-lg font-bold">{{ fmtPrice(prices[a.key], a.decimals) }}</p>
          </div>
          <p class="tnum text-muted-foreground mt-2 text-xs">
            Holding:
            {{
              (qty[a.key] ?? 0) > 0
                ? `${heldLabel(qty[a.key])} units · ${fmtUsd((qty[a.key] ?? 0) * prices[a.key])}`
                : "nothing yet"
            }}
          </p>
          <div class="mt-2.5 flex gap-2">
            <Input
              type="number"
              :min="0"
              :model-value="amount"
              class="tnum h-9 min-w-0 flex-1"
              :aria-label="`Amount in dollars to trade ${a.ticker}`"
              @update:model-value="(v) => (amount = v)"
            />
            <Button size="sm" class="h-9 shrink-0 bg-bull px-2.5 text-white hover:bg-bull/85 sm:px-3" @click="trade(a, 'BUY')">
              Buy
            </Button>
            <Button
              size="sm"
              variant="outline"
              class="h-9 shrink-0 border-bear/50 px-2.5 text-bear hover:bg-bear/10 sm:px-3"
              :disabled="(qty[a.key] ?? 0) <= 0"
              @click="trade(a, 'SELL')"
            >
              Sell
            </Button>
          </div>
        </div>
      </div>

      <!-- Trade log -->
      <div class="mt-5">
        <p class="mb-2 text-xs font-medium text-muted-foreground">Trade log (latest first)</p>
        <div class="custom-scrollbar max-h-40 overflow-y-auto rounded-lg border border-border">
          <p v-if="log.length === 0" class="text-muted-foreground p-3 text-xs">No trades yet — your ledger is empty.</p>
          <ul v-else class="divide-y divide-border text-xs">
            <li v-for="t in log" :key="t.id" class="tnum flex items-center justify-between px-3 py-2">
              <span :class="cn('font-bold', t.side === 'BUY' ? 'text-bull' : 'text-bear')">{{ t.side }}</span>
              <span class="font-semibold">{{ t.ticker }}</span>
              <span class="text-muted-foreground">
                {{ logQtyLabel(t.qty) }} @ {{ fmtPrice(t.price, logPriceDecimals(t)) }}
              </span>
              <span class="font-medium">{{ fmtUsd(t.usd) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Allocation lab -->
    <div class="bg-card rounded-xl border border-border p-5 sm:p-6">
      <h3 class="font-heading text-xl font-semibold">The allocation lab</h3>
      <p class="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        Drag the sliders to split {{ fmtUsd(START_CASH) }} across five buckets, then pick a market
        scenario. Notice how concentration in volatile buckets swings the result dramatically in
        <em>both</em> directions.
      </p>

      <div class="mt-4 space-y-3.5">
        <div v-for="(b, i) in BUCKETS" :key="b.key" class="flex items-center gap-2 sm:gap-3">
          <span class="w-24 shrink-0 text-xs font-medium sm:w-44 sm:text-sm">{{ b.label }}</span>
          <Slider
            :model-value="[weights[i]]"
            :min="0"
            :max="100"
            :step="5"
            class="flex-1"
            :aria-label="`${b.label} allocation percent`"
            @update:model-value="(v) => setBucket(i, v[0])"
          />
          <span class="tnum w-12 text-right text-xs font-semibold">{{ normalized[i].toFixed(0) }}%</span>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Scenario">
        <Button
          v-for="k in scenarioKeys"
          :key="k"
          size="sm"
          :variant="labScenario === k ? 'default' : 'outline'"
          :class="cn('h-8', labScenario === k && 'bg-volt text-white hover:bg-volt/85')"
          @click="labScenario = k"
        >
          {{ SCENARIOS[k].label }}
        </Button>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Portfolio value after scenario</p>
          <p class="tnum mt-1 text-xl font-bold sm:text-2xl">{{ fmtUsd(outcome) }}</p>
        </div>
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Hypothetical return</p>
          <p :class="cn('tnum mt-1 text-xl font-bold sm:text-2xl', ret >= 0 ? 'text-bull' : 'text-bear')">
            {{ ret >= 0 ? "+" : "" }}{{ ret.toFixed(1) }}%
          </p>
        </div>
        <div class="bg-muted/50 rounded-lg p-3.5 sm:p-4">
          <p class="text-muted-foreground text-xs">Concentration (largest bucket)</p>
          <p
            :class="
              cn(
                'tnum mt-1 text-xl font-bold sm:text-2xl',
                concentration >= 60 ? 'text-bear' : concentration >= 40 ? 'text-gold' : 'text-bull'
              )
            "
          >
            {{ concentration.toFixed(0) }}%
          </p>
          <p class="text-muted-foreground mt-1 text-[11px]">
            {{
              concentration >= 60
                ? "High concentration — big swings expected."
                : concentration >= 40
                  ? "Moderate concentration."
                  : "Well spread — smoother ride."
            }}
          </p>
        </div>
      </div>

      <!-- outcome bar -->
      <div class="mt-5">
        <p class="mb-1.5 text-xs text-muted-foreground">
          Visualize the outcome: worst plausible → your scenario → best plausible
        </p>
        <div class="relative h-8 overflow-hidden rounded-lg border border-border">
          <div class="absolute inset-y-0 left-0 w-[45%] bg-bear/20" aria-hidden />
          <div class="absolute inset-y-0 right-0 w-[45%] bg-bull/20" aria-hidden />
          <div class="absolute inset-y-0 left-[45%] w-[10%] bg-muted" aria-hidden />
          <div class="absolute inset-y-0 w-1.5 rounded bg-volt transition-all duration-500" :style="{ left: markerLeft }" aria-hidden />
          <span class="tnum absolute inset-y-0 left-2 flex items-center text-[10px] font-semibold text-bear">−55%</span>
          <span class="tnum absolute inset-y-0 right-2 flex items-center text-[10px] font-semibold text-bull">+65%</span>
        </div>
        <p class="text-muted-foreground mt-1.5 text-[11px]">
          Marker shows your {{ SCENARIOS[labScenario].label.toLowerCase() }} outcome against a rough range of
          historical-style scenarios (illustrative, not predictive).
        </p>
      </div>
    </div>

    <Takeaway>
      Volatility is not a flaw — it's the price of admission. The simulator shows the same
      portfolio can look brilliant in a bull market and brutal in a crash; your job as a learner is
      to find an allocation you could actually live with.
    </Takeaway>
  </SectionShell>
</template>

<style scoped>
.blurb-enter-active {
  transition: all 0.25s ease;
}
.blurb-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
