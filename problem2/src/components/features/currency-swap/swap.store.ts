import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SwapHistoryEntry {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  timestamp: number;
}

interface SwapState {
  lastFromToken: string;
  lastToToken: string;
  history: SwapHistoryEntry[];
  setLastTokens: (from: string, to: string) => void;
  addSwap: (entry: Omit<SwapHistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
}

const HISTORY_LIMIT = 10;

export const useSwapStore = create<SwapState>()(
  persist(
    (set) => ({
      lastFromToken: "",
      lastToToken: "",
      history: [],

      setLastTokens: (lastFromToken, lastToToken) =>
        set({ lastFromToken, lastToToken }),

      addSwap: (entry) =>
        set((state) => ({
          history: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.history,
          ].slice(0, HISTORY_LIMIT),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "currency-swap",
      version: 1,
    },
  ),
);
