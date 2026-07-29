import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  computeRate,
  formatAmount,
  formatDisplay,
  parseAmount,
} from "@/lib/swap.utils";
import type { Token } from "@/services/currency/currency.model";

import { SwapFormRow } from "./SwapFormRow";
import { swapSchema, type SwapFormValues } from "./swap.schema";
import { useSwapStore } from "../swap.store";
import { SwapFormSwitchButton } from "./SwapFormSwitchButton";

interface SwapFormInnerProps {
  tokens: Record<string, Token>;
  refetchTokens: () => Promise<Record<string, Token>>;
}

export const SwapFormInner = ({
  tokens,
  refetchTokens,
}: SwapFormInnerProps) => {
  const handleSaveSwap = useSwapStore((s) => s.addSwap);

  const form = useForm<SwapFormValues>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromToken: "",
      toToken: "",
      fromAmount: "",
      toAmount: "",
    },
    mode: "onChange",
  });

  const { setValue, getValues, handleSubmit, formState } = form;

  const handleSwap = useMutation({
    mutationFn: async (values: SwapFormValues) => {
      const fresh = await refetchTokens();
      const from = fresh[values.fromToken];
      const to = fresh[values.toToken];
      if (!from || !to) {
        throw new Error("Selected token is no longer available");
      }
      const rate = computeRate(from.price, to.price);
      const fromAmt = parseAmount(values.fromAmount);
      const toAmt = fromAmt * rate;

      // Simulated settlement delay so the loading state has somewhere
      // to live. Real swap would happen on-chain here.
      await new Promise((r) => setTimeout(r, 900));

      return {
        fromToken: values.fromToken,
        toToken: values.toToken,
        fromAmount: fromAmt,
        toAmount: toAmt,
      };
    },
    onSuccess: (result) => {
      handleSaveSwap(result);
      toast.success("Swap confirmed", {
        description: `${formatDisplay(result.fromAmount)} ${result.fromToken} → ${formatDisplay(result.toAmount)} ${result.toToken}`,
      });
      // Write the executed receive amount into the form so the user
      // sees what they got. Send amount + tokens are intentionally
      // left as-is — the form mirrors the last swap until the next
      // submit overwrites it.
      setValue("toAmount", formatAmount(result.toAmount));
    },
    onError: (err) => {
      toast.error("Swap failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const submitDisabled = handleSwap.isPending || !formState.isValid;

  useEffect(() => {
    if (!tokens) return;
    console.log("re-render");
    const first = Object.keys(tokens)[0] ?? "";
    const second = Object.keys(tokens)[1] ?? "";
    if (getValues("fromToken") !== first) {
      setValue("fromToken", first, { shouldValidate: true });
    }
    if (getValues("toToken") !== second) {
      setValue("toToken", second, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit((values) => handleSwap.mutate(values))}
        className="flex flex-col gap-2"
        noValidate
      >
        <FieldGroup className="gap-2">
          <SwapFormRow
            label="Amount to send"
            name="from"
            autoFocus
            disabled={handleSwap.isPending}
          />

          <SwapFormSwitchButton disabled={handleSwap.isPending} />

          <SwapFormRow
            label="Amount to receive"
            name="to"
            disabled={handleSwap.isPending}
          />
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          disabled={submitDisabled}
          className="mt-3 h-12 text-base font-semibold"
        >
          {handleSwap.isPending ? (
            <>
              <Spinner /> Swapping…
            </>
          ) : (
            "Swap"
          )}
        </Button>
      </form>
    </FormProvider>
  );
};
