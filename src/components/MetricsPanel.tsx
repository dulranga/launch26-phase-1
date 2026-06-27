import { useAppStore } from "../store";
import { SciFiCard } from "../ui/SciFiCard";

export default function MetricsPanel() {
  const activeRoute = useAppStore((state) => state.activeRoute);

  if (activeRoute.status === "idle") {
    return (
      <SciFiCard className="p-4 flex flex-col items-center justify-center h-full min-h-[300px]">
        <span className="text-cyan-500/30 text-sm tracking-widest uppercase text-center font-bold">
          Awaiting Transmission Route
        </span>
      </SciFiCard>
    );
  }

  if (activeRoute.status === "undeliverable") {
    return (
      <SciFiCard
        theme="destructive"
        className="p-4 flex flex-col items-center justify-center h-full min-h-[300px]"
      >
        <span className="text-red-500 font-bold tracking-widest uppercase mb-2">
          Route Undeliverable
        </span>
        <span className="text-red-400/50 text-xs text-center max-w-[200px]">
          Target exceeds max void hop distance and no intermediate routing paths
          are available.
        </span>
      </SciFiCard>
    );
  }

  return (
    <SciFiCard className="p-4 flex flex-col h-full max-h-[500px]">
      {/* 1. Header & Path Sequence Block (Stays Static at the top) */}
      <div className="flex-shrink-0 pb-4">
        <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-cyan-500/20 pb-2 mb-4 flex justify-between">
          <span>Routing Metrics</span>
          <span className="text-white">
            {activeRoute.totalLatency.toFixed(2)} ms
          </span>
        </h2>

        <div className="flex items-center gap-2 text-xs font-mono tracking-wider overflow-x-auto pb-2 whitespace-nowrap custom-scrollbar">
          {activeRoute.path.map((node, i) => (
            <div key={node} className="flex items-center gap-2 text-cyan-100">
              <span className="bg-cyan-900/50 px-2 py-1 rounded border border-cyan-500/20">
                {node}
              </span>
              {i < activeRoute.path.length - 1 && (
                <span className="text-cyan-500/50">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Scrollable Hop Latency Container Fix */}
      {/* flex-1 lets it claim remaining room, min-h-0 anchors the height bounds for overflow */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-1">
        <h3 className="text-xs text-cyan-500/70 font-bold uppercase tracking-widest sticky top-0 bg-neutral-900/90 backdrop-blur-sm py-1 z-10">
          Hop Latency Breakdown
        </h3>

        {activeRoute.hops.map((hop, i) => (
          <div
            key={i}
            className="bg-neutral-950 border border-white/5 rounded p-3 text-xs font-mono flex-shrink-0"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2 text-cyan-200 font-bold uppercase tracking-wider">
              <span>
                {hop.source} → {hop.target}
              </span>
              <span>{hop.totalDelay.toFixed(2)} ms</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
              <div className="flex justify-between">
                <span>Fiber:</span>
                <span className="text-cyan-500">
                  {hop.fiberDelay.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tower:</span>
                <span className="text-cyan-500">
                  {hop.towerDelay.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Atmos:</span>
                <span className="text-cyan-500">
                  {hop.atmosphereDelay.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Void:</span>
                <span className="text-cyan-500">
                  {hop.voidDelay.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SciFiCard>
  );
}
