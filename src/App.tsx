import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { safeDecodeUniverseConfig } from './engine/configDecoder';
import UniverseViewer from './components/UniverseViewer';
import MessageSender from './components/MessageSender';
import FailureSimulator from './components/FailureSimulator';
import MetricsPanel from './components/MetricsPanel';
import CodexPanel from './components/CodexPanel';

function App() {
  const setUniverseConfig = useAppStore((state) => state.setUniverseConfig);
  const [error, setError] = useState<string | null>(null);
  
  // Mobile Tabs State
  const [activeTab, setActiveTab] = useState<'controls' | 'metrics'>('controls');

  useEffect(() => {
    fetch('/universe-config.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not find /universe-config.json');
        return res.json();
      })
      .then((data) => {
        const result = safeDecodeUniverseConfig(data);
        if (result.success) {
          setUniverseConfig(result.data);
        } else {
          setError(`Invalid Configuration: ${result.error.message}`);
        }
      })
      .catch((err) => {
        // Fallback for when the file isn't there yet (user will add dummy json later)
        setError('Waiting for universe-config.json...');
      });
  }, [setUniverseConfig]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-neutral-950 text-cyan-500 font-mono p-8 text-center">
        <h1 className="text-xl font-bold mb-4 uppercase tracking-widest text-red-500">System Initialization Halted</h1>
        <p className="max-w-2xl text-sm opacity-80">{error}</p>
        <p className="mt-4 text-xs opacity-50">Please ensure valid universe-config.json is placed in the public directory.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 overflow-hidden text-cyan-100 flex flex-col md:grid md:grid-cols-[300px_1fr_300px] md:gap-4 md:p-4">
      
      {/* --- DESKTOP LEFT SIDEBAR / MOBILE CONTROLS TAB --- */}
      <div className={`md:flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 ${activeTab === 'controls' ? 'flex flex-1 p-4 md:p-0' : 'hidden'}`}>
        <MessageSender />
        <FailureSimulator />
      </div>

      {/* --- CENTER: UNIVERSE VIEWER --- */}
      {/* On mobile, this is always visible and takes top 50vh. On desktop, it takes the middle column. */}
      <div className="h-[50vh] md:h-full w-full relative z-10 shrink-0 border-b border-white/10 md:border-none">
        <UniverseViewer />
      </div>

      {/* --- MOBILE TABS BAR --- */}
      <div className="md:hidden flex border-b border-white/10 bg-neutral-900 shrink-0">
        <button 
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'controls' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/30' : 'text-neutral-500 hover:text-cyan-200'}`}
          onClick={() => setActiveTab('controls')}
        >
          Controls
        </button>
        <button 
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'metrics' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/30' : 'text-neutral-500 hover:text-cyan-200'}`}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics
        </button>
      </div>

      {/* --- DESKTOP RIGHT SIDEBAR / MOBILE METRICS TAB --- */}
      <div className={`md:flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 ${activeTab === 'metrics' ? 'flex flex-1 p-4 md:p-0 bg-neutral-950 md:bg-transparent' : 'hidden'}`}>
        <MetricsPanel />
        <CodexPanel />
      </div>

    </div>
  );
}

export default App;
