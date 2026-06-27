import { Handle, Position } from "reactflow";
import { useAppStore } from "../store";
import { type Node } from "../engine/configDecoder";

interface PlanetNodeProps {
  data: {
    node: Node;
  };
}

export default function PlanetNode({ data }: PlanetNodeProps) {
  const { node } = data;
  const offlinePlanets = useAppStore((state) => state.offlinePlanets);
  const isOffline = offlinePlanets.has(node.id);

  // Generate some towers sticking out
  const towers = Array.from({ length: node.active_towers }).map((_, i) => {
    const angle = (i * 360) / node.active_towers;
    return (
      <div
        key={i}
        className={`absolute w-1 h-3 rounded-t-sm origin-bottom ${
          isOffline ? "bg-red-900" : "bg-cyan-400"
        } shadow-[0_0_8px_rgba(34,211,238,0.8)]`}
        style={{
          top: "calc(50% - 12px)",
          left: "calc(50% - 2px)",
          transformOrigin: "50% 100%",
          transform: `rotate(${angle}deg) translateY(-24px)`,
          transition: "all 0.3s ease",
        }}
      />
    );
  });

  return (
    <div className="relative flex flex-col items-center justify-center w-24 h-24 group">
      {/* Target Handles for ReactFlow */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      {/* Towers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {towers}
      </div>

      {/* Planet Sphere */}
      <div
        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 shadow-2xl transition-all duration-300 ${
          isOffline
            ? "bg-gradient-to-br from-red-950 to-neutral-900 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_2px_2px_8px_rgba(255,255,255,0.1)]"
            : "bg-gradient-to-br from-cyan-600 to-blue-950 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_2px_2px_8px_rgba(255,255,255,0.3),0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
        }`}
      >
        {/* Atmospheric Glow */}
        {!isOffline && (
          <div className="absolute inset-[-4px] rounded-full bg-cyan-400/20 blur-sm -z-10 animate-pulse" />
        )}
      </div>

      {/* Label */}
      <div className="absolute -bottom-6 flex flex-col items-center">
        <span
          className={`text-xs font-bold uppercase tracking-widest ${
            isOffline ? "text-red-500/70" : "text-cyan-100"
          }`}
        >
          {node.id}
        </span>
        <span className="text-[9px] text-cyan-500/50">Codex: {node.codex}</span>
      </div>
    </div>
  );
}
