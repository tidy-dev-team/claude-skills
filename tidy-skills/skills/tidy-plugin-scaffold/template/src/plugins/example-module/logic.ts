/// <reference types="@figma/plugin-typings" />

import {
  __MODULE_PASCAL__Action,
  CountNodesPayload,
  CountNodesResult,
} from "./types";
import { describeCount } from "./utils/summarize";

/**
 * __PLUGIN_NAME__ handler — processes messages from the UI.
 *
 * Signature matches the parent Tidy DS Toolbox module contract
 * `(action, payload, figma?) => Promise<any>` so it can be wired into the
 * toolbox's moduleHandlers without changes.
 */
export async function __MODULE_CAMEL__Handler(
  action: string,
  payload: any,
  _figma?: PluginAPI,
): Promise<any> {
  switch (action as __MODULE_PASCAL__Action) {
    case "count-nodes":
      return countNodes(payload as CountNodesPayload);

    default:
      console.warn(`Unknown action: ${action}`);
      return null;
  }
}

function countNodes(payload: CountNodesPayload): CountNodesResult {
  const useSelection =
    (payload?.scope ?? "selection") === "selection" &&
    figma.currentPage.selection.length > 0;

  const roots: readonly SceneNode[] = useSelection
    ? figma.currentPage.selection
    : figma.currentPage.children;

  let count = 0;
  const visit = (node: SceneNode) => {
    count += 1;
    if ("children" in node) {
      for (const child of node.children) visit(child);
    }
  };
  for (const root of roots) visit(root);

  const scope = useSelection ? "selection" : "page";
  return { scope, count, summary: describeCount(count, scope) };
}
