# Team DDSL - Launch-26 Phase 1

Launch-26 Phase 1 is a sci-fi transmission simulator built with React, TypeScript, and Vite. It renders a configurable universe of planetary nodes, lets you route messages between planets, and simulates failures by toggling nodes offline.

## What it does

- Visualizes the universe graph and planetary links.
- Sends transmissions between a selected source and destination.
- Calculates route latency based on the active universe JSON.
- Lets you disable planets to test outage behavior.
- Persists a loaded universe config in the browser.

## Install

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build the project:

```bash
npm run build
```

## Universe JSON

The app reads its configuration from `public/universe-config.json` on startup. If that file is missing, the app still opens and you can load a JSON file through the in-app Config Import panel.

The JSON must follow this shape:

```json
{
  "universe_metadata": {
    "system_name": "Zeta-26",
    "speed_of_light_kms": 300000,
    "max_void_hop_distance_km": 50000000,
    "coordinate_scale_unit_km": 100000,
    "tower_processing_delay_ms": 7,
    "fiber_speed_fraction": 0.67
  },
  "nodes": [
    {
      "id": "Aegis",
      "codex": 8,
      "x": 0,
      "y": 0,
      "radius_km": 6371,
      "active_towers": 8,
      "atmosphere_thickness_km": 120,
      "refraction_index": 1.0003
    }
  ]
}
```

Each node needs these fields:

- `id`
- `codex`
- `x`
- `y`
- `radius_km`
- `active_towers`
- `atmosphere_thickness_km`
- `refraction_index`

## Adding a new universe file

1. There is a default config file in `public/universe-config.json`.
2. Make sure the JSON matches the schema above.
3. Refresh the app, or use the Config Import panel to upload a JSON file from your machine.
4. The loaded config is saved in browser storage and will be used.

## Notes

- The app expects valid JSON, not comments or trailing commas.
- If a config fails validation, the import panel shows the reason.
- Offline planets only affect routing and simulation; they do not delete data from the config.
