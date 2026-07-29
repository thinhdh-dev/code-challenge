import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSwapStore } from "./swap.store";

describe("useSwapStore", () => {
  beforeEach(() => {
    // Reset state and timers between tests for isolation.
    useSwapStore.setState({
      lastFromToken: "",
      lastToToken: "",
      history: [],
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    let counter = 0;
    vi.stubGlobal("crypto", {
      randomUUID: () => `id-${counter++}`,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe("setLastTokens", () => {
    it("updates both tokens at once", () => {
      useSwapStore.getState().setLastTokens("ETH", "USDC");
      const state = useSwapStore.getState();
      expect(state.lastFromToken).toBe("ETH");
      expect(state.lastToToken).toBe("USDC");
    });
  });

  describe("addSwap", () => {
    it("prepends new entries (newest first)", () => {
      const { addSwap } = useSwapStore.getState();
      addSwap({ fromToken: "ETH", toToken: "USDC", fromAmount: 1, toAmount: 2500 });
      addSwap({ fromToken: "BTC", toToken: "USDC", fromAmount: 1, toAmount: 60000 });

      const history = useSwapStore.getState().history;
      expect(history).toHaveLength(2);
      expect(history[0].fromToken).toBe("BTC");
      expect(history[1].fromToken).toBe("ETH");
    });

    it("attaches an id and timestamp to each entry", () => {
      useSwapStore.getState().addSwap({
        fromToken: "ETH",
        toToken: "USDC",
        fromAmount: 1,
        toAmount: 2500,
      });
      const entry = useSwapStore.getState().history[0];
      expect(entry.id).toBe("id-0");
      expect(entry.timestamp).toBe(Date.now());
    });

    it("caps history at 10 entries", () => {
      const { addSwap } = useSwapStore.getState();
      for (let i = 0; i < 15; i++) {
        addSwap({
          fromToken: "ETH",
          toToken: "USDC",
          fromAmount: i + 1,
          toAmount: (i + 1) * 2500,
        });
      }
      const history = useSwapStore.getState().history;
      expect(history).toHaveLength(10);
      // Newest first — last addition has fromAmount=15
      expect(history[0].fromAmount).toBe(15);
      // Oldest in the capped window is the 6th addition (fromAmount=6)
      expect(history[9].fromAmount).toBe(6);
    });
  });

  describe("clearHistory", () => {
    it("empties the history list", () => {
      const { addSwap, clearHistory } = useSwapStore.getState();
      addSwap({ fromToken: "ETH", toToken: "USDC", fromAmount: 1, toAmount: 2500 });
      expect(useSwapStore.getState().history).toHaveLength(1);

      clearHistory();
      expect(useSwapStore.getState().history).toHaveLength(0);
    });

    it("does not touch lastFromToken / lastToToken", () => {
      const { setLastTokens, clearHistory } = useSwapStore.getState();
      setLastTokens("ETH", "USDC");
      clearHistory();
      const state = useSwapStore.getState();
      expect(state.lastFromToken).toBe("ETH");
      expect(state.lastToToken).toBe("USDC");
    });
  });
});
