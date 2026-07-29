const TRAILING_ZEROS = /\.?0+$/;

// Prices are all USD-quoted, so the rate FROM → TO is just the ratio
// of their USD prices. Pulled out into a function so the math is in
// one place and easy to reason about.
export function computeRate(fromPrice: number, toPrice: number): number {
  return fromPrice / toPrice;
}

// Turns a number back into a string that's pleasant to put inside an
// <input>. We strip trailing zeros so the user doesn't see "1.500000"
// when they typed "1.5", and we cap decimals based on magnitude
// (big numbers don't need 8 places, small ones do).
export function formatAmount(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "0";
  const decimals = Math.abs(n) >= 1 ? 6 : 8;
  return n.toFixed(decimals).replace(TRAILING_ZEROS, "");
}

// Parses whatever's in the input. Tolerates thousand-separators in
// case the user pastes a formatted number; everything else falls back
// to NaN and gets caught by validation.
export function parseAmount(s: string): number {
  if (!s) return NaN;
  return parseFloat(s.replace(/,/g, ""));
}

// Filters a raw input string down to a valid decimal-number shape
// before it ever reaches state. Zod still validates *meaning*
// (positive, non-empty) but this prevents the bad characters from
// being typed in the first place — far better UX than showing an
// error after every wrong keystroke. Rules:
//   • drop everything that isn't a digit or decimal point
//   • collapse multiple decimal points down to one
//   • strip thousand-separator commas silently
//   • disallow leading negatives (swap amounts are always positive)
export function sanitizeAmountInput(raw: string): string {
  const digitsAndDot = raw.replace(/[^\d.]/g, "");
  const [head, ...rest] = digitsAndDot.split(".");
  return rest.length > 0 ? `${head}.${rest.join("")}` : head;
}

// Display formatter for read-only text (rate hint, toast summary, USD
// estimate). Locale-aware grouping, decimal cap scales with magnitude
// the same way `formatAmount` does.
export function formatDisplay(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const maxFrac = Math.abs(n) >= 1 ? 4 : 8;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  }).format(n);
}

const RELATIVE_TIME = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// Human-friendly elapsed time for swap-history rows. Computed once at
// render time — we don't tick it, since reopening the popover is
// enough to refresh.
export function formatRelativeTime(timestamp: number): string {
  const seconds = (Date.now() - timestamp) / 1000;
  if (seconds < 60) return RELATIVE_TIME.format(-Math.floor(seconds), "second");
  const minutes = seconds / 60;
  if (minutes < 60) return RELATIVE_TIME.format(-Math.floor(minutes), "minute");
  const hours = minutes / 60;
  if (hours < 24) return RELATIVE_TIME.format(-Math.floor(hours), "hour");
  const days = hours / 24;
  return RELATIVE_TIME.format(-Math.floor(days), "day");
}
