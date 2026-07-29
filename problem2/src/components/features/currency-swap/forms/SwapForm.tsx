import { useTokens } from "@/services/currency/currency.service";

import { SwapErrorCard } from "./SwapErrorCard";
import { SwapFormInner } from "./SwapFormInner";
import { SwapSkeleton } from "./SwapSkeleton";

// Handles pending/error states; mounts the form once tokens are loaded.
// Passes `refetchTokens` so submit can pull a fresh quote on demand.
export const SwapForm = () => {
  const query = useTokens();

  if (query.isPending) return <SwapSkeleton />;
  if (query.error || !query.data) {
    return <SwapErrorCard onRetry={() => query.refetch()} />;
  }
  return (
    <SwapFormInner
      tokens={query.data}
      refetchTokens={async () => {
        const result = await query.refetch();
        if (!result.data) throw new Error("Failed to refresh prices");
        return result.data;
      }}
    />
  );
};
