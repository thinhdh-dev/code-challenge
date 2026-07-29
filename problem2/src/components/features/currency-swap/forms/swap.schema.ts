import { z } from "zod";

// Form values are all strings — that's what `<input>` gives us, and
// it lets us preserve partial input like "1." while the user is still
// typing. We parse + validate numerically in `.refine`.
export const swapSchema = z
  .object({
    fromToken: z.string().min(1, "Pick a token"),
    toToken: z.string().min(1, "Pick a token"),
    fromAmount: z
      .string()
      .min(1, "Enter an amount")
      .refine((s) => {
        const n = parseFloat(s);
        return Number.isFinite(n) && n > 0;
      }, "Enter a positive amount"),
    toAmount: z.string(),
  })
  .refine((v) => v.fromToken !== v.toToken, {
    message: "Pick a different token",
    path: ["toToken"],
  });

export type SwapFormValues = z.infer<typeof swapSchema>;
