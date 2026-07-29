/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    env: {
      VITE_PRICES_URL: "https://test.local/prices.json",
      VITE_TOKEN_ICON_BASE: "https://test.local/tokens",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/]react/,
              priority: 20,
            },
            {
              name: "ui-vendor",
              test: /node_modules[\\/](radix-ui|shadcn)[\\//]/,
              priority: 15,
            },
            {
              name: "icons-vendor",
              test: /node_modules[\\/](lucide-react)[\\//]/,
              priority: 10,
            },
            {
              name: "common",
              minShareCount: 2,
              minSize: 10000,
              priority: 5,
            },
          ],
        },
      },
    },
  },
});
