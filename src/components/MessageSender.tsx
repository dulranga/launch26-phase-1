import { useAppStore } from "../store";
import { findRoute } from "../engine/routing";
import SciFiCard from "./sci-fi/Card";

export default function MessageSender() {
  const universeConfig = useAppStore((state) => state.universeConfig);
  const sourcePlanet = useAppStore((state) => state.sourcePlanet);
  const targetPlanet = useAppStore((state) => state.targetPlanet);
  const messagePayload = useAppStore((state) => state.messagePayload);
  const offlinePlanets = useAppStore((state) => state.offlinePlanets);

  const setSourcePlanet = useAppStore((state) => state.setSourcePlanet);
  const setTargetPlanet = useAppStore((state) => state.setTargetPlanet);
  const setMessagePayload = useAppStore((state) => state.setMessagePayload);
  const setActiveRoute = useAppStore((state) => state.setActiveRoute);
  const setIsAnimating = useAppStore((state) => state.setIsAnimating);

  if (!universeConfig) return null;

  const handleSend = () => {
    if (!sourcePlanet || !targetPlanet || !messagePayload) return;

    // Run Dijkstra
    const route = findRoute(
      sourcePlanet,
      targetPlanet,
      universeConfig,
      offlinePlanets,
    );
    setActiveRoute(route);

    if (route.status === "success") {
      setIsAnimating(true);
      // Stop animation after a short delay based on path length
      setTimeout(() => {
        setIsAnimating(false);
      }, route.path.length * 1000); // 1s per hop animation
    }
  };

  const availablePlanets = universeConfig.nodes.filter(
    (n) => !offlinePlanets.has(n.id),
  );

  return (
    <SciFiCard className="flex flex-col gap-4">
      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2">
        Transmission Uplink
      </h2>

      <div className="flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[9px] text-cyan-500/70 uppercase font-bold tracking-wider leading-none">
            Source
          </label>
          <select
            value={sourcePlanet || ""}
            onChange={(e) => setSourcePlanet(e.target.value)}
            className="w-full min-w-0 bg-neutral-950 border border-white/10 rounded px-2 py-1.5 text-[11px] leading-none font-mono text-cyan-100 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">Source</option>
            {availablePlanets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[9px] text-cyan-500/70 uppercase font-bold tracking-wider leading-none">
            Destination
          </label>
          <select
            value={targetPlanet || ""}
            onChange={(e) => setTargetPlanet(e.target.value)}
            className="w-full min-w-0 bg-neutral-950 border border-white/10 rounded px-2 py-1.5 text-[11px] leading-none font-mono text-cyan-100 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">Destination</option>
            {availablePlanets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-cyan-500/70 uppercase font-bold tracking-wider">
          Payload
        </label>
        <textarea
          value={messagePayload}
          onChange={(e) => setMessagePayload(e.target.value)}
          placeholder="ENTER MESSAGE..."
          rows={3}
          className="bg-neutral-950 border border-white/10 rounded p-2 text-sm text-cyan-100 font-mono placeholder:text-[11px] placeholder:tracking-wider focus:outline-none focus:border-cyan-500/50 resize-none"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!sourcePlanet || !targetPlanet || !messagePayload}
        className="mt-2 w-full py-3 rounded bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 text-cyan-400 font-bold tracking-widest text-sm uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        [ Initialize Transmission ]
      </button>
    </SciFiCard>
  );
}
