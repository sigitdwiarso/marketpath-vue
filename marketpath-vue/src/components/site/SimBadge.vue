<script setup lang="ts">
import Badge from "@/components/ui/Badge.vue";
</script>

<template>
  <Badge variant="outline" class="gap-1 whitespace-normal border-gold/50 text-left text-xs font-medium text-gold">
    <span class="animate-pulse-dot mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
    <slot>Simulated data — for education only</slot>
  </Badge>
</template>
