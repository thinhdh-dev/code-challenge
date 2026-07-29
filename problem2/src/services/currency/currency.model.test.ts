import { describe, expect, it } from "vitest";

import {
  priceEntrySchema,
  toTokens,
  tokenIconUrl,
  type PriceEntry,
} from "./currency.model";

describe("priceEntrySchema", () => {
  it("accepts a well-formed entry", () => {
    const result = priceEntrySchema.safeParse({
      currency: "ETH",
      date: "2024-08-29T07:10:40.000Z",
      price: 2500,
    });
    expect(result.success).toBe(true);
  });

  it("accepts entries without a price (gets filtered later)", () => {
    const result = priceEntrySchema.safeParse({
      currency: "LUNA",
      date: "2024-08-29T07:10:40.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-ISO date strings", () => {
    const result = priceEntrySchema.safeParse({
      currency: "ETH",
      date: "yesterday",
      price: 2500,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty currency", () => {
    const result = priceEntrySchema.safeParse({
      currency: "",
      date: "2024-08-29T07:10:40.000Z",
      price: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("tokenIconUrl", () => {
  it("builds the SVG URL from the configured base", () => {
    expect(tokenIconUrl("ETH")).toBe("https://test.local/tokens/ETH.svg");
    expect(tokenIconUrl("SWTH")).toBe("https://test.local/tokens/SWTH.svg");
  });
});

describe("toTokens", () => {
  const baseDate = "2024-08-29T07:10:40.000Z";
  const newerDate = "2024-08-30T07:10:40.000Z";

  it("drops entries without a price", () => {
    const entries: PriceEntry[] = [
      { currency: "ETH", date: baseDate, price: 2500 },
      { currency: "LUNA", date: baseDate },
    ];
    const result = toTokens(entries);
    expect(result.ETH).toBeDefined();
    expect(result.LUNA).toBeUndefined();
  });

  it("drops entries with non-positive prices", () => {
    const entries: PriceEntry[] = [
      { currency: "ZERO", date: baseDate, price: 0 },
      { currency: "NEG", date: baseDate, price: -5 },
      { currency: "ETH", date: baseDate, price: 2500 },
    ];
    const result = toTokens(entries);
    expect(result.ZERO).toBeUndefined();
    expect(result.NEG).toBeUndefined();
    expect(result.ETH).toBeDefined();
  });

  it("keeps the newest entry when a token appears multiple times", () => {
    const entries: PriceEntry[] = [
      { currency: "ETH", date: baseDate, price: 2500 },
      { currency: "ETH", date: newerDate, price: 2600 },
    ];
    const result = toTokens(entries);
    expect(result.ETH.price).toBe(2600);
    expect(result.ETH.updatedAt).toBe(newerDate);
  });

  it("ignores stale duplicates regardless of order", () => {
    const entries: PriceEntry[] = [
      { currency: "ETH", date: newerDate, price: 2600 },
      { currency: "ETH", date: baseDate, price: 2500 },
    ];
    const result = toTokens(entries);
    expect(result.ETH.price).toBe(2600);
  });

  it("derives the icon URL for each token", () => {
    const entries: PriceEntry[] = [
      { currency: "ETH", date: baseDate, price: 2500 },
    ];
    const result = toTokens(entries);
    expect(result.ETH.iconUrl).toBe("https://test.local/tokens/ETH.svg");
  });

  it("returns an empty map for an empty array", () => {
    expect(toTokens([])).toEqual({});
  });
});
