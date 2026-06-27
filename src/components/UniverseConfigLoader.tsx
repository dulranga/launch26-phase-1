import { useRef, useState } from "react";
import { useAppStore } from "../store";
import { safeDecodeUniverseConfig } from "../engine/configDecoder";
import { Button } from "./ui/button";
import { SciFiCard } from "@/ui/SciFiCard";
import { SciFiButton } from "@/ui/SciFiButton";

const BROWSER_CONFIG_KEY = "launch26.universeConfig";

export default function UniverseConfigLoader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const setUniverseConfig = useAppStore((state) => state.setUniverseConfig);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setStatus(`Reading ${file.name}...`);
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const result = safeDecodeUniverseConfig(parsed);

      if (!result.success) {
        setStatus(`Invalid config: ${result.error.message}`);
        return;
      }

      setUniverseConfig(result.data);

      const serialized = JSON.stringify(result.data);
      localStorage.setItem(BROWSER_CONFIG_KEY, serialized);
      setStatus("Config loaded into browser and set active.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Failed to load config: ${message}`);
    }
  };

  return (
    <div className="mt-auto">
      <SciFiCard className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
          <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
            Config Import
          </h2>
        </div>

        <p className="text-xs font-mono text-cyan-100/70 leading-relaxed">
          Pick a JSON file, validate it against the universe schema, and load it
          into the browser as the active universe config.
        </p>

        <SciFiButton
          type="button"
          variant="outline"
          className="w-full"
          onClick={handlePickFile}
        >
          Load Config Into Browser
        </SciFiButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="min-h-5 text-[11px] font-mono text-cyan-500/70">
          {status || "Using placeholder public/universe-config.json."}
        </div>
      </SciFiCard>
    </div>
  );
}
