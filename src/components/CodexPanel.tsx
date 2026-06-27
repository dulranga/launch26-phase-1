import { useMemo } from 'react';
import { useAppStore } from '../store';
import { convertPayloadToCodex } from '../engine/codex';

export default function CodexPanel() {
  const activeRoute = useAppStore((state) => state.activeRoute);
  const messagePayload = useAppStore((state) => state.messagePayload);
  const universeConfig = useAppStore((state) => state.universeConfig);

  const phases = useMemo(() => {
    if (activeRoute.status !== 'success' || !universeConfig || !messagePayload || activeRoute.path.length < 2) return null;
    
    const result = [];
    
    // Generate hop phases
    for (let i = 0; i < activeRoute.path.length - 1; i++) {
      const sourceId = activeRoute.path[i];
      const targetId = activeRoute.path[i + 1];
      const sourceNode = universeConfig.nodes.find(n => n.id === sourceId)!;
      const targetNode = universeConfig.nodes.find(n => n.id === targetId)!;
      
      const conversions = convertPayloadToCodex(messagePayload, targetNode.codex);
      const asciiArray = conversions.map(c => c.ascii).join(', ');
      const convertedArray = conversions.map(c => c.converted).join(', ');

      result.push({
        phaseNum: i + 1,
        type: i === 0 ? 'Origin' : 'Relay',
        sourceNode,
        targetNode,
        asciiArray,
        convertedArray,
        conversions
      });
    }

    const finalNode = universeConfig.nodes.find(n => n.id === activeRoute.path[activeRoute.path.length - 1])!;
    
    return {
      hops: result,
      finalNode,
      payload: messagePayload
    };
  }, [activeRoute, messagePayload, universeConfig]);

  if (!phases) return null;

  return (
    <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-xl border border-white/5 flex flex-col gap-4 mt-4 h-full max-h-[600px] overflow-hidden">
      <h2 className="flex-shrink-0 text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2 bg-neutral-900/95">
        Multi-Hop Transmission Log
      </h2>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-6 text-sm">
        {phases.hops.map((hop, index) => (
          <div key={index} className="flex flex-col gap-2 bg-neutral-950/50 p-4 rounded border border-white/5">
            <h3 className="text-cyan-200 font-bold uppercase tracking-widest border-b border-white/5 pb-1">
              Phase {hop.phaseNum}: {hop.type} at {hop.sourceNode.id} (Base {hop.sourceNode.codex})
            </h3>
            
            {hop.type === 'Relay' && (
              <p className="text-neutral-400">
                <strong className="text-cyan-500">Void Arrival & Local Decoding:</strong> {hop.sourceNode.id} receives the raw binary stream and reads it out as Base {hop.sourceNode.codex} values, decoding it back into standard ASCII to route between local towers.
              </p>
            )}

            <p className="text-neutral-400">
              <strong className="text-cyan-500">Internal Representation:</strong> The raw payload <span className="text-white">"{phases.payload}"</span> is represented as ASCII bytes inside {hop.sourceNode.id}'s routing system:
              <br/>
              <code className="text-cyan-100 bg-neutral-900 px-2 py-1 rounded mt-1 block">[{hop.asciiArray}]</code>
            </p>

            <p className="text-neutral-400 mt-2">
              <strong className="text-cyan-500">Next Hop Codex (Base {hop.targetNode.codex}):</strong> Before hitting the void, {hop.sourceNode.id} converts the data into the dialect of the next destination, {hop.targetNode.id}. The entire payload becomes:
              <br/>
              <code className="text-cyan-300 bg-neutral-900 px-2 py-1 rounded mt-1 block">[{hop.convertedArray}]</code>
            </p>

            <p className="text-neutral-400 mt-2 text-xs italic">
              <strong className="text-cyan-500/70 not-italic">Void Transmission Stream:</strong> This Base {hop.targetNode.codex} sequence is serialized into a flat binary stream to be beamed via lasers across the vacuum.
            </p>
          </div>
        ))}

        {/* Final Destination */}
        <div className="flex flex-col gap-2 bg-cyan-950/20 p-4 rounded border border-cyan-900/30">
          <h3 className="text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-900/50 pb-1">
            Phase {phases.hops.length + 1}: Final Destination at {phases.finalNode.id} (Base {phases.finalNode.codex})
          </h3>
          
          <p className="text-neutral-400">
            <strong className="text-cyan-500">Void Arrival:</strong> {phases.finalNode.id} captures the laser binary stream and processes it as Base {phases.finalNode.codex} values.
          </p>

          <p className="text-neutral-400">
            <strong className="text-cyan-500">Local Decoding:</strong> {phases.finalNode.id} runs its final local decoding step, mapping the Base {phases.finalNode.codex} values back to ASCII to present to the end user.
          </p>

          <p className="text-cyan-100 mt-2 p-2 bg-cyan-900/30 rounded border border-cyan-500/30 text-center font-bold tracking-widest uppercase">
            Payload Delivered: "{phases.payload}"
          </p>
        </div>
      </div>
    </div>
  );
}
