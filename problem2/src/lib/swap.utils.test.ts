import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  computeRate,
  formatAmount,
  formatDisplay,
  formatRelativeTime,
  parseAmount,
  sanitizeAmountInput,
} from "./swap.utils";

describe("computeRate", () => {
  it("returns the price ratio", () => {
    expect(computeRate(2500, 1)).toBe(2500);
    expect(computeRate(1, 2500)).toBe(1 / 2500);
  });

  it("handles equal prices", () => {
    expect(computeRate(1, 1)).toBe(1);
  });
});

describe("formatAmount", () => {
  it("strips trailing zeros", () => {
    expect(formatAmount(1.5)).toBe("1.5");
    expect(formatAmount(1)).toBe("1");
    expect(formatAmount(100)).toBe("100");
  });

  it("returns '0' for zero and '' for non-finite", () => {
    expect(formatAmount(0)).toBe("0");
    expect(formatAmount(NaN)).toBe("");
    expect(formatAmount(Infinity)).toBe("");
  });

  it("scales decimals to magnitude", () => {
    // Large numbers cap at 6 decimals
    expect(formatAmount(1234.123456789)).toBe("1234.123457");
    // Small numbers get 8 decimals
    expect(formatAmount(0.00012345678)).toBe("0.00012346");
  });
});

describe("parseAmount", () => {
  it("parses plain numbers", () => {
    expect(parseAmount("1.5")).toBe(1.5);
    expect(parseAmount("100")).toBe(100);
  });

  it("strips comma thousand-separators", () => {
    expect(parseAmount("1,234.56")).toBe(1234.56);
  });

  it("returns NaN for empty or garbage input", () => {
    expect(parseAmount("")).toBeNaN();
    expect(parseAmount("abc")).toBeNaN();
  });
});

describe("formatDisplay", () => {
  it("formats with locale grouping", () => {
    expect(formatDisplay(1234.5)).toBe("1,234.5");
    expect(formatDisplay(1000000)).toBe("1,000,000");
  });

  it("caps decimals by magnitude", () => {
    // ≥1 caps at 4 fraction digits
    expect(formatDisplay(1234.123456)).toBe("1,234.1235");
    // <1 caps at 8 fraction digits
    expect(formatDisplay(0.123456789)).toBe("0.12345679");
  });

  it("returns dash for non-finite", () => {
    expect(formatDisplay(NaN)).toBe("—");
    expect(formatDisplay(Infinity)).toBe("—");
  });
});

describe("sanitizeAmountInput", () => {
  it("strips non-numeric characters", () => {
    expect(sanitizeAmountInput("abc123")).toBe("123");
    expect(sanitizeAmountInput("1a2b3")).toBe("123");
  });

  it("allows a single decimal point", () => {
    expect(sanitizeAmountInput("1.5")).toBe("1.5");
    expect(sanitizeAmountInput("1.5.6")).toBe("1.56");
    expect(sanitizeAmountInput(".5")).toBe(".5");
  });

  it("preserves mid-typing partial values", () => {
    expect(sanitizeAmountInput("1.")).toBe("1.");
    expect(sanitizeAmountInput("0")).toBe("0");
  });

  it("strips minus signs (amounts are positive)", () => {
    expect(sanitizeAmountInput("-1.5")).toBe("1.5");
  });

  it("strips commas", () => {
    expect(sanitizeAmountInput("1,234")).toBe("1234");
  });

  it("returns empty for empty input", () => {
    expect(sanitizeAmountInput("")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats seconds ago", () => {
    const t = Date.now() - 5_000;
    expect(formatRelativeTime(t)).toMatch(/second/);
  });

  it("formats minutes ago", () => {
    const t = Date.now() - 5 * 60_000;
    expect(formatRelativeTime(t)).toMatch(/minute/);
  });

  it("formats hours ago", () => {
    const t = Date.now() - 5 * 60 * 60_000;
    expect(formatRelativeTime(t)).toMatch(/hour/);
  });

  it("formats days ago", () => {
    const t = Date.now() - 5 * 24 * 60 * 60_000;
    expect(formatRelativeTime(t)).toMatch(/day/);
  });
});
