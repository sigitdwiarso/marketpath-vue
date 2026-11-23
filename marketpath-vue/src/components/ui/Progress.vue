<script setup lang="ts">
import { computed } from "vue";
import { ProgressRoot, ProgressIndicator } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<{
  modelValue?: number | null;
  class?: string;
}>();

const value = computed(() => props.modelValue ?? 0);
</script>

<template>
  <ProgressRoot
    :model-value="value"
    data-slot="progress"
    :class="cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', props.class ?? '')"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="bg-primary h-full w-full flex-1 transition-all"
      :style="{ transform: `translateX(-${100 - value}%)` }"
    />
  </ProgressRoot>
</template>
