---
name: tidy-plugin-scaffold
description: Scaffold a new standalone Figma plugin pre-wired to match the Tidy DS Toolbox architecture (React 19 + Vite UI, esbuild plugin thread, typed postMessage bridge, three-file module pattern, @shell/@shared/@plugins aliases, Vitest). Built so the plugin can later be merged into the Tidy DS Toolbox as a sub-module by copying one folder and adding three registration lines. Use when starting a new Figma plugin intended for the Tidy DS Toolbox, or when the user asks to scaffold/bootstrap/start a toolbox-compatible Figma plugin.
---

# Tidy Plugin Scaffold

Scaffold a new standalone Figma plugin whose feature code is structured exactly
like a Tidy DS Toolbox **module**, so that merging it into the toolbox later is
"copy `src/plugins/<id>/` + register in three places" rather than a rewrite.

The standalone shell (App, code.ts, build config, shared infra) is deliberately
**throwaway** — the toolbox supplies its own. The exactness budget goes into the
module folder and the bridge contract, which migrate unchanged.

## Inputs

Gather the plugin's display name (from the user's argument or by asking). Derive
four tokens from it — confirm them with the user before writing:

| Token | Meaning | Example |
| --- | --- | --- |
| `__PLUGIN_NAME__` | Display name (manifest, header, README) | `Tidy Color Finder` |
| `__PLUGIN_ID__` | kebab-case id (folder, manifest id, bridge `target`) | `tidy-color-finder` |
| `__MODULE_PASCAL__` | PascalCase, for `…UI` component + `…Action` type | `TidyColorFinder` |
| `__MODULE_CAMEL__` | camelCase, for `…Handler` export | `tidyColorFinder` |

Also choose the destination directory (default: a new folder named `__PLUGIN_ID__`
in the current working directory).

## Process

### 1. (Optional) Sync versions from a local toolbox checkout

If a Tidy DS Toolbox repo is available locally (ask the user for the path, or
look for a sibling `Tidy DS Toolbox/` directory), read its `package.json` and
match these so the migrating files behave identically in both repos:

- `@figma/plugin-typings` (most important — newer async APIs differ across versions)
- `react` / `react-dom` / `@types/react*`
- `vite` / `@vitejs/plugin-react` / `esbuild` / `vitest`

Also skim its `src/plugins/<any-module>/` trio and `src/shared/types.ts` to
confirm the module conventions below haven't drifted. If no checkout is
available, use the pinned versions in `template/package.json` as-is and tell the
user to verify against the toolbox before merging.

### 2. Copy the template and substitute tokens

`SKILL_DIR` is the base directory of this skill (provided at invocation).

```bash
SKILL_DIR="<this skill's base directory>"
DEST="<destination directory>"
PLUGIN_NAME="Tidy Color Finder"      # __PLUGIN_NAME__
PLUGIN_ID="tidy-color-finder"        # __PLUGIN_ID__
MODULE_PASCAL="TidyColorFinder"      # __MODULE_PASCAL__
MODULE_CAMEL="tidyColorFinder"       # __MODULE_CAMEL__

cp -R "$SKILL_DIR/template" "$DEST"
mv "$DEST/src/plugins/example-module" "$DEST/src/plugins/$PLUGIN_ID"
mv "$DEST/gitignore" "$DEST/.gitignore"   # template ships it unprefixed to survive packaging

# Substitute tokens across all text files. `find -exec sed` is used instead of a
# `grep | while read` loop because that loop's NUL handling breaks under zsh
# (the default macOS shell). macOS/BSD sed needs the '' after -i; on Linux use
# `sed -i` with no ''.
find "$DEST" -type f \
  \( -name '*.ts' -o -name '*.tsx' -o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.md' \) \
  -exec sed -i '' \
    -e "s/__PLUGIN_NAME__/$PLUGIN_NAME/g" \
    -e "s/__PLUGIN_ID__/$PLUGIN_ID/g" \
    -e "s/__MODULE_PASCAL__/$MODULE_PASCAL/g" \
    -e "s/__MODULE_CAMEL__/$MODULE_CAMEL/g" {} +

# Verify no tokens remain:
grep -rn -e '__PLUGIN_NAME__' -e '__PLUGIN_ID__' -e '__MODULE_PASCAL__' -e '__MODULE_CAMEL__' "$DEST" || echo "clean"
```

### 3. Install and verify

```bash
cd "$DEST"
npm install
npm run typecheck   # must pass
npm test            # the seeded pure-util test must pass
npm run build       # produces dist/code.js + dist/index.html
```

All four must succeed before handing off. If any fail, fix before declaring done.

### 4. Hand off

Tell the user how to load it (Figma → Plugins → Development → Import plugin from
manifest → `manifest.json`) and that the seeded module is a neutral placeholder
(a "count nodes" round-trip proving the bridge) to be replaced with the real
feature. Point them at the three-file module to build in.

## Module conventions that MUST match the toolbox (migration-critical)

These are the whole reason the scaffold exists. Do not deviate:

- `src/plugins/<id>/ui.tsx` exports `__MODULE_PASCAL__UI` (the toolbox
  `moduleRegistry` imports this exact name).
- `src/plugins/<id>/logic.ts` exports
  `async function __MODULE_CAMEL__Handler(action: string, payload: any, figma?: PluginAPI): Promise<any>`
  (the toolbox `moduleHandlers` imports this name + signature).
- `src/plugins/<id>/types.ts` exports a `__MODULE_PASCAL__Action` string-literal
  union the handler switches on (the toolbox casts `action as XxxAction`).
- Imports inside the module use the aliases `@shell/components`, `@shared/bridge`,
  `./types` — and these resolve in BOTH repos because the aliases are declared in
  `tsconfig.json` (paths) AND `vite.config.ts` (resolve.alias), with shared
  components at `src/components`.
- The bridge envelope is `{ target, action, payload, requestId }`; the module's
  `target` is `__PLUGIN_ID__`.
- Pure, testable logic goes in `src/plugins/<id>/utils/*.ts` with co-located
  `*.test.ts` (Vitest). Keep the Figma-bound tree walk / page rendering thin
  around the pure core — that core is the high test seam.

## Migrating into the Tidy DS Toolbox later

1. Copy `src/plugins/<id>/` into the toolbox's `src/plugins/`.
2. Register the module in `src/moduleRegistry.ts` (id, label, state, icon, `ui`,
   `handler`, keywords).
3. Route it in `src/moduleHandlers.ts` (map `target` → `__MODULE_CAMEL__Handler`).
4. Add `<id>` to the `PluginID` union in `src/shared/types.ts`.
5. Delete the standalone shell (everything outside `src/plugins/<id>/`).

Nothing inside the module folder should need editing.
