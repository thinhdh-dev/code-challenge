import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { ApiError, get } from "@/lib/apiClient";
import { env } from "@/config/env";
import { TOKENS_QUERY } from "@/config/query";
import { pricesResponseSchema, toTokens, type Token } from "./currency.model";

// Validates the payload at the boundary so callers can trust the shape.
export async function fetchTokens(): Promise<Record<string, Token>> {
  const raw = await get<unknown>(env.VITE_PRICES_URL);
  const parsed = pricesResponseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new ApiError({
      message: `Invalid prices payload: ${z.prettifyError(parsed.error)}`,
    });
  }

  return toTokens(parsed.data);
}

export function useTokens() {
  return useQuery({
    queryKey: ["currency", "tokens"],
    queryFn: fetchTokens,
    ...TOKENS_QUERY,
  });
}
