import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// jsdom doesn't implement matchMedia; theme.store reads it at import time.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clear localStorage between tests so persisted zustand stores don't leak.
afterEach(() => {
  localStorage.clear();
});
