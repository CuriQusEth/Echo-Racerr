import React, { useState } from 'react';
import { useGameStore } from '../../game/GameContext';
import { motion } from 'motion/react';
import { RefreshCcw, Home, UploadCloud, CheckCircle2 } from 'lucide-react';
import { encodeAttributionData } from '../../lib/erc8021/utils';

export default function GameOverScreen() {
  const { setScreen, lastScore, lastCombo } = useGameStore();
  const [recorded, setRecorded] = useState(false);

  const handleRecord = () => {
    console.log("Mock triggering SIWE and tx to record score.");
    encodeAttributionData("0xdeadbeef");
    setTimeout(() => setRecorded(true), 800);
  };

  return (
    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl p-6 flex flex-col items-center justify-center z-50 overflow-hidden font-sans">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 0, 255, 0.1) 25%, rgba(255, 0, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 243, 255, 0.1) 75%, rgba(0, 243, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 255, 0.1) 25%, rgba(255, 0, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 243, 255, 0.1) 75%, rgba(0, 243, 255, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px)'
        }}></div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff00ff]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border-l-4 border-r-4 border-[#ff00ff] p-8 relative flex flex-col z-10"
      >
        
        <h2 className="text-5xl font-black italic text-center tracking-tighter mb-8 leading-none drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
          <span className="text-[#ff00ff]">CRASHED</span>
        </h2>

        <div className="flex flex-col space-y-4 mb-8">
          <div className="p-4 bg-white/5 border border-white/10 flex justify-between items-center">
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Distance</div>
            <div className="text-3xl font-black italic text-[#00f3ff]">{Math.floor(lastScore)}<span className="text-sm ml-1">m</span></div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 flex justify-between items-center">
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Max Combo</div>
            <div className="text-3xl font-black italic text-[#bc13fe]">x{lastCombo}</div>
          </div>
        </div>

        <button 
          onClick={recorded ? undefined : handleRecord}
          className={`w-full py-4 font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-2 transition-all block mb-6 transform -skew-x-12 ${
            recorded 
              ? 'bg-transparent border-2 border-green-500 text-green-400 cursor-default'
              : 'bg-[#00f3ff] text-black hover:scale-105'
          }`}
        >
          <div className="skew-x-12 flex items-center gap-2">
            {recorded ? <><CheckCircle2 className="w-5 h-5" /> Saved to Base</> : <><UploadCloud className="w-5 h-5 fill-black" /> Commit Score</>}
          </div>
        </button>

        <div className="flex space-x-4">
          <button onClick={() => setScreen('playing')} className="flex-1 py-3 border-2 border-white text-white font-bold uppercase tracking-widest text-xs transform -skew-x-12 hover:bg-white hover:text-black transition-all group flex justify-center">
            <div className="skew-x-12 flex items-center gap-2"><RefreshCcw className="w-4 h-4 text-[#00f3ff] group-hover:text-black" /> Retry</div>
          </button>
          <button onClick={() => setScreen('title')} className="flex-1 py-3 border border-white/20 text-white/70 font-bold uppercase tracking-widest text-xs transform -skew-x-12 hover:bg-white/10 hover:text-white transition-all flex justify-center">
            <div className="skew-x-12 flex items-center gap-2"><Home className="w-4 h-4 text-[#bc13fe]" /> Base</div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
