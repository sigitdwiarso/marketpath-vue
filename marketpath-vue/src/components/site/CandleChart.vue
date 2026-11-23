<script setup lang="ts">
import { computed } from "vue";
import { ASSETS, movingAverage, type AssetKey, type Candle } from "@/lib/market-data";

const CHART_W = 820;
const CHART_H = 380;
const PRICE_H = 280;
const VOL_TOP = 300;
const VOL_H = 66;
const PAD_R = 8;

const props = defineProps<{
  candles: Candle[];
  showMA: boolean;
  asset: AssetKey;
  hoverIdx: number | null;
}>();

const emit = defineEmits<{ (e: "hover", idx: number | null): void }>();

const ma7 = computed(() => movingAverage(props.candles, 7));
const ma25 = computed(() => movingAverage(props.candles, 25));

const bounds = computed(() => {
  const l = Math.min(...props.candles.map((c) => c.low));
  const h = Math.max(...props.candles.map((c) => c.high));
  const pad = (h - l) * 0.08;
  return { lo: l - pad, hi: h + pad };
});
const maxVol = computed(() => Math.max(...props.candles.map((c) => c.volume)));

const n = computed(() => props.candles.length);
const slot = computed(() => (CHART_W - PAD_R) / n.value);
const bodyW = computed(() => Math.max(3, Math.min(16, slot.value * 0.62)));

const yOf = (price: number) => 14 + (1 - (price - bounds.value.lo) / (bounds.value.hi - bounds.value.lo)) * (PRICE_H - 14);
const xOf = (i: number) => i * slot.value + slot.value / 2;
const vH = (v: number) => (v / maxVol.value) * (VOL_H - 8);

const linePath = (series: (number | null)[]) =>
  series
    .map((v, i) => (v === null ? null : `${i === 0 || series[i - 1] === null ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`))
    .filter(Boolean)
    .join(" ");

const gridPrices = computed(() => {
  const out: number[] = [];
  for (let i = 0; i <= 4; i++) out.push(bounds.value.lo + ((bounds.value.hi - bounds.value.lo) * i) / 4);
  return out;
});

const decimals = computed(() => ASSETS[props.asset].decimals);
const fmt = (v: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals.value, maximumFractionDigits: decimals.value });

function tooltipLeft(idx: number): string {
  const pctPos = (xOf(idx) / CHART_W) * 100;
  return `${idx + 0.5 < n.value * 0.55 ? pctPos + 3 : pctPos - 32}%`;
}
</script>

<template>
  <div class="relative">
    <svg
      :viewBox="`0 0 ${CHART_W} ${CHART_H}`"
      class="w-full"
      role="img"
      aria-label="Interactive candlestick chart of simulated prices"
      @mouseleave="emit('hover', null)"
    >
      <!-- gridlines + price axis -->
      <g v-for="p in gridPrices" :key="p">
        <line x1="0" :x2="CHART_W" :y1="yOf(p)" :y2="yOf(p)" stroke="currentColor" stroke-opacity="0.09" stroke-dasharray="3 6" />
        <text :x="CHART_W - 4" :y="yOf(p) - 4" text-anchor="end" class="fill-current text-[11px] opacity-50 tnum">
          {{ fmt(p) }}
        </text>
      </g>

      <!-- volume bars -->
      <rect
        v-for="(c, i) in candles"
        :key="`v${i}`"
        :x="xOf(i) - bodyW / 2"
        :y="VOL_TOP + (VOL_H - vH(c.volume))"
        :width="bodyW"
        :height="vH(c.volume)"
        :fill="c.close >= c.open ? '#16c784' : '#ea3943'"
        :opacity="hoverIdx === null || hoverIdx === i ? 0.35 : 0.12"
        rx="1"
      />
      <text :x="4" :y="VOL_TOP + 12" class="fill-current text-[10px] opacity-45">Volume</text>

      <!-- MA lines -->
      <template v-if="showMA">
        <path :d="linePath(ma7)" fill="none" stroke="#3b96ff" stroke-width="1.8" opacity="0.9" />
        <path :d="linePath(ma25)" fill="none" stroke="#f0b90b" stroke-width="1.8" opacity="0.9" />
      </template>

      <!-- candles -->
      <g
        v-for="(c, i) in candles"
        :key="`c${i}`"
        v-motion
        :initial="{ opacity: 0, y: -14 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: i * 12, duration: 300 } }"
        @mouseenter="emit('hover', i)"
      >
        <rect :x="xOf(i) - slot / 2" y="0" :width="slot" :height="CHART_H" fill="transparent" />
        <line :x1="xOf(i)" :x2="xOf(i)" :y1="yOf(c.high)" :y2="yOf(c.low)" :stroke="c.close >= c.open ? '#16c784' : '#ea3943'" stroke-width="1.6" />
        <rect
          :x="xOf(i) - bodyW / 2"
          :y="Math.min(yOf(c.open), yOf(c.close))"
          :width="bodyW"
          :height="Math.max(2, Math.abs(yOf(c.close) - yOf(c.open)))"
          :fill="c.close >= c.open ? '#16c784' : '#ea3943'"
          :opacity="hoverIdx === i ? 1 : 0.92"
          :stroke="hoverIdx === i ? 'currentColor' : 'none'"
          stroke-opacity="0.4"
          rx="1.5"
        />
      </g>

      <!-- hover crosshair -->
      <line
        v-if="hoverIdx !== null"
        :x1="xOf(hoverIdx)"
        :x2="xOf(hoverIdx)"
        y1="0"
        :y2="VOL_TOP + VOL_H"
        stroke="currentColor"
        stroke-opacity="0.35"
        stroke-dasharray="3 4"
      />
    </svg>

    <!-- tooltip -->
    <div
      v-if="hoverIdx !== null && candles[hoverIdx]"
      class="bg-popover pointer-events-none absolute top-2 z-10 w-36 rounded-lg border border-border p-3 text-xs shadow-xl sm:w-44"
      :style="{ left: tooltipLeft(hoverIdx) }"
    >
      <p class="font-semibold">{{ candles[hoverIdx].time }}</p>
      <dl class="tnum mt-1.5 space-y-0.5">
        <div v-for="k in (['open', 'high', 'low', 'close'] as const)" :key="k" class="flex justify-between">
          <dt class="text-muted-foreground capitalize">{{ k }}</dt>
          <dd class="font-medium">{{ fmt(candles[hoverIdx][k]) }}</dd>
        </div>
        <div class="flex justify-between border-t border-border pt-0.5">
          <dt class="text-muted-foreground">Volume</dt>
          <dd class="font-medium">{{ candles[hoverIdx].volume.toLocaleString() }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
