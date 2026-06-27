import { useAppStore } from "../store";
import { findRoute } from "../engine/routing";
import { SciFiCard } from "../ui/SciFiCard";
import { SciFiButton } from "../ui/SciFiButton";
import {
  SciFiSelect,
  SciFiSelectTrigger,
  SciFiSelectValue,
  SciFiSelectContent,
  SciFiSelectItem,
} from "../ui/SciFiSelect";
import { SciFiTextarea } from "../ui/SciFiTextarea";

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
  const setTransmittedRoute = useAppStore((state) => state.setTransmittedRoute);
  const bumpTransmissionId = useAppStore((state) => state.bumpTransmissionId);

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
    setTransmittedRoute(null); // clear previous completed route

    if (route.status === "success") {
      bumpTransmissionId();
      setIsAnimating(true);
      // 800ms per hop for the comet to travel, then mark as transmitted
      const duration = route.path.length * 800;
      setTimeout(() => {
        setIsAnimating(false);
        setTransmittedRoute(route);
      }, duration);
    }
  };

  const availablePlanets = universeConfig.nodes.filter(
    (n) => !offlinePlanets.has(n.id),
  );

  return (
    <SciFiCard className="flex flex-col gap-4 p-4">
      <h2 className="text-[var(--color-sci-fi-cyan)] font-bold uppercase tracking-wider text-sm border-b border-[var(--color-sci-fi-cyan)]/20 pb-2">
        Transmission Uplink
      </h2>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[9px] text-[var(--color-sci-fi-cyan)]/70 uppercase font-bold tracking-wider leading-none">
            Source
          </label>
          <SciFiSelect value={sourcePlanet || ""} onValueChange={(val) => setSourcePlanet(val || "")}>
            <SciFiSelectTrigger>
              <SciFiSelectValue placeholder="Source" />
            </SciFiSelectTrigger>
            <SciFiSelectContent>
              {availablePlanets.map((p) => (
                <SciFiSelectItem key={p.id} value={p.id}>
                  {p.id}
                </SciFiSelectItem>
              ))}
            </SciFiSelectContent>
          </SciFiSelect>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[9px] text-[var(--color-sci-fi-cyan)]/70 uppercase font-bold tracking-wider leading-none">
            Destination
          </label>
          <SciFiSelect value={targetPlanet || ""} onValueChange={(val) => setTargetPlanet(val || "")}>
            <SciFiSelectTrigger>
              <SciFiSelectValue placeholder="Destination" />
            </SciFiSelectTrigger>
            <SciFiSelectContent>
              {availablePlanets.map((p) => (
                <SciFiSelectItem key={p.id} value={p.id}>
                  {p.id}
                </SciFiSelectItem>
              ))}
            </SciFiSelectContent>
          </SciFiSelect>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[var(--color-sci-fi-cyan)]/70 uppercase font-bold tracking-wider">
          Payload
        </label>
        <SciFiTextarea
          value={messagePayload}
          onChange={(e) => setMessagePayload(e.target.value)}
          placeholder="ENTER MESSAGE..."
          rows={3}
          className="p-3"
        />
      </div>

      <div className="pt-2">
        <SciFiButton
          onClick={handleSend}
          disabled={!sourcePlanet || !targetPlanet || !messagePayload}
        >
          [ Initialize Transmission ]
        </SciFiButton>
      </div>
    </SciFiCard>
  );
}
