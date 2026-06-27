import { useAppStore } from "../store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

export default function PlanetDetailPanel() {
  const selected = useAppStore((s) => s.selectedPlanet);
  const setSelected = useAppStore((s) => s.setSelectedPlanet);
  const config = useAppStore((s) => s.universeConfig);

  if (!selected || !config) return null;

  const node = config.nodes.find((n) => n.id === selected);
  if (!node) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{node.id}</CardTitle>
        <div />
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-cyan-200 space-y-2">
          <li><span className="font-semibold">Radius:</span> {node.radius_km.toLocaleString()} km</li>
          <li><span className="font-semibold">Atmosphere thickness:</span> {node.atmosphere_thickness_km} km</li>
          <li><span className="font-semibold">Refraction index:</span> {node.refraction_index}</li>
          <li><span className="font-semibold">Active towers:</span> {node.active_towers}</li>
          <li><span className="font-semibold">Coordinates:</span> {node.x}, {node.y}</li>
          <li><span className="font-semibold">Codex:</span> {node.codex}</li>
        </ul>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full justify-end">
          <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
