<script setup lang="ts">
import { Lightbulb } from "lucide-vue-next";
</script>

<template>
  <div class="takeaway bg-card rounded-r-lg px-4 py-3 text-sm leading-relaxed">
    <span class="mr-1.5 inline-flex items-center gap-1 font-semibold text-gold">
      <Lightbulb class="h-4 w-4" aria-hidden /> Key takeaway
    </span>
    <span><slot /></span>
  </div>
</template>
