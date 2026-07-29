import { ArrowDownIcon } from "lucide-react";

import { formatDisplay, formatRelativeTime } from "@/lib/swap.utils";

import type { SwapHistoryEntry } from "../swap.store";
import { AmountLine } from "./AmountLine";

interface HistoryRowProps {
  entry: SwapHistoryEntry;
}

export const HistoryRow = ({ entry }: HistoryRowProps) => {
  // Rate from the recorded amounts — the executed rate, not the current one.
  const executedRate =
    entry.fromAmount > 0 ? entry.toAmount / entry.fromAmount : 0;

  return (
    <li className="mb-2 rounded-xl border border-border bg-card/50 p-3 last:mb-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Swap
        </p>
        <p className="text-[11px] text-muted-foreground">
          {formatRelativeTime(entry.timestamp)}
        </p>
      </div>

      <div className="mt-1.5 space-y-1.5">
        <AmountLine
          symbol={entry.fromToken}
          amount={entry.fromAmount}
          tone="muted"
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="size-3 text-muted-foreground" />
        </div>
        <AmountLine
          symbol={entry.toToken}
          amount={entry.toAmount}
          tone="strong"
        />
      </div>

      <p className="mt-2.5 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
        Rate · 1 {entry.fromToken} = {formatDisplay(executedRate)}{" "}
        {entry.toToken}
      </p>
    </li>
  );
};
