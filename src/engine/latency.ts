import type { Node, UniverseMetadata } from "./configDecoder";

export interface HopLatency {
  voidDelay: number;
  atmosphereDelay: number;
  fiberDelay: number;
  towerDelay: number;
  totalDelay: number;
  distance: number;
}

/**
 * Calculates the exact latency between two connected nodes.
 */
export function calculateHopLatency(
  nodeA: Node,
  nodeB: Node,
  metadata: UniverseMetadata,
): HopLatency {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 1. Atmosphere Delay (ms)
  const delayAtmosphereA =
    nodeA.atmosphere_thickness_km /
    (metadata.speed_of_light_kms / nodeA.refraction_index);
  const delayAtmosphereB =
    nodeB.atmosphere_thickness_km /
    (metadata.speed_of_light_kms / nodeB.refraction_index);
  const totalAtmosphereDelayMs = (delayAtmosphereA + delayAtmosphereB) * 1000;

  // 2. Void Delay (ms)
  const voidDistance =
    distance - (nodeA.atmosphere_thickness_km + nodeB.atmosphere_thickness_km);
  const actualVoidDistance = Math.max(0, voidDistance);
  const totalVoidDelayMs =
    (actualVoidDistance / metadata.speed_of_light_kms) * 1000;

  // 3. Fiber Delay (ms)
  const fiberSpeed =
    metadata.speed_of_light_kms * metadata.fiber_speed_fraction;
  const delayFiberA = (nodeA.radius_km * Math.PI) / fiberSpeed;
  const delayFiberB = (nodeB.radius_km * Math.PI) / fiberSpeed;
  const totalFiberDelayMs = (delayFiberA + delayFiberB) * 1000;

  // 4. Tower Delay (ms)
  const towerDelayA = metadata.tower_processing_delay_ms * nodeA.active_towers;
  const towerDelayB = metadata.tower_processing_delay_ms * nodeB.active_towers;
  // We use the average of the two endpoints so that when summing up a route A->B->C,
  // Node B's tower delay is counted exactly once (B/2 from A->B + B/2 from B->C).
  const totalTowerDelayMs = (towerDelayA + towerDelayB) / 2;

  return {
    voidDelay: totalVoidDelayMs,
    atmosphereDelay: totalAtmosphereDelayMs,
    fiberDelay: totalFiberDelayMs,
    towerDelay: totalTowerDelayMs,
    totalDelay:
      totalVoidDelayMs +
      totalAtmosphereDelayMs +
      totalFiberDelayMs +
      totalTowerDelayMs,
    distance,
  };
}
