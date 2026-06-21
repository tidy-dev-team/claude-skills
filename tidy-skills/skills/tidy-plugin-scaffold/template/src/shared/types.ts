// Shared message types. Mirrors the envelope used by the parent Tidy DS Toolbox
// so module code (src/plugins/__PLUGIN_ID__/) can move over without edits.

export type PluginID = "__PLUGIN_ID__" | (string & {});

export interface PluginMessage {
  target: PluginID;
  action: string;
  payload?: any;
  requestId?: string;
}

export interface ShellMessage {
  type: "resize" | "response" | "error" | string;
  payload?: any;
  requestId?: string;
  result?: any;
}
