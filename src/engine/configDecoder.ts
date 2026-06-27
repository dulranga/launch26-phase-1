import { z } from 'zod';

export const UniverseMetadataSchema = z.object({
  system_name: z.string(),
  speed_of_light_kms: z.number(),
  max_void_hop_distance_km: z.number(),
  coordinate_scale_unit_km: z.number(),
  tower_processing_delay_ms: z.number(),
  fiber_speed_fraction: z.number(),
}).strict();

export const NodeSchema = z.object({
  id: z.string(),
  codex: z.number(),
  x: z.number(),
  y: z.number(),
  radius_km: z.number(),
  active_towers: z.number(),
  atmosphere_thickness_km: z.number(),
  refraction_index: z.number(),
}).strict();

export const UniverseConfigSchema = z.object({
  universe_metadata: UniverseMetadataSchema,
  nodes: z.array(NodeSchema),
}).strict();

export type UniverseMetadata = z.infer<typeof UniverseMetadataSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type UniverseConfig = z.infer<typeof UniverseConfigSchema>;

/**
 * Decodes and validates a raw universe configuration object.
 * Throws a ZodError if the configuration is invalid.
 */
export function decodeUniverseConfig(rawConfig: unknown): UniverseConfig {
  return UniverseConfigSchema.parse(rawConfig);
}

/**
 * Safely decodes a raw universe configuration object without throwing.
 * Returns a SafeParseSuccess or SafeParseError result object.
 */
export function safeDecodeUniverseConfig(rawConfig: unknown) {
  return UniverseConfigSchema.safeParse(rawConfig);
}
