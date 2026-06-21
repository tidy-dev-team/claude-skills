import { useCallback, useEffect, useState } from "react";
import { Card } from "@shell/components";
import { postToFigma } from "@shared/bridge";
import { IconRefresh } from "@tabler/icons-react";
import { CountNodesResult } from "./types";

export function __MODULE_PASCAL__UI() {
  const [scope, setScope] = useState<"selection" | "page">("selection");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CountNodesResult | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage || event.data;
      if (!message) return;
      if (message.type === "response" && message.requestId === "count-nodes") {
        setResult(message.result as CountNodesResult);
        setRunning(false);
      } else if (message.type === "error") {
        setRunning(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleRun = useCallback(() => {
    setRunning(true);
    setResult(null);
    postToFigma({
      target: "__PLUGIN_ID__",
      action: "count-nodes",
      payload: { scope },
      requestId: "count-nodes",
    });
  }, [scope]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--pixel-16, 16px)",
        padding: "var(--pixel-16, 16px)",
      }}
    >
      <div className="status-message">
        <strong>Placeholder feature.</strong> This counts nodes to prove the
        UI&nbsp;↔&nbsp;plugin bridge. Replace it with the real feature in this
        module (ui.tsx / logic.ts / types.ts).
      </div>

      <Card title="Count nodes">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={scope === "selection" ? "" : "secondary"}
              onClick={() => setScope("selection")}
            >
              Selection
            </button>
            <button
              className={scope === "page" ? "" : "secondary"}
              onClick={() => setScope("page")}
            >
              Whole page
            </button>
          </div>
          <button
            onClick={handleRun}
            disabled={running}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconRefresh size={16} stroke={1.5} />
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </Card>

      {result && <div className="status-message success">{result.summary}</div>}
    </div>
  );
}
