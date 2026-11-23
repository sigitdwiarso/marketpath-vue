<script setup lang="ts">
import SectionShell from "./SectionShell.vue";
import Term from "./Term.vue";
import Takeaway from "./Takeaway.vue";
import InfoCard from "./InfoCard.vue";
import { Building2, Coins, ArrowLeftRight, Handshake, ShieldAlert, Scale, Users, Store } from "lucide-vue-next";

const flowSteps = [
  {
    title: "1. Buyers & sellers",
    text: "Buyers place bids (what they'll pay); sellers place asks (what they'll accept).",
    icon: "users",
  },
  {
    title: "2. The exchange",
    text: "A marketplace matches bids and asks electronically — the NYSE for stocks, platforms like crypto exchanges for coins.",
    icon: "store",
  },
  {
    title: "3. A trade happens",
    text: "When a buyer and seller agree, a trade executes and everyone can see the last price.",
    icon: "trade",
  },
  {
    title: "4. Price discovery",
    text: "Millions of trades later, the price continuously reflects the balance of supply and demand.",
    icon: "scale",
  },
];
</script>

<template>
  <SectionShell id="fundamentals" module-id="fundamentals" :number="1" title="Market Fundamentals">
    <template #intro>
      Before touching a single chart, let's answer the questions everything else builds on:
      what exactly is a <Term id="stock">stock</Term>, what makes <Term id="blockchain">crypto</Term>
      different, and where do prices actually come from? By the end of this lesson you'll
      understand the cast of characters in a market — buyers, sellers, exchanges and brokers — and
      the single most important relationship in finance: the trade-off between risk and return.
    </template>

    <!-- Stock vs Crypto side by side -->
    <div>
      <h3 class="font-heading text-xl font-semibold">Stocks vs. crypto — the 60-second version</h3>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <InfoCard title="What is a stock?">
          <template #icon><Building2 class="text-volt h-5 w-5" aria-hidden /></template>
          <p>
            A stock is a <strong class="text-foreground">share of ownership</strong> in a real
            company. When the company earns profits and grows, your slice of it tends to become more
            valuable. Some companies also share profits directly through
            <Term id="dividend">dividends</Term>.
          </p>
          <p>
            Stocks trade on regulated exchanges during fixed market hours. Ownership is recorded by
            central institutions, and companies disclose financial reports the public can inspect.
          </p>
        </InfoCard>
        <InfoCard title="What is cryptocurrency?">
          <template #icon><Coins class="text-gold h-5 w-5" aria-hidden /></template>
          <p>
            Cryptocurrency is <strong class="text-foreground">digital money</strong> recorded on a
            <Term id="blockchain">blockchain</Term> — a shared ledger copied across thousands of
            computers instead of managed by one bank. Bitcoin, the first crypto, was created in 2009
            as money that no single authority controls.
          </p>
          <p>
            Crypto trades 24/7 with no closing bell. That means prices can — and do — move while you
            sleep, which cuts both ways: opportunity and risk around the clock.
          </p>
        </InfoCard>
      </div>
    </div>

    <!-- How markets work -->
    <div>
      <h3 class="font-heading text-xl font-semibold">How do prices actually form?</h3>
      <p class="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
        A market price isn't set by anyone in particular — it emerges from a continuous auction
        called <Term id="order-book">price discovery</Term>. Follow the flow below:
      </p>
      <div class="bg-card mt-4 grid gap-3 rounded-xl border border-border p-5 sm:p-6">
        <ol class="grid gap-4 md:grid-cols-4">
          <li v-for="s in flowSteps" :key="s.title" class="bg-muted/50 rounded-lg p-4">
            <span class="text-volt">
              <Users v-if="s.icon === 'users'" class="h-5 w-5" aria-hidden />
              <Store v-else-if="s.icon === 'store'" class="h-5 w-5" aria-hidden />
              <ArrowLeftRight v-else-if="s.icon === 'trade'" class="h-5 w-5" aria-hidden />
              <Scale v-else class="h-5 w-5" aria-hidden />
            </span>
            <p class="mt-2 text-sm font-semibold">{{ s.title }}</p>
            <p class="text-muted-foreground mt-1 text-xs leading-relaxed">{{ s.text }}</p>
          </li>
        </ol>
        <div class="mt-2 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
          When demand (buyers) outweighs supply (sellers), price tends to rise. When supply outweighs
          demand, price tends to fall. That is the entire engine.
        </div>
      </div>
    </div>

    <!-- Exchanges, brokers, platforms -->
    <div>
      <h3 class="font-heading text-xl font-semibold">Exchanges, brokers and platforms</h3>
      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        <InfoCard title="Exchange">
          <template #icon><Store class="text-volt h-5 w-5" aria-hidden /></template>
          <p>
            The central marketplace itself. Regulated stock exchanges (like the NYSE or Nasdaq)
            list companies. Crypto exchanges (like Coinbase or Binance) match crypto buyers and
            sellers, usually with fewer protections.
          </p>
        </InfoCard>
        <InfoCard title="Broker">
          <template #icon><Handshake class="text-volt h-5 w-5" aria-hidden /></template>
          <p>
            Your middleman to the exchange — an app or firm that places orders on your behalf and
            keeps records. Most modern stock brokers charge zero commission on basic trades, but
            check spreads and fees for currency conversion.
          </p>
        </InfoCard>
        <InfoCard title="Wallet">
          <template #icon><ShieldAlert class="text-gold h-5 w-5" aria-hidden /></template>
          <p>
            In crypto, you keep assets in a <Term id="wallet">wallet</Term> controlled by your
            <Term id="private-key">private keys</Term>. &ldquo;Not your keys, not your coins&rdquo;
            is the saying — leaving coins on an exchange means trusting the exchange.
          </p>
        </InfoCard>
      </div>
    </div>

    <!-- Investing vs trading -->
    <div>
      <h3 class="font-heading text-xl font-semibold">Investing vs. trading</h3>
      <p class="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
        People use both words loosely, but they describe genuinely different activities with
        different time horizons, skills and risks.
      </p>
      <div class="bg-card custom-scrollbar mt-4 overflow-x-auto rounded-xl border border-border">
        <table class="w-full min-w-[560px] text-sm">
          <thead>
            <tr class="border-b border-border text-left">
              <th class="p-4 font-semibold">Dimension</th>
              <th class="p-4 font-semibold text-bull">Investing</th>
              <th class="p-4 font-semibold text-bear">Trading</th>
            </tr>
          </thead>
          <tbody class="[&_td]:p-4 [&_tr]:border-b [&_tr:last-child]:border-0 [&_td]:align-top">
            <tr>
              <td class="font-medium">Time horizon</td>
              <td class="text-muted-foreground">Years to decades</td>
              <td class="text-muted-foreground">Minutes to weeks</td>
            </tr>
            <tr>
              <td class="font-medium">Goal</td>
              <td class="text-muted-foreground">Grow wealth with the economy over time</td>
              <td class="text-muted-foreground">Profit from short-term price swings</td>
            </tr>
            <tr>
              <td class="font-medium">Main analysis</td>
              <td class="text-muted-foreground">Fundamentals: earnings, growth, valuation</td>
              <td class="text-muted-foreground">Charts, momentum, order flow</td>
            </tr>
            <tr>
              <td class="font-medium">Stress &amp; time cost</td>
              <td class="text-muted-foreground">Low — check in periodically</td>
              <td class="text-muted-foreground">High — markets demand constant attention</td>
            </tr>
            <tr>
              <td class="font-medium">Suitable for beginners?</td>
              <td class="text-muted-foreground">Generally yes, with education first</td>
              <td class="text-muted-foreground">Mostly no — most short-term traders lose money</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Risk & return -->
    <div>
      <h3 class="font-heading text-xl font-semibold">Risk, return and diversification</h3>
      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <InfoCard title="Risk & return travel together">
          <template #icon><Scale class="text-volt h-5 w-5" aria-hidden /></template>
          <p>
            Assets that <em>can</em> lose a lot must offer the <em>possibility</em> of gaining a lot,
            or nobody would buy them. This is why cash pays little and
            <Term id="volatility">volatile</Term> assets promise (but never guarantee) more.
          </p>
        </InfoCard>
        <InfoCard title="Diversification spreads risk">
          <template #icon><ShieldAlert class="text-volt h-5 w-5" aria-hidden /></template>
          <p>
            <Term id="diversification">Diversification</Term> means splitting money across assets
            that don't move in lockstep. When one holding falls, others may hold steady —
            smoothing your overall ride without necessarily hurting long-run returns.
          </p>
        </InfoCard>
        <InfoCard title="Only risk what you can lose">
          <template #icon><ShieldAlert class="text-bear h-5 w-5" aria-hidden /></template>
          <p>
            The universal beginner rule: never invest money you need for rent, food or emergencies.
            Markets can stay irrational longer than anyone expects, and forced selling at a loss is
            how paper losses become real ones.
          </p>
        </InfoCard>
      </div>
      <div class="mt-6">
        <Takeaway>
          Markets are auctions; prices are opinions meeting money. Higher potential returns always
          come bundled with higher risk, and diversification is the closest thing investors have to
          a free lunch.
        </Takeaway>
      </div>
    </div>
  </SectionShell>
</template>
