import { useState } from "react";

import { cn } from "@/lib/utils";

interface TokenIconProps {
  symbol: string;
  iconUrl: string;
  className?: string;
}

// Falls back to a letter circle when the remote SVG fails to load.
export const TokenIcon = ({ symbol, iconUrl, className }: TokenIconProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={symbol}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground",
          className,
        )}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      className={cn("shrink-0 rounded-full", className)}
      onError={() => setFailed(true)}
    />
  );
};
