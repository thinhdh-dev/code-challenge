import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { QUERY_DEFAULTS } from "@/config/query";

// Wraps the app in a React Query client. We stash the client in
// `useState` rather than a module-level constant — that way each
// provider mount gets its own client, which plays nicer with HMR and
// with any future tests that need a fresh cache per render.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: QUERY_DEFAULTS } }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
