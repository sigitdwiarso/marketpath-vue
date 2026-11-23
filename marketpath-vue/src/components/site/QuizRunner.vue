<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import Progress from "@/components/ui/Progress.vue";
import { type QuizQuestion } from "@/lib/education-data";
import { MODULE_META, MODULE_ORDER, useProgress, type ModuleId } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Award, CheckCircle2, XCircle, Lightbulb, RotateCcw, ArrowRight } from "lucide-vue-next";

const props = defineProps<{
  moduleId: ModuleId;
  questions: QuizQuestion[];
}>();

const { recordQuiz, quizScores } = useProgress();

const step = ref(0);
const picked = ref<number | null>(null);
const showHint = ref(false);
const correctCount = ref(0);
const done = ref(false);
const justWrong = ref(false);

const q = computed(() => props.questions[step.value]);
const meta = computed(() => MODULE_META[props.moduleId]);
const saved = computed(() => quizScores[props.moduleId]);
const isLast = computed(() => step.value === props.questions.length - 1);

function answer(i: number) {
  if (picked.value !== null) return;
  picked.value = i;
  if (i === q.value.answer) {
    correctCount.value += 1;
    justWrong.value = false;
  } else {
    justWrong.value = true;
  }
}

function next() {
  if (isLast.value) {
    recordQuiz(props.moduleId, correctCount.value, props.questions.length);
    done.value = true;
  } else {
    step.value += 1;
    picked.value = null;
    showHint.value = false;
    justWrong.value = false;
  }
}

function restart() {
  step.value = 0;
  picked.value = null;
  showHint.value = false;
  correctCount.value = 0;
  done.value = false;
  justWrong.value = false;
}
</script>

<template>
  <!-- Quiz finished -->
  <div v-if="done" class="bg-card rounded-xl border border-border p-6 text-center">
    <div
      :class="
        cn('mx-auto flex h-12 w-12 items-center justify-center rounded-full', correctCount === questions.length ? 'bg-bull/15 text-bull' : 'bg-volt/15 text-volt')
      "
    >
      <Award class="h-6 w-6" aria-hidden />
    </div>
    <p class="font-heading mt-3 text-lg font-semibold">
      {{ correctCount }} / {{ questions.length }} on {{ meta.title }}
    </p>
    <p class="text-muted-foreground mx-auto mt-1.5 max-w-md text-sm leading-relaxed">
      {{
        correctCount === questions.length
          ? "Perfect score! Your understanding here is solid — move on to the next lesson."
          : "Good effort. Revisit the lesson above whenever you like, then try again — repetition is how this stuff sticks."
      }}
    </p>
    <div class="mt-4 flex flex-wrap items-center justify-center gap-2.5">
      <Button variant="outline" @click="restart">
        <RotateCcw class="mr-1.5 h-4 w-4" /> Try again
      </Button>
      <Button v-if="moduleId !== 'practice'" as-child class="bg-volt text-white hover:bg-volt/85">
        <a :href="MODULE_META[MODULE_ORDER[MODULE_ORDER.indexOf(moduleId) + 1]]?.href ?? '#practice'">
          Next lesson <ArrowRight class="ml-1 h-4 w-4" aria-hidden />
        </a>
      </Button>
    </div>
  </div>

  <!-- Quiz running -->
  <div v-else class="bg-card rounded-xl border border-border p-5 sm:p-6">
    <div class="flex items-center justify-between gap-3">
      <p class="text-xs font-semibold text-muted-foreground">
        {{ meta.title }} · Question {{ step + 1 }} of {{ questions.length }}
      </p>
      <Badge v-if="saved" variant="outline" class="text-xs">Best: {{ saved.correct }}/{{ saved.total }}</Badge>
    </div>
    <Progress :model-value="(step / questions.length) * 100" class="mt-2 h-1.5" />

    <p class="font-heading mt-4 text-base font-semibold sm:text-lg">{{ q.question }}</p>

    <div class="mt-4 grid gap-2">
      <button
        v-for="(opt, i) in q.options"
        :key="i"
        :disabled="picked !== null"
        :class="
          cn(
            'rounded-lg border px-4 py-3 text-left text-sm transition-colors',
            picked === null && 'hover:border-volt hover:bg-volt/5 border-border',
            picked !== null && i === q.answer && 'border-bull bg-bull/10 text-foreground',
            picked !== null && picked === i && i !== q.answer && 'border-bear bg-bear/10',
            picked !== null && picked !== i && i !== q.answer && 'border-border opacity-55'
          )
        "
        @click="answer(i)"
      >
        <span class="tnum mr-2 font-bold">{{ String.fromCharCode(65 + i) }}.</span>
        {{ opt }}
        <CheckCircle2 v-if="picked !== null && i === q.answer" class="text-bull ml-2 inline h-4 w-4" aria-hidden />
        <XCircle v-if="picked !== null && picked === i && i !== q.answer" class="text-bear ml-2 inline h-4 w-4" aria-hidden />
      </button>
    </div>

    <Button v-if="picked === null && !showHint" variant="ghost" size="sm" class="mt-3 text-gold" @click="showHint = true">
      <Lightbulb class="mr-1.5 h-4 w-4" aria-hidden /> Need a hint?
    </Button>
    <p v-if="picked === null && showHint" class="mt-3 rounded-md bg-gold/10 p-3 text-xs leading-relaxed text-gold">
      {{ q.hint }}
    </p>

    <div v-if="picked !== null" :class="cn('mt-4 rounded-lg p-3.5 text-xs leading-relaxed', justWrong ? 'bg-bear/10' : 'bg-bull/10')">
      <p :class="cn('font-semibold', justWrong ? 'text-bear' : 'text-bull')">
        {{ justWrong ? "Not quite — here's why the right answer works:" : "Correct!" }}
      </p>
      <p class="text-muted-foreground mt-1">{{ q.explanation }}</p>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="tnum text-xs text-muted-foreground">Score so far: {{ correctCount }} correct</p>
      <Button :disabled="picked === null" class="bg-volt text-white hover:bg-volt/85" @click="next">
        {{ isLast ? "Finish quiz" : "Next question" }} <ArrowRight class="ml-1 h-4 w-4" aria-hidden />
      </Button>
    </div>
  </div>
</template>
