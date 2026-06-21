import { PluginMessage, ShellMessage } from "./types";

// Send a message from the UI to the plugin (main) thread.
export function postToFigma(message: PluginMessage): void {
  parent.postMessage({ pluginMessage: message }, "*");
}

// Send a message from the plugin (main) thread to the UI.
export function postToUI(message: ShellMessage): void {
  figma.ui.postMessage(message);
}

// Open a URL in the user's browser. Anchor navigation does not work inside
// Figma's iframe, so the main thread handles this via figma.openExternal.
export function openExternalLink(url: string): void {
  parent.postMessage(
    { pluginMessage: { type: "open-external-link", url } },
    "*",
  );
}
