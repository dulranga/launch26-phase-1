import { Handle, Position } from "reactflow";
import { useAppStore } from "../store";
import { type Node } from "../engine/configDecoder";
import sphereImg from "../assets/sphere.png";
import towerImg from "../assets/tower.png";
import { useState } from "react";

interface PlanetNodeProps {
  data: {
    node: Node;
  };
}

/**
 * Generates a stable, deterministic set of variations based on the unique node ID.
 * This keeps the planet aesthetics random but consistent between re-renders.
 */
const getDeterministicRandoms = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const planetHue = Math.abs((hash * 13) % 360);
  const towerHue = Math.abs((hash * 37) % 360);
  const planetRotation = Math.abs((hash * 7) % 360);
  return { planetHue, towerHue, planetRotation };
};

export default function PlanetNode({ data }: PlanetNodeProps) {
  const { node } = data;
  const offlinePlanets = useAppStore((state) => state.offlinePlanets);
  const isOffline = offlinePlanets.has(node.id);

  // Compute precise scaling metrics from the node's radius
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const sphereSize = clamp(Math.round(node.radius_km / 40), 80, 300);
  const containerSize = sphereSize * 2.6; // Bounding size expected by React Flow dimensions
  const towerCount = Math.max(1, node.active_towers);
  const towerHeight = Math.round(sphereSize * 0.35);
  const towerWidth = Math.max(6, Math.round(sphereSize * 0.12));
  const labelBottom = Math.round(sphereSize * 0.1);

  const { planetHue, towerHue, planetRotation } = getDeterministicRandoms(node.id);

  const [hovered, setHovered] = useState(false);

  // Generate Towers sitting perfectly on the sphere edge
  const towers = Array.from({ length: towerCount }).map((_, i) => {
    const angle = (i * 360) / towerCount;

    return (
      <img
        key={i}
        src={towerImg}
        alt="Tower"
        className="absolute transition-all duration-300 object-contain"
        style={{
          width: `${towerWidth}px`,
          height: `${towerHeight}px`,
          // Anchors the bottom-center of the tower to the dead center of the container
          top: `calc(50% - ${towerHeight}px)`,
          left: `calc(50% - ${towerWidth / 2}px)`,
          transformOrigin: "50% 100%",
          // Rotates the tower vector and pushes it out past the radius of the planet crust
          transform: `rotate(${angle + planetRotation}deg) translateY(-${Math.round(sphereSize / 2)}px)`,
          filter: isOffline
            ? "grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-50deg) saturate(600%)"
            : `hue-rotate(${towerHue}deg)`,
        }}
      />
    );
  });

  return (
    <div
      className="relative w-full h-full group"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {/* Target Handles for ReactFlow */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      {/* Towers Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {towers}
      </div>

      {/* Planet Sphere */}
      <div
        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300"
        style={{ width: `${sphereSize}px`, height: `${sphereSize}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Dynamic Atmospheric Glow */}
        {!isOffline && (
          <div
            className="absolute rounded-full blur-md -z-10 animate-pulse transition-all duration-300 opacity-60 group-hover:opacity-90"
            style={{
              inset: `-${Math.round(sphereSize * 0.12)}px`,
              backgroundColor: `hsl(${planetHue}, 80%, 60%)`,
              boxShadow: `0 0 ${Math.round(sphereSize * 0.2)}px hsl(${planetHue}, 80%, 50%)`,
            }}
          />
        )}

        <img
          src={sphereImg}
          alt={node.id}
          className="w-full h-full object-cover rounded-full border border-white/10 shadow-2xl"
          style={{
            display: "block",
            transform: `rotate(${planetRotation}deg)`,
            filter: isOffline
              ? "grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-50deg) saturate(500%)"
              : `hue-rotate(${planetHue}deg)`,
          }}
        />

        {/* Hover popup for atmosphere details */}
        {hovered && (
          <div
            className="absolute left-1/2 -translate-x-1/2 text-xs text-cyan-100 bg-neutral-900/80 border border-white/10 rounded-md p-2 shadow-lg z-30"
            style={{
              top: `calc(50% - ${Math.round(sphereSize / 2)}px - 10px)`,
              minWidth: Math.max(140, Math.round(sphereSize * 0.6)),
            }}
          >
            <div className="font-bold text-sm">Atmosphere</div>
            <div className="text-[12px] text-cyan-300">Thickness: {node.atmosphere_thickness_km} km</div>
            <div className="text-[12px] text-cyan-300">Refraction index: {node.refraction_index}</div>
          </div>
        )}
      </div>

      {/* Label Layout */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap z-20"
        style={{ bottom: `${labelBottom}px` }}
      >
        <span
          className={`font-bold uppercase tracking-widest ${
            isOffline ? "text-red-500/70" : "text-cyan-100"
          }`}
          style={{ fontSize: Math.max(14, Math.round(sphereSize * 0.14)) }}
        >
          {node.id}
        </span>
        <span
          className="text-cyan-500/50"
          style={{ fontSize: Math.max(10, Math.round(sphereSize * 0.1)) }}
        >
          Codex: {node.codex}
        </span>
      </div>
    </div>
  );
}