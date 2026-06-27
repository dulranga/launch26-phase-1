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

  // Compute sizes from node radius for larger visuals
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const sphereSize = clamp(Math.round(node.radius_km / 40), 80, 300); // px (larger)
    const containerSize = sphereSize * 2.6; // more room for towers/glow
    const towerCount = Math.max(1, node.active_towers);
    const towerHeight = Math.round(sphereSize * 0.35); // px (taller towers)
    const towerWidth = Math.max(3, Math.round(sphereSize * 0.08));
    const labelBottom = Math.round(sphereSize * 0.7);

  // Generate some towers sticking out
  const towers = Array.from({ length: towerCount }).map((_, i) => {
    const angle = (i * 360) / towerCount;
    return (
      <div
        key={i}
        className={`absolute rounded-t-sm origin-bottom ${
          isOffline ? "bg-red-900" : "bg-cyan-400"
        } shadow-[0_0_8px_rgba(34,211,238,0.8)]`}
        style={{
          width: `${towerWidth}px`,
          height: `${towerHeight}px`,
          top: `calc(50% - ${Math.round(towerHeight / 2)}px)`,
          left: `calc(50% - ${Math.round(towerWidth / 2)}px)`,
          transformOrigin: "50% 100%",
          transform: `rotate(${angle}deg) translateY(-${Math.round(
            sphereSize * 0.6,
          )}px)`,
          transition: "all 0.3s ease",
          borderRadius: "4px 4px 0 0",
        }}
      />
    );
  });

  return (
    <div
      className="relative flex flex-col items-center justify-center group"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {/* Target Handles for ReactFlow */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      {/* Towers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {towers}
      </div>

      {/* Planet Sphere */}
      <div
        className={`absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-white/10 shadow-2xl transition-all duration-300 ${
          isOffline
            ? "bg-gradient-to-br from-red-950 to-neutral-900 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_2px_2px_8px_rgba(255,255,255,0.1)]"
            : "bg-gradient-to-br from-cyan-600 to-blue-950 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_2px_2px_8px_rgba(255,255,255,0.3),0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
        }`}
        style={{ width: `${sphereSize}px`, height: `${sphereSize}px` }}
      >
        {/* Atmospheric Glow */}
        {!isOffline && (
          <div
            className="absolute rounded-full bg-cyan-400/20 blur-sm -z-10 animate-pulse"
            style={{ inset: `-${Math.round(sphereSize * 0.08)}px` }}
          />
        )}
      </div>

      {/* Label */}
      <div
        className="absolute flex flex-col items-center"
        style={{ bottom: `-${labelBottom}px` }}
      >
        <span
          className={`font-bold uppercase tracking-widest ${
              isOffline ? "text-red-500/70" : "text-cyan-100"
            }`}
            style={{ fontSize: Math.max(20, Math.round(sphereSize * 0.18)) }}
        >
          {node.id}
        </span>
        <span
          className="text-cyan-500/50"
            style={{ fontSize: Math.max(16, Math.round(sphereSize * 0.14)) }}
        >
          Codex: {node.codex}
        </span>
      </div>
    </div>
  );
}