import { formatDisplay } from "@/lib/swap.utils";
import { tokenIconUrl } from "@/services/currency/currency.model";

import { TokenIcon } from "../TokenIcon";

interface AmountLineProps {
  symbol: string;
  amount: number;
  tone: "muted" | "strong";
}

export const AmountLine = ({ symbol, amount, tone }: AmountLineProps) => (
  <div className="flex items-center gap-2.5">
    <TokenIcon
      symbol={symbol}
      iconUrl={tokenIconUrl(symbol)}
      className="size-7"
    />
    <span
      className={
        tone === "strong"
          ? "text-sm font-semibold"
          : "text-sm font-medium text-foreground"
      }
    >
      {formatDisplay(amount)} {symbol}
    </span>
  </div>
);
