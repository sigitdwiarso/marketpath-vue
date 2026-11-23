<script setup lang="ts">
import { computed, ref } from "vue";
import Input from "@/components/ui/Input.vue";
import Accordion from "@/components/ui/Accordion.vue";
import AccordionItem from "@/components/ui/AccordionItem.vue";
import AccordionTrigger from "@/components/ui/AccordionTrigger.vue";
import AccordionContent from "@/components/ui/AccordionContent.vue";
import { FAQ_ITEMS, GLOSSARY } from "@/lib/education-data";
import { Search } from "lucide-vue-next";

const query = ref("");
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q
    ? GLOSSARY.filter(
        (g) =>
          g.term.toLowerCase().includes(q) ||
          g.short.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q)
      )
    : GLOSSARY;
});
</script>

<template>
  <section id="glossary" class="scroll-mt-20 py-14 sm:py-20" aria-labelledby="glossary-heading">
    <div class="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2">
        <!-- Glossary -->
        <div>
          <h2 id="glossary-heading" class="font-heading text-2xl font-bold sm:text-3xl">Glossary</h2>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            Every dotted-underlined term across the lessons lives here. Search in plain language —
            no jargon required.
          </p>
          <div class="relative mt-4">
            <Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              :model-value="query"
              placeholder="Search terms — try 'volatility' or 'wallet'…"
              class="pl-9"
              aria-label="Search glossary"
              @update:model-value="(v: string) => (query = v)"
            />
          </div>
          <div class="custom-scrollbar mt-4 max-h-[430px] space-y-3 overflow-y-auto pr-1.5">
            <p v-if="filtered.length === 0" class="text-muted-foreground py-6 text-center text-sm">
              No terms match &ldquo;{{ query }}&rdquo;. Try a simpler word.
            </p>
            <details v-for="g in filtered" :key="g.id" class="group bg-card rounded-xl border border-border p-4 open:shadow-sm">
              <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {{ g.term }}
                <span class="text-muted-foreground text-xs transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p class="text-muted-foreground mt-2 text-xs leading-relaxed">{{ g.definition }}</p>
              <p class="mt-2 rounded-md bg-muted p-2.5 text-xs leading-relaxed">
                <span class="font-semibold text-gold">Example: </span>
                {{ g.example }}
              </p>
            </details>
          </div>
        </div>

        <!-- FAQ -->
        <div>
          <h2 class="font-heading text-2xl font-bold sm:text-3xl">Beginner FAQ</h2>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            The questions almost every newcomer asks, answered honestly — including the ones about
            what this site can and cannot do.
          </p>
          <Accordion class="mt-4">
            <AccordionItem v-for="(f, i) in FAQ_ITEMS" :key="i" :value="`faq-${i}`">
              <AccordionTrigger class="text-left text-sm font-semibold">{{ f.q }}</AccordionTrigger>
              <AccordionContent class="text-muted-foreground text-sm leading-relaxed">
                {{ f.a }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </section>
</template>
