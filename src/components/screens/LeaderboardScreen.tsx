import React from 'react';
import { useGameStore } from '../../game/GameContext';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function LeaderboardScreen() {
  const { setScreen } = useGameStore();
  const { isConnected } = useAccount();

  // Mock data for leaderboard
  const leaders = [
    { name: '0x12a...7B', score: 14250, combo: 12 },
    { name: '0x99f...32', score: 11040, combo: 9 },
    { name: '0x4cF...aa', score: 9800, combo: 15 },
    { name: 'Player439', score: 8500, combo: 5 },
    { name: 'EchoMaster', score: 6200, combo: 4 },
  ];

  return (
    <div className="absolute inset-0 bg-[#050505] text-white p-6 md:p-12 flex flex-col font-sans overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px)'
        }}></div>
      </div>

      <div className="flex items-center justify-between mb-12 z-10">
        <button onClick={() => setScreen('title')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 border-2 border-white/20 rounded flex items-center justify-center transform -skew-x-12 group-hover:bg-white group-hover:text-black transition-all">
            <span className="skew-x-12 font-bold uppercase">Esc</span>
          </div>
        </button>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter flex items-center gap-4">
          <Trophy className="w-8 h-8 text-[#00f3ff]" /> 
          ON-CHAIN <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>RANKS</span>
        </h2>
        <div className="w-10 h-10 hidden sm:block pointer-events-none"></div> {/* Spacer */}
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto z-10 flex flex-col relative">
        <div className="absolute -inset-24 bg-[#00f3ff]/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="bg-black/40 backdrop-blur-xl border-l-4 border-[#00f3ff] p-6 lg:p-10 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
             <div className="text-[10px] uppercase font-bold tracking-widest opacity-50 flex-1">Racer ID</div>
             <div className="text-[10px] uppercase font-bold tracking-widest opacity-50 flex-1 text-center">Max Combo</div>
             <div className="text-[10px] uppercase font-bold tracking-widest opacity-50 flex-1 text-right">Distance</div>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-4">
            {leaders.map((l, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className={`flex items-center justify-between p-4 ${i === 0 ? 'bg-white/5 border border-white/20' : 'border-b border-white/5'} transition-colors`}
              >
                <div className="flex-1 flex items-center gap-4">
                  <span className={`font-black italic text-xl ${i === 0 ? 'text-[#ff00ff]' : 'text-white/30'}`}>{i + 1}</span>
                  <span className="font-mono text-sm md:text-base">{l.name}</span>
                </div>
                <div className="flex-1 text-center font-black italic text-[#bc13fe]">
                  x{l.combo}
                </div>
                <div className="flex-1 text-right font-black italic text-2xl text-[#00f3ff]">
                  {l.score.toLocaleString()}<span className="text-sm ml-1 text-white/50">m</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {!isConnected && (
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00f3ff] opacity-70">
                Connect your Base wallet (e.g. Coinbase Wallet or MetaMask) to post scores.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
