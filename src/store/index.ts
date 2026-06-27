import { create } from "zustand";
import { type UniverseConfig } from "../engine/configDecoder";

export interface LatencyBreakdown {
  source: string;
  target: string;
  voidDelay: number;
  atmosphereDelay: number;
  fiberDelay: number;
  towerDelay: number;
  totalDelay: number;
}

export interface RouteResult {
  path: string[];
  hops: LatencyBreakdown[];
  totalLatency: number;
  status: "success" | "undeliverable" | "idle";
}

interface AppState {
  universeConfig: UniverseConfig | null;
  offlinePlanets: Set<string>;
  messagePayload: string;
  sourcePlanet: string | null;
  targetPlanet: string | null;
  selectedPlanet: string | null;
  activeRoute: RouteResult;
  isAnimating: boolean;
  /** Incremented each time user fires a transmission — used to re-key animations */
  transmissionId: number;
  /** Route that has fully completed transmission (dot finished travelling) */
  transmittedRoute: RouteResult | null;

  // Actions
  setUniverseConfig: (config: UniverseConfig) => void;
  togglePlanetStatus: (planetId: string) => void;
  setMessagePayload: (payload: string) => void;
  setSourcePlanet: (planetId: string) => void;
  setTargetPlanet: (planetId: string) => void;
  setSelectedPlanet: (planetId: string | null) => void;
  setActiveRoute: (route: RouteResult) => void;
  setIsAnimating: (animating: boolean) => void;
  setTransmittedRoute: (route: RouteResult | null) => void;
  bumpTransmissionId: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  universeConfig: null,
  offlinePlanets: new Set(),
  messagePayload: "",
  sourcePlanet: null,
  targetPlanet: null,
  selectedPlanet: null,
  activeRoute: {
    path: [],
    hops: [],
    totalLatency: 0,
    status: "idle",
  },
  isAnimating: false,
  transmissionId: 0,
  transmittedRoute: null,

  setUniverseConfig: (config) =>
    set({
      universeConfig: config,
      offlinePlanets: new Set(),
      messagePayload: "",
      sourcePlanet: null,
      targetPlanet: null,
      selectedPlanet: null,
      activeRoute: {
        path: [],
        hops: [],
        totalLatency: 0,
        status: "idle",
      },
      isAnimating: false,
      transmittedRoute: null,
      transmissionId: 0,
    }),
  togglePlanetStatus: (planetId) =>
    set((state) => {
      const newOffline = new Set(state.offlinePlanets);
      if (newOffline.has(planetId)) {
        newOffline.delete(planetId);
      } else {
        newOffline.add(planetId);
      }
      return { offlinePlanets: newOffline };
    }),
  setMessagePayload: (payload) => set({ messagePayload: payload }),
  setSourcePlanet: (sourcePlanet) => set({ sourcePlanet }),
  setTargetPlanet: (targetPlanet) => set({ targetPlanet }),
  setSelectedPlanet: (selectedPlanet) => set({ selectedPlanet }),
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  setTransmittedRoute: (transmittedRoute) => set({ transmittedRoute }),
  bumpTransmissionId: () => set((state) => ({ transmissionId: state.transmissionId + 1 })),
}));
