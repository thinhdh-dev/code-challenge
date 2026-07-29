# Solution for Problem 3: Messy React

Here is the list of computational inefficiencies and anti-patterns found in the code block, I split them into three categories, bugs, performance issues, and coding conventions/rules. On the last section, I will provide a refactored version of the code.

## Bugs

1. **`lhsPriority` is undefined.** The filter computes `balancePriority` but checks `lhsPriority`. ReferenceError at runtime; won't compile under `strict`.
2. **Filter logic is inverted.** `if (balance.amount <= 0) return true` keeps empty wallets and hides funded ones. Should be `> 0`.
3. **`balance.blockchain` isn't on `WalletBalance`.** The interface only has `currency` and `amount`. Either the type is stale or it should read `currency`.
4. **`formattedBalances` is built and discarded.** `rows` iterates `sortedBalances` but annotates the item as `FormattedWalletBalance`, so `balance.formatted` is `undefined` at runtime — the type annotation is lying.
5. **Sort comparator can return `undefined`.** No branch handles equal priorities, which violates the `Array.prototype.sort` contract.
6. **`toFixed()` truncates to integer.** Default precision is `0`, so `0.7531 ETH` renders as `"1"`.
7. **`prices[balance.currency]` isn't guarded.** Missing prices produce `NaN` for `usdValue`.

## Performance issues

1. **`useMemo` lists `prices` as a dep but doesn't use it.** Filter+sort re-runs on every price tick for no reason.
2. **`getPriority` is reallocated every render.** Pure lookup with no closure — belongs at module scope.
3. **`formattedBalances` is recomputed every render.** Even if it were used, it's a fresh array of fresh objects on each render, breaking referential equality downstream.
4. **`key={index}` on a sorted list.** When the list reorders, React reuses the wrong nodes — input focus, animations, and child state get smeared across rows. Use `currency`.

## Coding conventions / rules

1. **`blockchain: any`** — defeats TS in the one place a union would catch typos. Use `'Osmosis' | 'Ethereum' | ...` or at least `string`.
2. **`FormattedWalletBalance` duplicates `WalletBalance` fields** instead of extending it.
3. **Empty `interface Props extends BoxProps {}`** — drop it or use `type Props = BoxProps`.
4. **Redundant typing** — `React.FC<Props>` plus `(props: Props)` types the same thing twice.
5. **`children` is destructured but never rendered.** Either render it or stop pulling it out.
6. **`switch` for a static lookup** — a `Record<string, number>` map is shorter and adding a chain is a one-liner.
7. **Three passes (`filter` + `sort` + `map`) where one + sort is enough.** Collapse the filter and map into a single linear pass, and cache `priority` on the row so the sort comparator doesn't recompute it 2·n·log n times. Overall complexity is still O(n log n) — the sort dominates — but we cut two full traversals and a lot of redundant lookups.

---

## Refactored version

```tsx
// CONVENTION #2 — extend instead of duplicating fields
interface WalletBalance {
  currency: string;
  blockchain: string; // BUG #3 — declared at the source of truth
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
  priority: number; // PERF #5 — cached so sort doesn't recompute getPriority
}

// CONVENTION #3 — empty interface removed; alias instead
type Props = BoxProps;

// PERF #2 — hoisted out of the component so it isn't reallocated each render
// CONVENTION #6 — map lookup instead of a switch
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// CONVENTION #1 — typed parameter, no `any`
const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain] ?? -99;

// CONVENTION #4 — drop the redundant `(props: Props)` annotation
// CONVENTION #5 — `children` is no longer destructured; spread carries it through
const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // PERF #1 + #3 — one honest memo for the whole pipeline; deps match what's used
  // CONVENTION #7 — single linear pass instead of filter+map; sort is still O(n log n)
  const rows = useMemo<FormattedWalletBalance[]>(() => {
    const out: FormattedWalletBalance[] = [];
    for (const b of balances) {
      const priority = getPriority(b.blockchain);
      // BUG #1 — use the variable we actually computed
      // BUG #2 — keep funded wallets (was `<= 0`)
      if (priority <= -99 || b.amount <= 0) continue;
      out.push({
        ...b,
        priority,
        // BUG #6 — explicit precision; ideally per-currency
        formatted: b.amount.toFixed(2),
        // BUG #7 — guard against missing prices to avoid NaN
        usdValue: (prices[b.currency] ?? 0) * b.amount,
      });
    }
    // BUG #5 — subtraction always returns a number, including for ties
    // PERF #5 — uses cached priority; no extra getPriority calls per comparison
    out.sort((a, b) => b.priority - a.priority);
    return out;
  }, [balances, prices]);

  return (
    <div {...rest}>
      {children}
      {rows.map((b) => (
        <WalletRow
          className={classes.row}
          // PERF #4 — stable key, not the array index
          key={b.currency}
          amount={b.amount}
          usdValue={b.usdValue}
          formattedAmount={b.formatted}
        />
      ))}
    </div>
  );
};
```
