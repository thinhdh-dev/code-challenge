import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { env } from "./config/env";
import { QueryProvider } from "./components/providers/QueryProvider";
import { ThemeProvider } from "./components/features/theme/ThemeProvider";
import { CurrencySwap } from "./components/entries/CurrencySwap";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

// Boots MSW in dev when the env flag is on. We dynamic-import the
// worker so it's never bundled into production — and we wait for it
// to start *before* rendering, otherwise the first prices query can
// race past the worker and hit the real network.
async function enableMocks() {
  if (!import.meta.env.DEV || !env.VITE_USE_MOCKS) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <CurrencySwap />
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </ThemeProvider>
    </StrictMode>,
  );
});
