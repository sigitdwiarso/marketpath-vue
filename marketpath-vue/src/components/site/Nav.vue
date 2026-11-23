<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "@/components/ui/Button.vue";
import Progress from "@/components/ui/Progress.vue";
import Sheet from "@/components/ui/Sheet.vue";
import SheetTrigger from "@/components/ui/SheetTrigger.vue";
import SheetContent from "@/components/ui/SheetContent.vue";
import SheetTitle from "@/components/ui/SheetTitle.vue";
import { Moon, Sun, Menu, TrendingUp } from "lucide-vue-next";
import { MODULE_META, MODULE_ORDER, useProgress } from "@/lib/progress";
import { useTheme } from "@/composables/useTheme";
import { cn } from "@/lib/utils";

const NAV_LINKS = MODULE_ORDER.slice(0, 6).map((id) => ({ id, ...MODULE_META[id] }));

const { theme, toggle } = useTheme();
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const { completed } = useProgress();
const pct = computed(() => Math.round((completed.length / MODULE_ORDER.length) * 100));
const open = ref(false);
const scrolled = ref(false);

const onScroll = () => (scrolled.value = window.scrollY > 8);
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    :class="
      cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      )
    "
  >
    <div class="mx-auto flex h-16 max-w-6xl 2xl:max-w-7xl items-center gap-4 px-4 sm:px-6">
      <a href="#top" class="flex items-center gap-2 font-semibold" aria-label="MarketPath home">
        <span class="bg-volt flex h-8 w-8 items-center justify-center rounded-lg text-white">
          <TrendingUp class="h-4.5 w-4.5" aria-hidden />
        </span>
        <span class="font-heading text-lg tracking-tight">
          Market<span class="text-volt">Path</span>
        </span>
      </a>

      <nav class="ml-auto hidden items-center gap-0.5 xl:flex" aria-label="Lessons">
        <a
          v-for="l in NAV_LINKS"
          :key="l.id"
          :href="l.href"
          class="text-muted-foreground hover:text-foreground hover:bg-muted whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors"
        >
          {{ l.title }}
        </a>
      </nav>

      <div class="ml-auto flex min-w-0 items-center gap-2 xl:ml-2">
        <div class="hidden w-32 items-center gap-2 sm:flex xl:w-36" title="Learning progress">
          <Progress :model-value="pct" class="h-1.5" :aria-label="`Learning progress ${pct}%`" />
          <span class="tnum text-xs text-muted-foreground">{{ pct }}%</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Toggle light and dark theme" @click="toggle">
          <Sun v-if="mounted && theme === 'dark'" class="h-4.5 w-4.5" />
          <Moon v-else class="h-4.5 w-4.5" />
        </Button>
        <Sheet :open="open" @update:open="(v) => (open = v)">
          <SheetTrigger>
            <Button variant="ghost" size="icon" class="xl:hidden" aria-label="Open lessons menu">
              <Menu class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-72">
            <SheetTitle class="font-heading">Lessons</SheetTitle>
            <nav class="mt-2 flex flex-col gap-1" aria-label="Lessons">
              <a
                v-for="(l, i) in NAV_LINKS"
                :key="l.id"
                :href="l.href"
                class="hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
                @click="open = false"
              >
                <span>
                  <span class="tnum mr-2 text-xs text-muted-foreground">{{ i + 1 }}</span>
                  {{ l.title }}
                </span>
                <span v-if="completed.includes(l.id)" class="text-bull h-2 w-2 rounded-full bg-bull" />
              </a>
              <a href="#glossary" class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm" @click="open = false">
                Glossary &amp; FAQ
              </a>
            </nav>
            <div class="mt-4 border-t border-border pt-4">
              <p class="mb-2 text-xs text-muted-foreground">Learning progress</p>
              <Progress :model-value="pct" class="h-2" />
              <p class="tnum mt-1.5 text-xs text-muted-foreground">
                {{ completed.length }} of {{ MODULE_ORDER.length }} lessons completed
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
