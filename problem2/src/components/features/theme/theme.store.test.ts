import { beforeEach, describe, expect, it } from "vitest";

import { useThemeStore } from "./theme.store";

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "system", systemTheme: "light" });
  });

  describe("setTheme", () => {
    it("updates the theme value", () => {
      useThemeStore.getState().setTheme("dark");
      expect(useThemeStore.getState().theme).toBe("dark");

      useThemeStore.getState().setTheme("light");
      expect(useThemeStore.getState().theme).toBe("light");
    });

    it("accepts 'system' as a valid value", () => {
      useThemeStore.getState().setTheme("dark");
      useThemeStore.getState().setTheme("system");
      expect(useThemeStore.getState().theme).toBe("system");
    });
  });

  describe("setSystemTheme", () => {
    it("updates the OS-preference snapshot", () => {
      useThemeStore.getState().setSystemTheme("dark");
      expect(useThemeStore.getState().systemTheme).toBe("dark");

      useThemeStore.getState().setSystemTheme("light");
      expect(useThemeStore.getState().systemTheme).toBe("light");
    });

    it("is independent of the user's chosen theme", () => {
      useThemeStore.getState().setTheme("dark");
      useThemeStore.getState().setSystemTheme("light");
      const state = useThemeStore.getState();
      expect(state.theme).toBe("dark");
      expect(state.systemTheme).toBe("light");
    });
  });

  describe("persistence", () => {
    it("only persists `theme`, not `systemTheme`", () => {
      useThemeStore.getState().setTheme("dark");
      useThemeStore.getState().setSystemTheme("dark");

      const raw = localStorage.getItem("theme");
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.state).toEqual({ theme: "dark" });
      // systemTheme is intentionally absent from the persisted state
      expect(parsed.state.systemTheme).toBeUndefined();
    });
  });
});
