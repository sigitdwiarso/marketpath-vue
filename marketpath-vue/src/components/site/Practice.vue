<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import SectionShell from "./SectionShell.vue";
import Takeaway from "./Takeaway.vue";
import QuizRunner from "./QuizRunner.vue";
import { QUIZZES } from "@/lib/education-data";
import { MODULE_ORDER, useProgress } from "@/lib/progress";
import { Award, RotateCcw } from "lucide-vue-next";

const { badges, completed, resetAll, quizScores } = useProgress();
const quizModules = MODULE_ORDER.filter((m) => QUIZZES[m]?.length);
</script>

<template>
  <SectionShell id="practice" module-id="practice" :number="7" title="Practice & Knowledge Checks">
    <template #intro>
      Every lesson has a short quiz waiting here — with optional hints and honest explanations for
      every answer. Your progress and badges are stored privately in your own browser, so you can
      leave and come back anytime.
    </template>

    <!-- Badges + overview -->
    <div class="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      <div class="bg-card h-fit rounded-xl border border-border p-5">
        <h3 class="font-heading flex items-center gap-2 text-lg font-semibold">
          <Award class="text-gold h-5 w-5" aria-hidden /> Your achievements
        </h3>
        <div class="mt-2 text-xs text-muted-foreground">
          {{ completed.length }} / {{ MODULE_ORDER.length }} lessons completed ·
          {{ Object.keys(quizScores).length }} quizzes attempted
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <p v-if="badges.length === 0" class="text-xs text-muted-foreground">
            No badges yet — complete any lesson to earn your first one.
          </p>
          <Badge v-for="b in badges" v-else :key="b" class="bg-gold/15 text-gold hover:bg-gold/15">
            {{ b }}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" class="mt-4 text-muted-foreground" @click="resetAll">
          <RotateCcw class="mr-1.5 h-3.5 w-3.5" aria-hidden /> Reset all progress
        </Button>
      </div>
      <div class="space-y-5">
        <QuizRunner v-for="m in quizModules" :key="m" :module-id="m" :questions="QUIZZES[m]" />
      </div>
    </div>

    <Takeaway>
      You've covered markets, stocks, crypto, charts, simulation and risk. Financial literacy is
      a marathon: reread lessons, replay scenarios, and keep asking &ldquo;what could go wrong?&rdquo;
      — that question is worth more than any hot tip.
    </Takeaway>
  </SectionShell>
</template>
