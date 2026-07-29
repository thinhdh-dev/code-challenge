import { http, HttpResponse } from "msw";

import { env } from "@/config/env";

// Representative payload: a handful of priced tokens, one duplicate
// (newer date should win), and one with a missing price (must be dropped).
const mockPrices = [
  { currency: "BLUR", date: "2024-08-29T07:10:40.000Z", price: 0.20811525 },
  { currency: "bNEO", date: "2024-08-29T07:10:40.000Z", price: 7.1282679 },
  { currency: "BUSD", date: "2024-08-29T07:10:40.000Z", price: 1.0009444 },
  { currency: "USD", date: "2024-08-29T07:10:40.000Z", price: 1.0 },
  { currency: "ETH", date: "2024-08-29T07:10:40.000Z", price: 2500.5 },
  { currency: "ETH", date: "2024-08-30T07:10:40.000Z", price: 2520.7 },
  { currency: "SWTH", date: "2024-08-29T07:10:40.000Z", price: 0.004 },
  { currency: "USDC", date: "2024-08-29T07:10:40.000Z", price: 0.9899 },
  { currency: "ATOM", date: "2024-08-29T07:10:40.000Z", price: 7.18 },
  { currency: "OSMO", date: "2024-08-29T07:10:40.000Z", price: 0.5 },
  { currency: "STRD", date: "2024-08-29T07:10:40.000Z", price: 1.05 },
  { currency: "WBTC", date: "2024-08-29T07:10:40.000Z", price: 60500.12 },
  { currency: "PLACEHOLDER", date: "2024-08-29T07:10:40.000Z" },
];

export const handlers = [
  http.get(env.VITE_PRICES_URL, () => HttpResponse.json(mockPrices)),
];
