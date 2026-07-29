// App-wide React Query defaults.
export const QUERY_DEFAULTS = {
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
} as const;

// Prices are fetched only on explicit submit — freeze the cache.
export const TOKENS_QUERY = {
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
} as const;
