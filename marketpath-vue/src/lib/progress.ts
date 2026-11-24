/**
 * Learning progress store — Vue 3 reactive singleton.
 * Vue equivalent of the original React Context provider:
 * persists completed lessons + quiz scores to localStorage.
 */
import { computed, reactive, watch } from "vue";

export type ModuleId =
  | "fundamentals"
  | "stocks"
  | "crypto"
  | "charts"
  | "simulation"
  | "risk"
  | "practice";

export const MODULE_ORDER: ModuleId[] = [
  "fundamentals",
  "stocks",
  "crypto",
  "charts",
  "simulation",
  "risk",
  "practice",
];

export const MODULE_META: Record<ModuleId, { title: string; href: string; blurb: string }> = {
  fundamentals: { title: "Market Fundamentals", href: "#fundamentals", blurb: "What markets are and how they work" },
  stocks: { title: "Stock Essentials", href: "#stocks", blurb: "Shares, ETFs, valuation and market cycles" },
  crypto: { title: "Crypto Essentials", href: "#crypto", blurb: "Bitcoin, blockchain, wallets and safety" },
  charts: { title: "Reading Charts", href: "#charts", blurb: "Candlesticks, trends and indicators" },
  simulation: { title: "Learn by Simulation", href: "#simulation", blurb: "Practice with fictional capital" },
  risk: { title: "Risk Management", href: "#risk", blurb: "Volatility, sizing and psychology" },
  practice: { title: "Practice & Quizzes", href: "#practice", blurb: "Knowledge checks and badges" },
};

export type QuizScore = { correct: number; total: number };

type ProgressState = {
  completed: ModuleId[];
  quizScores: Partial<Record<ModuleId, QuizScore>>;
};

const STORAGE_KEY = "marketpath-progress-v1";

function hydrate(): ProgressState {
  const state: ProgressState = { completed: [], quizScores: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.completed)) state.completed = parsed.completed;
      if (parsed.quizScores) state.quizScores = parsed.quizScores;
    }
  } catch {
    /* ignore corrupted storage */
  }
  return state;
}

const state = reactive<ProgressState>(typeof window !== "undefined" ? hydrate() : { completed: [], quizScores: {} });

// Persist on every change
if (typeof window !== "undefined") {
  watch(
    () => ({ completed: [...state.completed], quizScores: { ...state.quizScores } }),
    (snapshot) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        /* storage may be unavailable */
      }
    },
    { deep: true }
  );
}

export function toggleCompleted(id: ModuleId) {
  const idx = state.completed.indexOf(id);
  if (idx >= 0) state.completed.splice(idx, 1);
  else state.completed.push(id);
}

export function recordQuiz(id: ModuleId, correct: number, total: number) {
  state.quizScores[id] = {
    correct: Math.max(correct, state.quizScores[id]?.correct ?? 0),
    total,
  };
}

export function resetAll() {
  state.completed.splice(0, state.completed.length);
  for (const key of Object.keys(state.quizScores) as ModuleId[]) delete state.quizScores[key];
}

export const badges = computed<string[]>(() => {
  const completed = state.completed;
  const quizScores = state.quizScores;
  const list: string[] = [];
  if (completed.length >= 1) list.push("First Steps");
  if (completed.includes("fundamentals") && completed.includes("stocks") && completed.includes("crypto"))
    list.push("Core Concepts");
  if (completed.includes("charts")) list.push("Chart Reader");
  if (completed.includes("simulation")) list.push("Paper Trader");
  if (completed.includes("risk")) list.push("Risk Aware");
  if (completed.length >= MODULE_ORDER.length) list.push("Course Champion");
  const perfect = Object.entries(quizScores).filter(([, s]) => s && s.correct === s.total);
  if (perfect.length >= 3) list.push("Quiz Whiz");
  if (perfect.length >= 5) list.push("Perfect Scholar");
  return list;
});

/** Drop-in equivalent of the original `useProgress()` hook. */
export function useProgress() {
  return {
    completed: state.completed,
    quizScores: state.quizScores,
    toggleCompleted,
    recordQuiz,
    resetAll,
    badges,
  };
}
