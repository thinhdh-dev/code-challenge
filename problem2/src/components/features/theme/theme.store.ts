import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  systemTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
  setSystemTheme: (t: ResolvedTheme) => void;
}

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// Only `theme` is persisted; `systemTheme` is recomputed from matchMedia.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      systemTheme: getSystemTheme(),
      setTheme: (theme) => set({ theme }),
      setSystemTheme: (systemTheme) => set({ systemTheme }),
    }),
    {
      name: "theme",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const systemTheme = useThemeStore((s) => s.systemTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;
  return { theme, resolvedTheme, setTheme };
};
