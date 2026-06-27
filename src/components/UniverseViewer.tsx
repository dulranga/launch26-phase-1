import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAppStore } from "../store";
import PlanetNode from "./PlanetNode";
import AnimatedSignalEdge from "./AnimatedSignalEdge";
import { calculateHopLatency } from "../engine/latency";
import { useState } from "react";

const nodeTypes = {
  planet: PlanetNode,
};

const edgeTypes = {
  signal: AnimatedSignalEdge,
};

export default function UniverseViewer() {
  const universeConfig = useAppStore((state) => state.universeConfig);
  const activeRoute = useAppStore((state) => state.activeRoute);
  const offlinePlanets = useAppStore((state) => state.offlinePlanets);
  const isAnimating = useAppStore((state) => state.isAnimating);
  const transmissionId = useAppStore((state) => state.transmissionId);
  const transmittedRoute = useAppStore((state) => state.transmittedRoute);

  const [rfInstance, setRfInstance] = useState<any | null>(null);

  const nodes: Node[] = useMemo(() => {
    if (!universeConfig) return [];

    return universeConfig.nodes.map((node) => ({
      id: node.id,
      type: "planet",
      position: { x: node.x * 5, y: node.y * 5 }, // Scaled for UI spacing
      data: { node },
      draggable: true,
    }));
  }, [universeConfig]);

  const edges: Edge[] = useMemo(() => {
    if (!universeConfig) return [];
    const newEdges: Edge[] = [];
    const rawNodes = universeConfig.nodes;

    // Build an ordered hop index map from the active route
    const routeHopMap = new Map<string, number>();
    if (activeRoute.path.length > 1) {
      for (let i = 0; i < activeRoute.path.length - 1; i++) {
        const a = activeRoute.path[i];
        const b = activeRoute.path[i + 1];
        routeHopMap.set(`${a}-${b}`, i);
        routeHopMap.set(`${b}-${a}`, i);
      }
    }
    const totalHops =
      activeRoute.path.length > 1 ? activeRoute.path.length - 1 : 1;

    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const nodeA = rawNodes[i];
        const nodeB = rawNodes[j];
        const hop = calculateHopLatency(
          nodeA,
          nodeB,
          universeConfig.universe_metadata,
        );

        if (
          hop.distance <=
          universeConfig.universe_metadata.max_void_hop_distance_km
        ) {
          const edgeKey = `${nodeA.id}-${nodeB.id}`;
          const hopIndex = routeHopMap.get(edgeKey) ?? -1;
          const isRouteEdge = hopIndex >= 0;
          const isTransmitted =
            transmittedRoute !== null &&
            transmittedRoute.path.some((id, idx) => {
              if (idx === transmittedRoute.path.length - 1) return false;
              const nextId = transmittedRoute.path[idx + 1];
              return (
                (id === nodeA.id && nextId === nodeB.id) ||
                (id === nodeB.id && nextId === nodeA.id)
              );
            });

          const isOfflineNode =
            offlinePlanets.has(nodeA.id) || offlinePlanets.has(nodeB.id);

          newEdges.push({
            id: edgeKey,
            source: nodeA.id,
            target: nodeB.id,
            type: "signal",
            animated: false, // We handle animation ourselves
            data: {
              isRouteEdge,
              isTransmitted,
              isAnimating: isAnimating && isRouteEdge,
              hopIndex: isRouteEdge ? hopIndex : 0,
              totalHops,
              transmissionId,
            },
            style: {
              stroke: isRouteEdge
                ? "#00F0FF"
                : isOfflineNode
                  ? "#450a0a"
                  : "#22d3ee",
              strokeWidth: isRouteEdge ? 4 : 1,
              opacity: isOfflineNode ? 0.15 : isRouteEdge ? 0.9 : 0.35,
            },
          });
        }
      }
    }
    return newEdges;
  }, [
    universeConfig,
    activeRoute,
    isAnimating,
    offlinePlanets,
    transmissionId,
    transmittedRoute,
  ]);

  if (!universeConfig) {
    return (
      <div className="flex items-center justify-center h-full text-cyan-500/50">
        Waiting for universe config...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-neutral-950 rounded-xl border border-cyan-400/45 overflow-hidden shadow-2xl relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onInit={(instance) => setRfInstance(instance)}
        onNodeClick={(_, node) => {
          const setSelected = useAppStore.getState().setSelectedPlanet;
          setSelected(node.id as string);
          if (!rfInstance || !node.position) return;

          // Prefer using the rendered node info from React Flow to compute exact center
          try {
            const rendered = rfInstance.getNode(node.id as string);
            if (rendered) {
              // React Flow exposes positionAbsolute which is the node's top-left in graph coords
              const px =
                (rendered.positionAbsolute?.x ??
                  rendered.position?.x ??
                  node.position.x) +
                (rendered.width ?? 0) / 2;
              const py =
                (rendered.positionAbsolute?.y ??
                  rendered.position?.y ??
                  node.position.y) +
                (rendered.height ?? 0) / 2;
              if (typeof rfInstance.setCenter === "function") {
                rfInstance.setCenter(px, py, { zoom: 1.6, duration: 800 });
                return;
              }
              rfInstance.setViewport(
                { x: px, y: py, zoom: 1.6 },
                { duration: 800 },
              );
              return;
            }
          } catch (e) {
            // ignore and fall back
          }

          // Fallback: simple center on node.position
          const fallbackX = node.position.x;
          const fallbackY = node.position.y;
          if (typeof rfInstance.setCenter === "function") {
            rfInstance.setCenter(fallbackX, fallbackY, {
              zoom: 1.6,
              duration: 800,
            });
            return;
          }
          rfInstance.setViewport(
            { x: fallbackX, y: fallbackY, zoom: 1.6 },
            { duration: 800 },
          );
        }}
        minZoom={0.01}
        maxZoom={5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e3a8a" gap={20} size={1} />
        <Controls className="bg-neutral-900 border border-white/10 text-cyan-500 fill-cyan-500" />
      </ReactFlow>
      <div className="absolute top-4 left-4 text-xs font-bold text-cyan-500/50 uppercase tracking-widest pointer-events-none">
        Launch-26 System ({universeConfig.nodes.length} Planetary Nodes)
      </div>
    </div>
  );
}
