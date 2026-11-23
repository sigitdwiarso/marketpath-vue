/**
 * Theme composable — Vue equivalent of `next-themes` with
 * attribute="class" defaultTheme="dark" enableSystem={false}.
 * A pre-paint inline script in index.html applies the stored theme
 * before first paint to avoid a flash of the wrong theme.
 */
import { ref } from "vue";

const THEME_KEY = "marketpath-theme";

function initial(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    const t = window.localStorage.getItem(THEME_KEY);
    return t === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const theme = ref<"dark" | "light">(typeof window !== "undefined" ? (document.documentElement.classList.contains("dark") ? "dark" : "light") : initial());

export function useTheme() {
  function setTheme(next: "dark" | "light") {
    theme.value = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage may be unavailable */
    }
  }
  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme.value === "dark" ? "light" : "dark"),
  };
}
