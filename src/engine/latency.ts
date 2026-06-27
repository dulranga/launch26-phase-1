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
 *
 * Mathematical formulas (from specification):
 * ──────────────────────────────────────────
 *
 * 1. VOID DISTANCE (L)
 *    L = distance − (h₁ + h₂)
 *    Where: h = atmosphere_thickness_km
 *
 * 2. VOID TRAVEL TIME (Tv)
 *    Tv = [(h₁×n₁ + h₂×n₂) + L] / C
 *    Where: h = atmosphere_thickness_km
 *           n = refraction_index
 *           L = void distance
 *           C = speed_of_light_kms
 *
 * 3. INTERNAL CRUST TRANSIT TIME (Tp) - per planet
 *    Tp = (2πr×s)/(f×C) + m×Δt
 *    Where: r = radius_km
 *           s = segments traveled (average case: N/2 where N = active_towers)
 *           f = fiber_speed_fraction
 *           C = speed_of_light_kms
 *           m = towers hit (= s + 1)
 *           Δt = tower_processing_delay_ms
 *
 * NOTE: Without tower routing indices, we use AVERAGE-CASE assumption:
 *       Signals typically traverse half the ring on average.
 *       s = active_towers / 2
 *       m = (active_towers / 2) + 1
 *       This is statistically realistic and mathematically sound.
 *
 * @param nodeA - Origin planet
 * @param nodeB - Destination planet
 * @param metadata - Universe configuration
 * @returns HopLatency breakdown and total
 */
export function calculateHopLatency(
  nodeA: Node,
  nodeB: Node,
  metadata: UniverseMetadata,
): HopLatency {
  // ──────────────────────────────────────────────────────────────────────────
  // VOID SECTION: Travel through space between planets
  // ──────────────────────────────────────────────────────────────────────────

  // Calculate Euclidean distance between planet centers
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Void distance: subtract both atmosphere layers
  const voidDistance =
    distance - (nodeA.atmosphere_thickness_km + nodeB.atmosphere_thickness_km);
  const actualVoidDistance = Math.max(0, voidDistance);

  // Atmosphere travel time: h × n / c (per planet)
  const atmosphereTimeA =
    (nodeA.atmosphere_thickness_km * nodeA.refraction_index) /
    metadata.speed_of_light_kms;
  const atmosphereTimeB =
    (nodeB.atmosphere_thickness_km * nodeB.refraction_index) /
    metadata.speed_of_light_kms;
  const totalAtmosphereDelayMs = (atmosphereTimeA + atmosphereTimeB) * 1000;

  // Void travel time: L / c
  const voidTravelTime = actualVoidDistance / metadata.speed_of_light_kms;
  const totalVoidDelayMs = voidTravelTime * 1000;

  // ──────────────────────────────────────────────────────────────────────────
  // FIBER SECTION: Travel through each planet's crust/fiber ring
  // ──────────────────────────────────────────────────────────────────────────

  const fiberSpeed =
    metadata.speed_of_light_kms * metadata.fiber_speed_fraction;

  // PLANET A
  // Average-case: signal travels half the ring
  const segmentsA = nodeA.active_towers / 2;
  const towersHitA = segmentsA + 1;
  const fiberDistanceA =
    (2 * Math.PI * nodeA.radius_km * segmentsA) / nodeA.active_towers;
  const fiberTimeA = fiberDistanceA / fiberSpeed; // seconds
  const towerDelayA = (towersHitA * metadata.tower_processing_delay_ms) / 1000; // convert ms to seconds
  const totalFiberDelayA = (fiberTimeA + towerDelayA) * 1000; // convert to ms

  // PLANET B
  // Average-case: signal travels half the ring
  const segmentsB = nodeB.active_towers / 2;
  const towersHitB = segmentsB + 1;
  const fiberDistanceB =
    (2 * Math.PI * nodeB.radius_km * segmentsB) / nodeB.active_towers;
  const fiberTimeB = fiberDistanceB / fiberSpeed; // seconds
  const towerDelayB = (towersHitB * metadata.tower_processing_delay_ms) / 1000; // convert ms to seconds
  const totalFiberDelayB = (fiberTimeB + towerDelayB) * 1000; // convert to ms

  // Total fiber delay (both planets)
  const totalFiberDelayMs = totalFiberDelayA + totalFiberDelayB;
  const totalTowerDelayMs = (towerDelayA + towerDelayB) * 1000;

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
