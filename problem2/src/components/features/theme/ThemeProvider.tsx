import { useEffect, type ReactNode } from "react";

import { useThemeStore } from "./theme.store";

interface ThemeProviderProps {
  children: ReactNode;
}

// Bootstraps side-effects for the zustand theme store: OS-pref
// listener and <html> class sync. Mount once at the root.
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useThemeStore((s) => s.theme);
  const systemTheme = useThemeStore((s) => s.systemTheme);
  const setSystemTheme = useThemeStore((s) => s.setSystemTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [setSystemTheme]);

  useEffect(() => {
    const resolved = theme === "system" ? systemTheme : theme;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  }, [theme, systemTheme]);

  return <>{children}</>;
};
