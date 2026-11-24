<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "@/components/ui/Button.vue";
import Switch from "@/components/ui/Switch.vue";
import Label from "@/components/ui/Label.vue";
import SimBadge from "./SimBadge.vue";
import SectionShell from "./SectionShell.vue";
import Takeaway from "./Takeaway.vue";
import CandleChart from "./CandleChart.vue";
import { ASSETS, TIMEFRAMES, generateCandles, type AssetKey, type Timeframe } from "@/lib/market-data";
import { HelpCircle, CheckCircle2 } from "lucide-vue-next";
import { cn } from "@/lib/utils";

/* ============ Candle anatomy visual ============ */
const PATTERNS: { name: string; path: string; color: string; read: string }[] = [
  {
    name: "Doji — indecision",
    path: "M15,10 L15,58 M15,30 L15,32 M10,28 Q20,24 25,32 Q15,40 5,30",
    color: "#f0b90b",
    read: "Open and close nearly equal — buyers and sellers fought to a draw. Often appears at turning points.",
  },
  {
    name: "Hammer — possible bottom",
    path: "M15,8 L15,14 M11,14 L19,14 L19,20 L11,20 Z M15,20 L15,56",
    color: "#16c784",
    read: "Long lower wick after a fall: sellers pushed down, buyers slammed the price back. A classic 'maybe the bottom' signal.",
  },
  {
    name: "Engulfing — momentum shift",
    path: "M8,20 L12,20 L12,34 L8,34 Z M20,10 L26,10 L26,40 L20,40 Z",
    color: "#ea3943",
    read: "A large candle that completely covers the previous one — here a red body swallowing a green one, suggesting sellers took control.",
  },
];

/* ============ Section state ============ */
const asset = ref<AssetKey>("stock");
const tf = ref<Timeframe>("1M");
const showMA = ref(true);
const hoverIdx = ref<number | null>(null);

const candles = computed(() => generateCandles(asset.value, tf.value));

const cfg = computed(() => ASSETS[asset.value]);
const first = computed(() => candles.value[0]);
const last = computed(() => candles.value[candles.value.length - 1]);
const changePct = computed(() => ((last.value.close - first.value.open) / first.value.open) * 100);
const up = computed(() => changePct.value >= 0);
const money = (v: number) =>
  `${cfg.value.currency}${v.toLocaleString("en-US", { minimumFractionDigits: cfg.value.decimals, maximumFractionDigits: cfg.value.decimals })}`;

// guided exercise state
const hintLevel = ref(0);
const answered = ref<"none" | "right" | "wrong">("none");
const resetExercise = () => {
  hintLevel.value = 0;
  answered.value = "none";
};

const assetKeys = Object.keys(ASSETS) as AssetKey[];
</script>

<template>
  <SectionShell id="charts" module-id="charts" :number="4" title="Reading Charts">
    <template #intro>
      Charts look intimidating until you learn they only ever show four numbers per period: open,
      high, low and close. Use the interactive chart below — hover any candle, switch assets and
      timeframes, and toggle the moving averages — until OHLC feels like a second language.
    </template>

    <div class="grid min-w-0 gap-6 lg:grid-cols-[1.9fr_1fr]">
      <!-- Chart panel -->
      <div class="bg-card rounded-xl border border-border p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- asset toggle -->
          <div class="bg-muted inline-flex rounded-lg p-1" role="tablist" aria-label="Choose market">
            <button
              v-for="k in assetKeys"
              :key="k"
              role="tab"
              :aria-selected="asset === k"
              :class="
                cn(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                  asset === k ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )
              "
              @click="
                () => {
                  asset = k;
                  hoverIdx = null;
                }
              "
            >
              {{ k === "stock" ? "📈 Stock (ACME)" : "₿ Crypto (DEMO)" }}
            </button>
          </div>
          <div class="flex items-center gap-2">
            <Switch id="ma-toggle" :checked="showMA" @update:checked="(v: boolean) => (showMA = v)" />
            <Label for="ma-toggle" class="text-xs">Moving averages</Label>
          </div>
        </div>

        <!-- timeframe switcher -->
        <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5" role="group" aria-label="Timeframe">
            <Button
              v-for="t in TIMEFRAMES"
              :key="t.key"
              size="sm"
              :variant="tf === t.key ? 'default' : 'outline'"
              :class="cn('h-8 px-3', tf === t.key && 'bg-volt text-white hover:bg-volt/85')"
              :title="t.label"
              @click="
                () => {
                  tf = t.key;
                  hoverIdx = null;
                }
              "
            >
              {{ t.key }}
            </Button>
          </div>
          <SimBadge>{{ cfg.note }}</SimBadge>
        </div>

        <!-- price header -->
        <div class="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-1">
          <span class="font-heading text-lg font-bold sm:text-xl">{{ cfg.label }}</span>
          <span class="tnum text-xl font-bold sm:text-2xl">{{ money(last.close) }}</span>
          <span :class="cn('tnum text-sm font-semibold', up ? 'text-bull' : 'text-bear')">
            {{ up ? "▲" : "▼" }} {{ Math.abs(changePct).toFixed(2) }}% over this window
          </span>
        </div>
        <p class="text-muted-foreground mt-0.5 px-1 text-[11px]">
          {{ TIMEFRAMES.find((t) => t.key === tf)?.label }} · hover any candle for OHLC + volume
        </p>

        <div class="mt-3 text-foreground">
          <CandleChart :candles="candles" :showMA="showMA" :asset="asset" :hover-idx="hoverIdx" @hover="(i) => (hoverIdx = i)" />
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-4 px-1 text-[11px] text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <span class="h-2 w-4 rounded bg-[#16c784]" /> Close ≥ Open
          </span>
          <span class="flex items-center gap-1.5">
            <span class="h-2 w-4 rounded bg-[#ea3943]" /> Close &lt; Open
          </span>
          <template v-if="showMA">
            <span class="flex items-center gap-1.5">
              <span class="h-0.5 w-4 bg-[#3b96ff]" /> MA-7
            </span>
            <span class="flex items-center gap-1.5">
              <span class="h-0.5 w-4 bg-[#f0b90b]" /> MA-25
            </span>
          </template>
        </div>
      </div>

      <!-- Side explainer -->
      <div class="space-y-4">
        <div class="bg-card rounded-xl border border-border p-5">
          <h4 class="font-heading text-sm font-semibold">Anatomy of a candle</h4>
          <div class="mt-2 flex items-start justify-center gap-8">
            <svg viewBox="0 0 120 210" class="h-44 w-auto" role="img" aria-label="Green bullish candle anatomy">
              <line x1="60" y1="10" x2="60" y2="200" stroke="#16c784" stroke-width="2" />
              <rect x="42" y="55" width="36" height="105" rx="2" fill="#16c784" />
              <text x="60" y="8" text-anchor="middle" class="fill-current text-[10px] font-semibold">High</text>
              <text x="88" y="62" text-anchor="start" class="fill-current text-[10px]">Close</text>
              <text x="88" y="163" text-anchor="start" class="fill-current text-[10px]">Open</text>
              <text x="60" y="209" text-anchor="middle" class="fill-current text-[10px] font-semibold">Low</text>
              <text x="14" y="112" text-anchor="middle" class="fill-current text-[11px] font-bold text-[#16c784]">BULL</text>
            </svg>
            <svg viewBox="0 0 120 210" class="h-44 w-auto" role="img" aria-label="Red bearish candle anatomy">
              <line x1="60" y1="10" x2="60" y2="200" stroke="#ea3943" stroke-width="2" />
              <rect x="42" y="50" width="36" height="105" rx="2" fill="#ea3943" />
              <text x="60" y="8" text-anchor="middle" class="fill-current text-[10px] font-semibold">High</text>
              <text x="88" y="57" text-anchor="start" class="fill-current text-[10px]">Open</text>
              <text x="88" y="158" text-anchor="start" class="fill-current text-[10px]">Close</text>
              <text x="60" y="209" text-anchor="middle" class="fill-current text-[10px] font-semibold">Low</text>
              <text x="14" y="110" text-anchor="middle" class="fill-current text-[11px] font-bold text-[#ea3943]">BEAR</text>
            </svg>
          </div>
          <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
            The <strong class="text-foreground">body</strong> spans open → close; the thin
            <strong class="text-foreground">wicks</strong> reach the high and low. Green (bullish)
            closes above its open; red (bearish) closes below.
          </p>
        </div>

        <div class="bg-card rounded-xl border border-border p-5">
          <h4 class="font-heading text-sm font-semibold">Trends, support &amp; resistance</h4>
          <ul class="text-muted-foreground mt-2 space-y-2 text-xs leading-relaxed">
            <li>
              <strong class="text-foreground">Trend</strong> — the general direction. Higher
              highs + higher lows = uptrend; the reverse = downtrend.
            </li>
            <li>
              <strong class="text-foreground">Support</strong> — a floor level where buying has
              repeatedly stopped declines.
            </li>
            <li>
              <strong class="text-foreground">Resistance</strong> — a ceiling where selling has
              repeatedly capped rallies.
            </li>
            <li>
              <strong class="text-foreground">Moving average</strong> — the average close of the
              last N candles, drawn as a smooth line. It filters noise and shows the underlying
              direction.
            </li>
          </ul>
        </div>

        <div class="rounded-xl border border-volt/40 bg-volt/10 p-5">
          <h4 class="font-heading flex items-center gap-2 text-sm font-semibold">
            <HelpCircle class="text-volt h-4 w-4" aria-hidden /> Guided exercise
          </h4>
          <p class="mt-2 text-xs leading-relaxed">
            Hover across the chart from left to right and find the <strong>lowest low</strong> of
            the window. Click the answer:
          </p>
          <div class="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs font-semibold">
            <button
              v-for="(opt, i) in ['Start of window', 'Middle third', 'End of window']"
              :key="opt"
              class="bg-card hover:border-volt rounded-lg border border-border px-2 py-2.5 transition-colors"
              @click="
                () => {
                  answered = i === 0 ? 'right' : 'wrong';
                  if (i !== 0) hintLevel = 1;
                }
              "
            >
              {{ opt }}
            </button>
          </div>
          <p v-if="answered === 'none' && hintLevel === 0" class="text-muted-foreground mt-2.5 text-[11px] leading-relaxed">
            Hint 1: sort the candles mentally by their <em>low</em> wick — where does the deepest
            one sit?
          </p>
          <p v-if="answered === 'wrong'" class="mt-2.5 rounded-md bg-bear/10 p-2 text-[11px] leading-relaxed text-bear">
            Not quite — compare candle lows by hovering. Notice the trend: in this window prices
            generally drift upward, so the deepest low usually sits near the beginning. Try again!
          </p>
          <p v-if="answered === 'right'" class="text-bull mt-2.5 flex items-start gap-1.5 rounded-md bg-bull/10 p-2 text-[11px] leading-relaxed">
            <CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0" /> Correct! In an uptrend window,
            the lowest low typically appears near the start. Now switch to the 1D timeframe and
            check whether that still holds.
          </p>
          <Button v-if="answered !== 'none'" size="sm" variant="outline" class="mt-2.5 h-7" @click="resetExercise">
            Reset exercise
          </Button>
        </div>
      </div>
    </div>

    <!-- Patterns -->
    <div>
      <h3 class="font-heading text-xl font-semibold">Three patterns beginners actually remember</h3>
      <p class="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
        Chart patterns are shapes that recur because human greed and fear recur. They are
        tendencies, never guarantees — but knowing these three makes charts feel far less random.
      </p>
      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        <div v-for="p in PATTERNS" :key="p.name" class="bg-card rounded-xl border border-border p-4 text-center">
          <svg viewBox="0 0 34 62" class="mx-auto h-20" role="img" :aria-label="p.name">
            <path :d="p.path" :fill="p.color" :stroke="p.color" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <p class="mt-1 text-sm font-semibold">{{ p.name }}</p>
          <p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">{{ p.read }}</p>
        </div>
      </div>
    </div>

    <Takeaway>
      A candle is just a story compressed into four numbers. Learn to read OHLC + volume, add a
      moving average for direction, and remember: patterns describe probabilities, not certainties.
    </Takeaway>
  </SectionShell>
</template>
