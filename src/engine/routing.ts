import type { UniverseConfig, Node } from "./configDecoder";
import { calculateHopLatency, type HopLatency } from "./latency";
import type { RouteResult, LatencyBreakdown } from "../store";

interface GraphEdge {
  target: string;
  latency: HopLatency;
}

export function findRoute(
  sourceId: string,
  targetId: string,
  config: UniverseConfig,
  offlinePlanets: Set<string>,
): RouteResult {
  const nodes = config.nodes.filter((n) => !offlinePlanets.has(n.id));
  const nodeMap = new Map<string, Node>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  if (!nodeMap.has(sourceId) || !nodeMap.has(targetId)) {
    return { path: [], hops: [], totalLatency: 0, status: "undeliverable" };
  }

  if (sourceId === targetId) {
    return { path: [sourceId], hops: [], totalLatency: 0, status: "success" };
  }

  // Build Adjacency List
  const graph = new Map<string, GraphEdge[]>();
  nodes.forEach((n) => graph.set(n.id, []));

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      const hop = calculateHopLatency(nodeA, nodeB, config.universe_metadata);

      if (hop.distance <= config.universe_metadata.max_void_hop_distance_km) {
        graph.get(nodeA.id)!.push({ target: nodeB.id, latency: hop });
        graph.get(nodeB.id)!.push({ target: nodeA.id, latency: hop });
      }
    }
  }

  // Dijkstra's Algorithm
  const distances = new Map<string, number>();
  const previous = new Map<string, { node: string; hop: HopLatency } | null>();
  const unvisited = new Set<string>();

  nodes.forEach((n) => {
    distances.set(n.id, Infinity);
    previous.set(n.id, null);
    unvisited.add(n.id);
  });
  distances.set(sourceId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current = null;
    let minDistance = Infinity;
    for (const nodeId of unvisited) {
      const d = distances.get(nodeId)!;
      if (d < minDistance) {
        minDistance = d;
        current = nodeId;
      }
    }

    if (!current || minDistance === Infinity) break;
    if (current === targetId) break;

    unvisited.delete(current);

    const edges = graph.get(current) || [];
    for (const edge of edges) {
      if (!unvisited.has(edge.target)) continue;

      const alt = distances.get(current)! + edge.latency.totalDelay;
      if (alt < distances.get(edge.target)!) {
        distances.set(edge.target, alt);
        previous.set(edge.target, { node: current, hop: edge.latency });
      }
    }
  }

  if (distances.get(targetId) === Infinity) {
    return { path: [], hops: [], totalLatency: 0, status: "undeliverable" };
  }

  // Reconstruct path
  const path: string[] = [];
  const hops: LatencyBreakdown[] = [];
  let current: string | null = targetId;

  while (current) {
    path.unshift(current);
    const prev = previous.get(current);
    if (prev) {
      hops.unshift({
        source: prev.node,
        target: current,
        voidDelay: prev.hop.voidDelay,
        atmosphereDelay: prev.hop.atmosphereDelay,
        fiberDelay: prev.hop.fiberDelay,
        towerDelay: prev.hop.towerDelay,
        totalDelay: prev.hop.totalDelay,
      });
      current = prev.node;
    } else {
      current = null;
    }
  }

  const totalLatency = hops.reduce((sum, h) => sum + h.totalDelay, 0);

  // Add the remaining halves of the tower delay for the source and destination endpoints
  const sourceNode = nodeMap.get(sourceId)!;
  const targetNode = nodeMap.get(targetId)!;
  const sourceHalfDelay =
    (config.universe_metadata.tower_processing_delay_ms *
      sourceNode.active_towers) /
    2;
  const targetHalfDelay =
    (config.universe_metadata.tower_processing_delay_ms *
      targetNode.active_towers) /
    2;
  const finalTotalLatency = totalLatency + sourceHalfDelay + targetHalfDelay;

  if (hops.length > 0) {
    hops[0].towerDelay += sourceHalfDelay;
    hops[0].totalDelay += sourceHalfDelay;
    hops[hops.length - 1].towerDelay += targetHalfDelay;
    hops[hops.length - 1].totalDelay += targetHalfDelay;
  }

  return {
    path,
    hops,
    totalLatency: finalTotalLatency,
    status: "success",
  };
}
