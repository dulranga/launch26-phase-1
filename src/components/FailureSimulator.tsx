import { useAppStore } from '../store';
import { findRoute } from '../engine/routing';

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
    if (activeRoute.status !== 'idle' && sourcePlanet && targetPlanet) {
      // We must pass the hypothetical next state of offline planets 
      // since the store update is async and hasn't propagated to this closure yet.
      const nextOffline = new Set(offlinePlanets);
      if (nextOffline.has(planetId)) nextOffline.delete(planetId);
      else nextOffline.add(planetId);

      const newRoute = findRoute(sourcePlanet, targetPlanet, universeConfig, nextOffline);
      setActiveRoute(newRoute);
    }
  };

  return (
    <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-xl border border-white/5 flex flex-col gap-4">
      <h2 className="text-red-400/80 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2">
        Network Failure Simulation
      </h2>
      
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {universeConfig.nodes.map((node) => {
          const isOffline = offlinePlanets.has(node.id);
          return (
            <div 
              key={node.id} 
              className={`flex items-center justify-between p-3 rounded border transition-colors ${
                isOffline 
                  ? 'bg-red-950/30 border-red-900/30' 
                  : 'bg-neutral-950/50 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-bold tracking-wider ${isOffline ? 'text-red-500/70 line-through' : 'text-cyan-100'}`}>
                  {node.id}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase font-mono">
                  {isOffline ? 'OFFLINE' : 'ONLINE'}
                </span>
              </div>
              
              <button
                onClick={() => handleToggle(node.id)}
                className={`text-xs px-3 py-1 rounded font-bold tracking-wider uppercase transition-colors ${
                  isOffline 
                    ? 'bg-green-900/40 text-green-400 hover:bg-green-800/60' 
                    : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
                }`}
              >
                {isOffline ? 'Reboot' : 'Disable'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
