import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
);

// The `@shell` / `@plugins` / `@shared` aliases mirror the parent Tidy DS
// Toolbox so files under src/plugins/__PLUGIN_ID__/ resolve their imports
// identically in both repos. Keep in sync with tsconfig.json.
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react(), viteSingleFile()],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      "@shell": "/src",
      "@plugins": "/src/plugins",
      "@shared": "/src/shared",
    },
  },
});
