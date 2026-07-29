# Problem 2: Fancy Form

## Task

Create a currency swap form based on the template provided in the folder. A user would use this form to swap assets from one currency to another.

_You may use any third party plugin, library, and/or framework for this problem._

1. You may add input validation/error messages to make the form interactive.
2. Your submission will be rated on its usage intuitiveness and visual attractiveness.
3. Show us your frontend development and design skills, feel free to totally disregard the provided files for this problem.
4. You may use this [repo](https://github.com/Switcheo/token-icons/tree/main/tokens) for token images, e.g. [SVG image](https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg).
5. You may use this [URL](https://interview.switcheo.com/prices.json) for token price information and to compute exchange rates (not every token has a price, those that do not can be omitted).

<aside>
✨ Bonus: extra points if you use [Vite](https://vite.dev/) for this task!
</aside>

## Solution

A submit-driven swap form: the user picks two tokens and an amount, the rate is fetched fresh on submit (no live preview, no background polling), and the trade is recorded in a persisted history with a confirmation toast.

Preview: https://thinhdh-dev.github.io/99-code-challenge/

### Techstack

- **Vite + React 19 + TypeScript** — fast dev loop, strict typing, Vite is the bonus point.
- **Tailwind v4 + shadcn/ui** — design tokens via CSS vars; primitives (`Field`, `InputGroup`, `Sheet`, `Command`, `Popover`, `Sonner`) cover the UX surface.
- **TanStack Query** — for api client and state management.
- **react-hook-form + zod** — form state and validation by schemas.
- **zustand + persist** — global client state (theme, swap history, last token pair) backed by `localStorage`.
- **axios** — wrapped in `ApiError` so the rest of the app never sees raw axios.
- **MSW** — dev-only mock for the prices endpoint, gated on `VITE_USE_MOCKS`.
- **sonner** — toast notifications, themed via the zustand store.
- **Vitest + Testing Library** — Vite-native test runner. (external features for scalability and maintainability)

### How to run

```bash
pnpm install
pnpm dev              # http://localhost:5173
pnpm test             # 43 tests, single run
pnpm lint
pnpm exec vite build  # bundle
```

`.env` is committed with public URLs only. Set `VITE_USE_MOCKS=false` to hit the real Switcheo endpoint.

## Notes

- The two template files from the example repo (`script.js` and `styles.css`) are not included — I went with React + Vite, which has its own source architecture, so the template files weren't applicable.
- Added two extra features beyond the brief: a dark/light theme toggle and a swap history view (both reachable via the buttons in the top-right of the page).
