<script setup lang="ts">
import { AccordionItem } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<{
  value: string;
  class?: string;
}>();
</script>

<template>
  <AccordionItem :value="value" data-slot="accordion-item" :class="cn('border-b last:border-b-0', props.class ?? '')">
    <slot />
  </AccordionItem>
</template>
