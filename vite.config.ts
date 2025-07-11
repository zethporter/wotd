// vite.config.ts
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [tsConfigPaths(), tanstackStart(), tailwindcss()],
});
