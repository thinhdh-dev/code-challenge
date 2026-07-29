import { SwapForm } from "@/components/features/currency-swap/forms/SwapForm";
import { SwapHistory } from "@/components/features/currency-swap/history/SwapHistory";
import { ThemeToggle } from "@/components/features/theme/ThemeToggle";

// Page shell — handles layout and chrome (heading, history button,
// theme toggle) and hands the actual form work off to <SwapForm />.
// Keeping this thin means the form can be dropped into other pages
// without dragging the page background and header along with it.
export const CurrencySwap = () => (
  <div className="relative min-h-svh w-full bg-background text-foreground">
    <header className="absolute right-4 top-4 z-10 flex items-center gap-1">
      <SwapHistory />
      <ThemeToggle />
    </header>

    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Currency Swap</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trade tokens at live rates.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-3 shadow-lg shadow-black/5">
          <SwapForm />
        </div>
      </div>
    </main>
  </div>
);
