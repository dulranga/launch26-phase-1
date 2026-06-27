import { useMemo } from "react";
import { useAppStore } from "../store";
import { convertPayloadToCodex } from "../engine/codex";
import { SciFiCard } from "../ui/SciFiCard";

export default function CodexPanel() {
  const activeRoute = useAppStore((state) => state.activeRoute);
  const messagePayload = useAppStore((state) => state.messagePayload);
  const universeConfig = useAppStore((state) => state.universeConfig);

  const phases = useMemo(() => {
    if (
      activeRoute.status !== "success" ||
      !universeConfig ||
      !messagePayload ||
      activeRoute.path.length < 2
    )
      return null;

    const result = [];

    // Generate hop phases
    for (let i = 0; i < activeRoute.path.length - 1; i++) {
      const sourceId = activeRoute.path[i];
      const targetId = activeRoute.path[i + 1];
      const sourceNode = universeConfig.nodes.find((n) => n.id === sourceId)!;
      const targetNode = universeConfig.nodes.find((n) => n.id === targetId)!;

      const conversions = convertPayloadToCodex(
        messagePayload,
        targetNode.codex,
      );
      const asciiArray = conversions.map((c) => c.ascii).join(", ");
      const convertedArray = conversions.map((c) => c.converted).join(", ");

      result.push({
        phaseNum: i + 1,
        type: i === 0 ? "Origin" : "Relay",
        sourceNode,
        targetNode,
        asciiArray,
        convertedArray,
        conversions,
      });
    }

    const finalNode = universeConfig.nodes.find(
      (n) => n.id === activeRoute.path[activeRoute.path.length - 1],
    )!;

    return {
      hops: result,
      finalNode,
      payload: messagePayload,
    };
  }, [activeRoute, messagePayload, universeConfig]);

  if (!phases) return null;

  return (
    <SciFiCard className="p-4 flex flex-col gap-4 mt-4 h-full max-h-[600px] overflow-hidden font-mono text-xs">
      <h2 className="flex-shrink-0 text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-cyan-500/20 pb-2 bg-transparent">
        Multi-Hop Transmission Log
      </h2>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4">
        {phases.hops.map((hop, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 border-l-2 border-cyan-900/50 pl-3 py-1"
          >
            <span className="text-cyan-500 font-bold">
              [SYS] PHASE {hop.phaseNum} INITIALIZED: {hop.type.toUpperCase()}{" "}
              AT {hop.sourceNode.id.toUpperCase()} (BASE {hop.sourceNode.codex})
            </span>

            {hop.type === "Relay" && (
              <span className="text-neutral-400">
                <span className="text-cyan-700">[INFO]</span> VOID ARRIVAL &
                LOCAL DECODING COMPLETE.
              </span>
            )}

            <span className="text-neutral-400">
              <span className="text-cyan-700">[PROC]</span> PAYLOAD MAPPED TO
              ASCII BUFFER:
            </span>
            <span className="text-cyan-200">&gt; [{hop.asciiArray}]</span>

            <span className="text-neutral-400 mt-1">
              <span className="text-cyan-700">[PROC]</span> CONVERTING TO TARGET
              CODEX (BASE {hop.targetNode.codex}):
            </span>
            <span className="text-cyan-300">&gt; [{hop.convertedArray}]</span>

            <span className="text-cyan-500/70 mt-1">
              [TX] SERIALIZING STREAM FOR VOID TRANSMISSION...
            </span>
          </div>
        ))}

        {/* Final Destination */}
        <div className="flex flex-col gap-1 border-l-2 border-green-500/50 pl-3 py-1 mt-2">
          <span className="text-green-400 font-bold">
            [SYS] PHASE {phases.hops.length + 1} INITIALIZED: FINAL DESTINATION
            AT {phases.finalNode.id.toUpperCase()} (BASE{" "}
            {phases.finalNode.codex})
          </span>

          <span className="text-neutral-400">
            <span className="text-green-700">[INFO]</span> VOID ARRIVAL & SIGNAL
            CAPTURED.
          </span>

          <span className="text-neutral-400">
            <span className="text-green-700">[PROC]</span> FINAL DECODING TO
            ASCII EXECUTED.
          </span>

          <span className="text-green-300 mt-2 font-bold tracking-widest bg-green-950/30 p-2 border border-green-500/20">
            [SUCCESS] PAYLOAD DELIVERED: "{phases.payload}"
          </span>
        </div>
      </div>
    </SciFiCard>
  );
}
