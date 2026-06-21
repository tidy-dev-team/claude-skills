# __PLUGIN_NAME__

A Figma plugin built to merge into the **Tidy DS Toolbox** later as a sub-module
with minimal changes.

## Architecture

Dual-threaded, mirroring the parent Tidy DS Toolbox:

- **UI thread** — React 19, bundled by **Vite** (`vite-plugin-singlefile` →
  single `dist/index.html`). Entry: `src/main.tsx` → `src/App.tsx`.
- **Plugin thread** — Figma API code, bundled by **esbuild** → `dist/code.js`.
  Entry: `src/code.ts`.

The two threads talk only via typed `postMessage` using the envelope
`{ target, action, payload, requestId }` (`src/shared/bridge.ts`).

### The migrating module

The feature lives in `src/plugins/__PLUGIN_ID__/` as three files:

- `ui.tsx` — exports `__MODULE_PASCAL__UI` (React component)
- `logic.ts` — exports `__MODULE_CAMEL__Handler(action, payload, figma?)`
- `types.ts` — exports the `__MODULE_PASCAL__Action` union + payloads

Pure, testable logic goes in `utils/*.ts` with co-located `*.test.ts`. Keep the
Figma-bound code thin around that pure core.

Imports inside the module (`@shell/components`, `@shared/bridge`, `./types`)
resolve identically in this repo and the toolbox because both declare the
`@shell` / `@plugins` / `@shared` aliases (tsconfig + vite). Everything outside
`src/plugins/__PLUGIN_ID__/` is throwaway shell — the toolbox supplies its own.

## Commands

```bash
npm install
npm run build       # build UI (Vite) + plugin code (esbuild)
npm run typecheck   # tsc --noEmit
npm test            # Vitest (pure utils)
```

## Install in Figma

1. Open the Figma desktop app.
2. Plugins → Development → **Import plugin from manifest…**
3. Select `manifest.json`.

## Merging into the Tidy DS Toolbox

1. Copy `src/plugins/__PLUGIN_ID__/` into the toolbox's `src/plugins/`.
2. Register it in `src/moduleRegistry.ts`.
3. Route it in `src/moduleHandlers.ts` (`__PLUGIN_ID__` → `__MODULE_CAMEL__Handler`).
4. Add `__PLUGIN_ID__` to the `PluginID` union in `src/shared/types.ts`.
5. Delete this standalone shell.

## Status

The seeded module is a neutral **placeholder** ("count nodes") that proves the
UI ↔ plugin bridge end to end. Replace it with the real feature.
