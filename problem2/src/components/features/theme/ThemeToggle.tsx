import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "./theme.store";

// Two-state toggle (light ↔ dark). "system" is reachable only by clearing localStorage.
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};
