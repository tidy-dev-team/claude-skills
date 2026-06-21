/// <reference types="@figma/plugin-typings" />

/**
 * Type definitions for the __PLUGIN_NAME__ module.
 *
 * Mirrors the parent Tidy DS Toolbox module convention: a string-literal action
 * union the handler switches on, plus payload/result interfaces shared between
 * ui.tsx and logic.ts.
 *
 * This is a PLACEHOLDER feature ("count nodes") that proves the bridge round
 * trip. Replace the action(s) and payloads with the real feature.
 */

export type __MODULE_PASCAL__Action = "count-nodes";

export interface CountNodesPayload {
  scope?: "selection" | "page";
  requestId?: string;
}

export interface CountNodesResult {
  scope: "selection" | "page";
  count: number;
  summary: string;
}
