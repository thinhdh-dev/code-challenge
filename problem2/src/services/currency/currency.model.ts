import { z } from "zod";
import { env } from "@/config/env";

export const priceEntrySchema = z.object({
  currency: z.string().min(1),
  // ISO-8601 only — `toTokens` dedupes by lexicographic date comparison.
  date: z.iso.datetime(),
  price: z.number().optional(),
});

export const pricesResponseSchema = z.array(priceEntrySchema);

export type PriceEntry = z.infer<typeof priceEntrySchema>;

export interface Token {
  symbol: string;
  price: number;
  iconUrl: string;
  updatedAt: string;
}

export const tokenIconUrl = (symbol: string): string =>
  `${env.VITE_TOKEN_ICON_BASE}/${symbol}.svg`;

// Collapses raw entries into a symbol-keyed map: drops priceless rows
// and keeps the newest entry per symbol.
export function toTokens(entries: PriceEntry[]): Record<string, Token> {
  const result: Record<string, Token> = {};

  for (const entry of entries) {
    if (entry.price == null || entry.price <= 0) continue;

    const existing = result[entry.currency];
    if (existing && existing.updatedAt >= entry.date) continue;

    result[entry.currency] = {
      symbol: entry.currency,
      price: entry.price,
      iconUrl: tokenIconUrl(entry.currency),
      updatedAt: entry.date,
    };
  }

  return result;
}
