import { beforeEach, describe, expect, it } from "vitest";
import { MODULE_ORDER, badges, recordQuiz, resetAll, toggleCompleted, useProgress } from "@/lib/progress";

describe("progress store", () => {
  beforeEach(() => {
    resetAll();
    window.localStorage.clear();
  });

  it("starts empty", () => {
    const { completed, quizScores } = useProgress();
    expect(completed).toHaveLength(0);
    expect(Object.keys(quizScores)).toHaveLength(0);
  });

  it("toggles completed lessons", () => {
    toggleCompleted("fundamentals");
    const { completed } = useProgress();
    expect(completed).toContain("fundamentals");
    toggleCompleted("fundamentals");
    expect(completed).not.toContain("fundamentals");
  });

  it("records the best quiz score per module", () => {
    recordQuiz("charts", 1, 3);
    recordQuiz("charts", 3, 3);
    const { quizScores } = useProgress();
    expect(quizScores.charts).toEqual({ correct: 3, total: 3 });
  });

  it("awards badges for progress milestones", () => {
    toggleCompleted("fundamentals");
    expect(badges.value).toContain("First Steps");
    toggleCompleted("stocks");
    toggleCompleted("crypto");
    expect(badges.value).toContain("Core Concepts");
    toggleCompleted("charts");
    expect(badges.value).toContain("Chart Reader");
  });

  it("persists to localStorage", async () => {
    toggleCompleted("risk");
    // the persistence watcher is scheduled by Vue's reactivity system
    await new Promise((resolve) => setTimeout(resolve, 0));
    const raw = window.localStorage.getItem("marketpath-progress-v1");
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).completed).toContain("risk");
  });

  it("exposes all 7 modules in order", () => {
    expect(MODULE_ORDER).toHaveLength(7);
    expect(MODULE_ORDER[0]).toBe("fundamentals");
    expect(MODULE_ORDER[6]).toBe("practice");
  });
});
