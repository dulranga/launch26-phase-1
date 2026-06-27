import { useMemo } from 'react';
import { useAppStore } from '../store';
import { convertPayloadToCodex } from '../engine/codex';

export default function CodexPanel() {
  const activeRoute = useAppStore((state) => state.activeRoute);
  const messagePayload = useAppStore((state) => state.messagePayload);
  const universeConfig = useAppStore((state) => state.universeConfig);
  const isAnimating = useAppStore((state) => state.isAnimating);

  const conversionData = useMemo(() => {
    if (activeRoute.status !== 'success' || !universeConfig || !messagePayload) return null;
    
    const targetNodeId = activeRoute.path[activeRoute.path.length - 1];
    const targetNode = universeConfig.nodes.find(n => n.id === targetNodeId);
    if (!targetNode) return null;

    return {
      targetId: targetNode.id,
      codex: targetNode.codex,
      conversions: convertPayloadToCodex(messagePayload, targetNode.codex),
    };
  }, [activeRoute, messagePayload, universeConfig]);

  if (!conversionData) return null;

  return (
    <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-xl border border-white/5 flex flex-col gap-4 mt-4">
      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2 flex justify-between items-center">
        <span>Codex Conversion</span>
        <span className="text-[10px] bg-cyan-900/40 text-cyan-200 px-2 py-1 rounded">Base {conversionData.codex}</span>
      </h2>

      <div className="text-xs text-neutral-400 mb-2 font-mono">
        Translating Payload for {conversionData.targetId} Local Decoding...
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {conversionData.conversions.map((charData, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {/* Original Char */}
              <div className="w-8 h-8 flex items-center justify-center bg-neutral-950 border border-white/10 rounded text-cyan-100 font-bold">
                {charData.char}
              </div>
              <span className="text-cyan-500/50">→</span>
              {/* ASCII */}
              <div className="flex-1 px-3 py-1 bg-neutral-800 border border-white/5 rounded text-neutral-400 font-mono text-xs flex items-center justify-between">
                <span>ASCII (Base 10)</span>
                <span>{charData.ascii}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-10">
              <span className="text-cyan-500/50 text-xl font-bold">↳</span>
              {/* Target Codex */}
              <div className={`flex-1 px-3 py-2 border rounded font-mono text-sm flex items-center justify-between transition-all duration-500 ${
                isAnimating 
                  ? 'bg-cyan-950 border-cyan-500/50 text-cyan-200 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'bg-neutral-950 border-white/10 text-cyan-500/80'
              }`}>
                <span className="text-[10px] uppercase text-cyan-500/50">Base {conversionData.codex}</span>
                <span className="font-bold tracking-widest">{charData.converted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
