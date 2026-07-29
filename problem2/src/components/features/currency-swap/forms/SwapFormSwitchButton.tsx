import type { FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SwapFormValues } from "./swap.schema";

interface Props {
  disabled?: boolean;
}

export const SwapFormSwitchButton: FC<Props> = ({ disabled }) => {
  const { control, setValue } = useFormContext<SwapFormValues>();
  const fromToken = useWatch({ control, name: "fromToken" });
  const toToken = useWatch({ control, name: "toToken" });

  const handleFlip = () => {
    setValue("fromToken", toToken, { shouldValidate: true });
    setValue("toToken", fromToken, { shouldValidate: true });
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-x-2 top-1/2 h-px bg-border" />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleFlip}
        className="relative z-10 rounded-full bg-card shadow-sm transition-transform hover:rotate-180"
        aria-label="Swap direction"
        disabled={disabled}
      >
        <ArrowDownUpIcon />
      </Button>
    </div>
  );
};
