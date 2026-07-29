import { HistoryIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useSwapStore } from "../swap.store";
import { HistoryRow } from "./HistoryRow";

export const SwapHistory = () => {
  const history = useSwapStore((s) => s.history);
  const clearHistory = useSwapStore((s) => s.clearHistory);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Swap history"
        >
          <HistoryIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Recent swaps</SheetTitle>
          <SheetDescription>
            Your last 10 trades, kept on this device.
          </SheetDescription>
        </SheetHeader>

        {history.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No swaps yet. Confirmed trades will show up here.
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-3 py-2">
            {history.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}

        {history.length > 0 && (
          <div className="border-t border-border p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="w-full"
            >
              Clear history
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
