import { useId } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { sanitizeAmountInput } from "@/lib/swap.utils";

import { TokenPicker } from "./TokenPicker";
import { Controller, useFormContext } from "react-hook-form";
import type { SwapFormValues } from "./swap.schema";
import { useTokens } from "@/services/currency/currency.service";

interface SwapRowProps {
  label: string;
  name: "from" | "to";
  autoFocus?: boolean;
  disabled?: boolean;
}

export const SwapFormRow = ({
  label,
  name,
  autoFocus,
  disabled,
}: SwapRowProps) => {
  const { control, setValue, getValues } = useFormContext<SwapFormValues>();
  const { data: tokens } = useTokens();

  const inputId = useId();

  const fieldTokenName = `${name}Token` as "fromToken" | "toToken";
  const swapFieldName = `${name === "from" ? "to" : "from"}` as
    | "fromToken"
    | "toToken";

  const readOnly = name === "to";

  if (!tokens) {
    return null;
  }

  return (
    <Controller
      name={`${name}Amount` as "fromAmount" | "toAmount"}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const token = tokens?.[getValues(fieldTokenName)];
        const excludeSymbol = getValues(swapFieldName);
        return (
          <Field data-invalid={!!error}>
            <FieldLabel
              htmlFor={inputId}
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              {label}
            </FieldLabel>

            <InputGroup
              className={cn(
                "h-auto rounded-2xl border-border bg-card pr-2",
                readOnly && "bg-muted/30",
              )}
            >
              <InputGroupInput
                id={inputId}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value}
                onChange={(e) => onChange(sanitizeAmountInput(e.target.value))}
                autoFocus={autoFocus}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={!!error}
                tabIndex={readOnly ? -1 : undefined}
                className={cn(
                  "h-14 px-3 text-2xl font-semibold rounded-s-2xl",
                  readOnly && "text-muted-foreground",
                )}
              />
              <InputGroupAddon align="inline-end">
                <TokenPicker
                  tokens={tokens}
                  value={token?.symbol ?? ""}
                  onChange={(v) =>
                    setValue(`${name}Token` as "fromToken" | "toToken", v, {
                      shouldValidate: true,
                    })
                  }
                  disabled={disabled}
                  excludeSymbol={excludeSymbol}
                />
              </InputGroupAddon>
            </InputGroup>

            {error && <FieldError>{error.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
};
