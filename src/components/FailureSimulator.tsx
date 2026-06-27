import { useAppStore } from "../store";
import { findRoute } from "../engine/routing";
import { SciFiCard } from "../ui/SciFiCard";
import { SciFiButton } from "../ui/SciFiButton";

export default function FailureSimulator() {
  const universeConfig = useAppStore((state) => state.universeConfig);
  const offlinePlanets = useAppStore((state) => state.offlinePlanets);
  const togglePlanetStatus = useAppStore((state) => state.togglePlanetStatus);

  const sourcePlanet = useAppStore((state) => state.sourcePlanet);
  const targetPlanet = useAppStore((state) => state.targetPlanet);
  const activeRoute = useAppStore((state) => state.activeRoute);
  const setActiveRoute = useAppStore((state) => state.setActiveRoute);

  if (!universeConfig) return null;

  const handleToggle = (planetId: string) => {
    togglePlanetStatus(planetId);

    // Automatically recalculate route if we have an active one
    if (activeRoute.status !== "idle" && sourcePlanet && targetPlanet) {
      // We must pass the hypothetical next state of offline planets
      // since the store update is async and hasn't propagated to this closure yet.
      const nextOffline = new Set(offlinePlanets);
      if (nextOffline.has(planetId)) nextOffline.delete(planetId);
      else nextOffline.add(planetId);

      const newRoute = findRoute(
        sourcePlanet,
        targetPlanet,
        universeConfig,
        nextOffline,
      );
      setActiveRoute(newRoute);
    }
  };

  return (
    <SciFiCard theme="destructive" className="flex flex-col gap-4 p-4">
      <h2 className="text-red-400 font-bold uppercase tracking-wider text-sm border-b border-red-500/20 pb-2">
        Network Failure Simulation
      </h2>

      <div className="flex flex-col gap-2 max-h-[33vh] overflow-y-auto pr-2 custom-scrollbar">
        {universeConfig.nodes.map((node) => {
          const isOffline = offlinePlanets.has(node.id);
          return (
            <div
              key={node.id}
              className={`flex items-center justify-between p-3 rounded border transition-colors ${
                isOffline
                  ? "bg-red-950/30 border-red-900/30"
                  : "bg-neutral-950/50 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-sm font-bold tracking-wider ${isOffline ? "text-red-500/70 line-through" : "text-cyan-100"}`}
                >
                  {node.id}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase font-mono">
                  {isOffline ? "OFFLINE" : "ONLINE"}
                </span>
              </div>

              <SciFiButton
                onClick={() => handleToggle(node.id)}
                theme={isOffline ? "success" : "destructive"}
                className="text-[10px] font-bold tracking-wider uppercase"
              >
                {isOffline ? "Reboot" : "Disable"}
              </SciFiButton>
            </div>
          );
        })}
      </div>
    </SciFiCard>
  );
}
