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
            className="border border-cyan-900/40 bg-cyan-950/10 flex-shrink-0 overflow-hidden"
          >
            {/* Hop header */}
            <div className="flex justify-between items-center px-3 py-2 bg-cyan-900/20 border-b border-cyan-900/40">
              <span className="text-cyan-200 font-bold text-xs uppercase tracking-widest font-mono">
                HOP {i + 1} &nbsp; {hop.source}{" "}
                <span className="text-cyan-500">→</span> {hop.target}
              </span>
              <span className="text-white font-bold text-xs font-mono tabular-nums">
                {hop.totalDelay.toFixed(2)}{" "}
                <span className="text-cyan-500 font-normal">ms</span>
              </span>
            </div>

            {/* Delay rows */}
            <div className="flex flex-col divide-y divide-white/5 px-3 py-1">
              {[
                { label: "Fiber", value: hop.fiberDelay, color: "bg-cyan-400" },
                { label: "Tower", value: hop.towerDelay, color: "bg-sky-400" },
                {
                  label: "Atmosphere",
                  value: hop.atmosphereDelay,
                  color: "bg-violet-400",
                },
                { label: "Void", value: hop.voidDelay, color: "bg-indigo-400" },
              ].map(({ label, value, color }) => {
                const pct = Math.min(100, (value / hop.totalDelay) * 100);
                return (
                  <div key={label} className="flex items-center gap-3 py-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono w-20 shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full opacity-70`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-cyan-300 text-[11px] font-mono tabular-nums w-14 text-right shrink-0">
                      {value.toFixed(2)} ms
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SciFiCard>
  );
}
