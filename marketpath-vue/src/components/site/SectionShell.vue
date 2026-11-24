<script setup lang="ts">
import { computed } from "vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import { CheckCircle2, Circle, ArrowRight } from "lucide-vue-next";
import { MODULE_ORDER, MODULE_META, useProgress, type ModuleId } from "@/lib/progress";
import { cn } from "@/lib/utils";

const props = defineProps<{
  id: string;
  moduleId: ModuleId;
  number: number;
  title: string;
}>();

const { completed, toggleCompleted } = useProgress();
const isDone = computed(() => completed.includes(props.moduleId));
const next = computed(() => {
  const idx = MODULE_ORDER.indexOf(props.moduleId);
  return idx >= 0 && idx < MODULE_ORDER.length - 1 ? MODULE_META[MODULE_ORDER[idx + 1]] : null;
});
</script>

<template>
  <section :id="id" class="scroll-mt-20 py-14 sm:py-20" :aria-labelledby="`${id}-heading`">
    <div class="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
      <div class="flex flex-wrap items-center gap-3">
        <Badge variant="outline" class="tnum border-volt/50 text-volt">Lesson {{ number }} of 7</Badge>
        <Badge v-if="isDone" class="gap-1 bg-bull/15 text-bull hover:bg-bull/15">
          <CheckCircle2 class="h-3.5 w-3.5" aria-hidden /> Completed
        </Badge>
      </div>
      <h2 :id="`${id}-heading`" class="font-heading mt-3 text-3xl font-bold sm:text-4xl">{{ title }}</h2>
      <div class="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        <slot name="intro" />
      </div>

      <div class="mt-10 space-y-10">
        <slot />
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <Button
          :variant="isDone ? 'outline' : 'default'"
          :class="cn(!isDone && 'bg-volt text-white hover:bg-volt/85')"
          @click="toggleCompleted(moduleId)"
        >
          <template v-if="isDone">
            <Circle class="h-4 w-4" aria-hidden /> Mark as not completed
          </template>
          <template v-else>
            <CheckCircle2 class="h-4 w-4" aria-hidden /> Mark lesson complete
          </template>
        </Button>
        <a v-if="next" :href="next.href" class="group inline-flex items-center gap-1.5 text-sm font-semibold text-volt">
          Next lesson: {{ next.title }}
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      </div>
    </div>
  </section>
</template>
