import { z } from "zod";

// Validate env vars at boot — fail fast with a readable message.
const schema = z.object({
  VITE_PRICES_URL: z.url(),
  VITE_TOKEN_ICON_BASE: z.url(),
  VITE_USE_MOCKS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:\n" + z.prettifyError(parsed.error),
  );
  throw new Error("Invalid environment variables — check your .env file");
}

export const env = parsed.data;
