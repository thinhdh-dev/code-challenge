import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SwapErrorCardProps {
  onRetry: () => void;
}

// Shown when the prices query errors out. We keep the message
// deliberately generic — the real failure mode (third-party endpoint
// down, bad payload) isn't actionable for the user.
export const SwapErrorCard = ({ onRetry }: SwapErrorCardProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
    <AlertCircleIcon className="size-6 text-destructive" />
    <div>
      <p className="font-semibold">Couldn't load prices</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Check your connection and try again.
      </p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RefreshCwIcon /> Retry
    </Button>
  </div>
);
