<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{
  title: string;
  class?: string;
}>();
</script>

<template>
  <div :class="cn('bg-card rounded-xl border border-border p-5 sm:p-6', props.class ?? '')">
    <h3 class="font-heading flex items-center gap-2 text-lg font-semibold">
      <slot name="icon" />
      {{ title }}
    </h3>
    <div class="mt-2.5 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
      <slot />
    </div>
  </div>
</template>
