<script setup lang="ts">
import { computed } from "vue";
import Popover from "@/components/ui/Popover.vue";
import PopoverTrigger from "@/components/ui/PopoverTrigger.vue";
import PopoverContent from "@/components/ui/PopoverContent.vue";
import { GLOSSARY } from "@/lib/education-data";

const props = defineProps<{ id?: string }>();

const data = computed(() => (props.id ? GLOSSARY.find((g) => g.id === props.id) : undefined));
</script>

<template>
  <!-- Unknown/missing id: render the term as plain text (matches original behaviour) -->
  <span v-if="!data"><slot>{{ id }}</slot></span>
  <Popover v-else>
    <PopoverTrigger>
      <button type="button" class="term-highlight font-medium text-foreground" :aria-label="`Definition of ${data.term}`">
        <slot>{{ data.term }}</slot>
      </button>
    </PopoverTrigger>
    <PopoverContent side="top" class="w-80 p-4">
      <p class="font-heading text-sm font-semibold">{{ data.term }}</p>
      <p class="mt-1.5 text-sm text-muted-foreground">{{ data.definition }}</p>
      <div class="mt-3 rounded-md bg-muted p-2.5 text-xs leading-relaxed">
        <span class="font-semibold text-gold">Example: </span>
        {{ data.example }}
      </div>
    </PopoverContent>
  </Popover>
</template>
