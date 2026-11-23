<script setup lang="ts">
import Nav from "@/components/site/Nav.vue";
import Hero from "@/components/site/Hero.vue";
import Fundamentals from "@/components/site/Fundamentals.vue";
import StockEssentials from "@/components/site/StockEssentials.vue";
import CryptoEssentials from "@/components/site/CryptoEssentials.vue";
import ChartReading from "@/components/site/ChartReading.vue";
import Simulator from "@/components/site/Simulator.vue";
import RiskManagement from "@/components/site/RiskManagement.vue";
import Practice from "@/components/site/Practice.vue";
import GlossaryFaq from "@/components/site/GlossaryFaq.vue";
import Footer from "@/components/site/Footer.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Nav />
    <main class="flex-1">
      <Hero />
      <div class="bg-market-grid">
        <Fundamentals />
        <div class="mx-auto h-px max-w-6xl 2xl:max-w-7xl bg-border" />
        <StockEssentials />
        <div class="mx-auto h-px max-w-6xl 2xl:max-w-7xl bg-border" />
        <CryptoEssentials />
      </div>
      <div class="bg-card/40">
        <ChartReading />
      </div>
      <div class="bg-market-grid">
        <Simulator />
        <div class="mx-auto h-px max-w-6xl 2xl:max-w-7xl bg-border" />
        <RiskManagement />
        <div class="mx-auto h-px max-w-6xl 2xl:max-w-7xl bg-border" />
        <Practice />
      </div>
      <GlossaryFaq />
    </main>
    <Footer />
  </div>
</template>
