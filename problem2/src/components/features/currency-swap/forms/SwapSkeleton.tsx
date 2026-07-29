// Placeholder shown while the prices feed is loading. Keeping it
// shaped like the real form keeps the page from jumping when the
// query resolves.
export const SwapSkeleton = () => (
  <div role="status" aria-live="polite" className="flex flex-col gap-3 py-2">
    <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
    <div className="h-9 w-9 animate-pulse self-center rounded-full bg-muted/40" />
    <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
    <div className="mt-2 h-12 animate-pulse rounded-md bg-muted/40" />
    <span className="sr-only">Loading token prices…</span>
  </div>
);
