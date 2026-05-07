import React from 'react';
import GameCanvas from '../../game/GameCanvas';
import { useGameStore } from '../../game/GameContext';
import { Orbit } from 'lucide-react';

export default function GameplayScreen() {
  const { orbs } = useGameStore();
  
  return (
    <div className="absolute inset-0 bg-[#050505] font-sans overflow-hidden text-white flex flex-col">
      <div className="absolute inset-0 z-0">
        <GameCanvas />
      </div>

      {/* Modern HUD Overlay applied as Side Panels extracted from HTML Design */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col space-y-8 z-20 pointer-events-none drop-shadow-md">
        <div className="p-4 bg-black/40 backdrop-blur-xl border-l-4 border-[#00f3ff] w-32 md:w-48 hidden sm:block">
          <div className="text-[10px] uppercase opacity-50 mb-1 font-bold tracking-widest">Echo Power</div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[100%] bg-gradient-to-r from-[#00f3ff] to-[#bc13fe]"></div>
          </div>
          <div className="mt-2 font-black italic text-xl">100%</div>
        </div>
        
        <div className="p-4 bg-black/40 backdrop-blur-xl border-l-4 border-[#ff00ff] w-32 md:w-48 hidden sm:block">
          <div className="text-[10px] uppercase opacity-50 mb-1 font-bold tracking-widest">Resonance Orbs</div>
          <div className="font-black text-3xl italic text-[#ff00ff] flex items-center gap-2">
            <Orbit className="w-5 h-5 md:w-6 md:h-6" /> {orbs}
          </div>
        </div>
        
        <div className="flex space-x-2 hidden sm:flex">
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#00f3ff] rounded flex items-center justify-center bg-[#00f3ff]/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/20 rounded flex items-center justify-center bg-black/40 backdrop-blur-sm"></div>
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/20 rounded flex items-center justify-center bg-black/40 backdrop-blur-sm"></div>
        </div>
      </div>

      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6 z-20 pointer-events-none drop-shadow-md hidden lg:flex">
        <div className="w-64 bg-black/40 backdrop-blur-md p-6 border-l-4 border-[#bc13fe]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#00f3ff]">On-Chain Base</span>
            <span className="text-[10px] bg-[#00f3ff]/20 text-[#00f3ff] px-2 py-0.5 rounded font-black italic">LIVE</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm items-center border-b border-white/5 pb-2">
              <span className="font-mono opacity-60">1. 0x4f2...</span>
              <span className="font-bold text-[#bc13fe]">12,450m</span>
            </div>
            <div className="flex justify-between text-sm items-center border-b border-white/5 pb-2">
              <span className="font-mono opacity-60">2. 0x9a1...</span>
              <span className="font-bold">11,202m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
