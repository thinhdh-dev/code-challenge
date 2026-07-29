import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Token } from "@/services/currency/currency.model";

import { TokenIcon } from "../TokenIcon";

interface TokenPickerProps {
  tokens: Record<string, Token>;
  value: string;
  onChange: (symbol: string) => void;
  disabled?: boolean;
  /** Token already selected on the other side — shown disabled so users can't pick it twice. */
  excludeSymbol?: string;
}

export const TokenPicker = ({
  tokens,
  value,
  onChange,
  disabled,
  excludeSymbol,
}: TokenPickerProps) => {
  const [open, setOpen] = useState(false);

  const list = useMemo(
    () =>
      Object.values(tokens).sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [tokens],
  );

  const selected = tokens[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className="h-11 gap-2 px-3 font-semibold"
        >
          {selected ? (
            <>
              <TokenIcon
                symbol={selected.symbol}
                iconUrl={selected.iconUrl}
                className="size-6 shrink-0"
              />
              <span className="text-sm w-12">{selected.symbol}</span>
            </>
          ) : (
            <span className="text-sm">Select</span>
          )}
          <ChevronDownIcon className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup>
              {list.map((token) => {
                const isExcluded = token.symbol === excludeSymbol;
                const isSelected = token.symbol === value;
                return (
                  <CommandItem
                    key={token.symbol}
                    value={token.symbol}
                    disabled={isExcluded}
                    onSelect={() => {
                      onChange(token.symbol);
                      setOpen(false);
                    }}
                    className={cn("gap-3", isExcluded && "opacity-50")}
                  >
                    <TokenIcon
                      symbol={token.symbol}
                      iconUrl={token.iconUrl}
                      className="size-7"
                    />
                    <span className="font-medium">{token.symbol}</span>
                    {isSelected && <CheckIcon className="ml-auto size-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
