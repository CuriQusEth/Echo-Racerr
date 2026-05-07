import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../game/GameContext';
import { Activity, Zap, Trophy, Settings } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';

export default function TitleScreen() {
  const { setScreen } = useGameStore();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <div className="absolute inset-0 bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px)'
        }}></div>
      </div>

      <nav className="z-20 p-6 md:p-8 flex justify-between items-center bg-black/40 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f3ff] to-[#bc13fe] rounded-lg rotate-45 flex items-center justify-center">
            <div className="w-6 h-6 bg-[#050505] rounded-sm -rotate-45"></div>
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter">ECHO RACER</span>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[10px] uppercase tracking-widest text-[#00f3ff] opacity-70">Network: Base Mainnet</span>
            {isConnected ? (
               <span className="font-mono text-sm">{address?.slice(0,6)}...{address?.slice(-4)}</span>
            ) : (
               <span className="font-mono text-sm text-white/50">Not Connected</span>
            )}
          </div>
          {isConnected ? (
             <button onClick={() => alert("GM Transaction signed on Base Mainnet!")} className="px-4 py-2 md:px-6 bg-white/5 border border-white/20 hover:border-[#00f3ff] rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-[#00f3ff]">Say GM</button>
          ) : (
             <button onClick={() => connect({ connector: connectors[0] })} className="px-4 py-2 md:px-6 bg-white/5 border border-white/20 hover:border-[#bc13fe] rounded-full text-xs font-bold uppercase tracking-widest transition-colors">Connect</button>
          )}
        </div>
      </nav>

      <main className="flex-1 z-10 flex relative">
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center relative"
          >
            <div className="absolute -inset-24 bg-[#00f3ff]/10 blur-[100px] rounded-full pointer-events-none hidden md:block"></div>
            <div className="absolute -inset-16 bg-[#bc13fe]/10 blur-[80px] rounded-full pointer-events-none hidden md:block"></div>
            <h1 className="text-6xl md:text-[140px] font-black italic tracking-tighter leading-none mb-4 select-none drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] text-center">
              ECHO<br/><span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>RACER</span>
            </h1>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8 w-full md:w-auto px-6 md:px-0"
          >
            <button onClick={() => setScreen('playing')} className="w-full md:w-auto px-12 py-4 bg-[#00f3ff] text-black font-black uppercase italic tracking-tighter text-xl transform -skew-x-12 hover:scale-105 transition-transform flex justify-center group">
              <span className="skew-x-12 flex items-center gap-2">Enter Void <Zap className="w-5 h-5 group-hover:animate-pulse" /></span>
            </button>
            <div className="flex space-x-4 w-full md:w-auto">
              <button onClick={() => setScreen('garage')} className="flex-1 md:flex-none px-6 md:px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-sm transform -skew-x-12 hover:bg-white hover:text-black transition-all flex justify-center">
                <span className="skew-x-12 flex items-center"><Settings className="w-4 h-4 mr-2" /> Garage</span>
              </button>
              <button onClick={() => setScreen('leaderboard')} className="flex-1 md:flex-none px-6 md:px-8 py-4 border-2 border-[#bc13fe] text-[#bc13fe] font-bold uppercase tracking-widest text-sm transform -skew-x-12 hover:bg-[#bc13fe] hover:text-white transition-all flex justify-center">
                <span className="skew-x-12 flex items-center"><Trophy className="w-4 h-4 mr-2" /> Ranks</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="z-20 p-6 md:p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center md:items-end bg-[#050505]">
        <div className="flex space-x-8 md:space-x-12 mb-4 md:mb-0">
          <div className="flex items-center space-x-4 opacity-50">
            <div className="flex flex-col space-y-1">
              <div className="w-6 h-4 border-2 border-white rounded"></div>
              <div className="w-6 h-4 border-2 border-white rounded-full bg-white"></div>
            </div>
            <span className="text-[10px] uppercase font-bold">Swipe to Jump/Slide</span>
          </div>
          <div className="flex items-center space-x-4 opacity-50">
            <div className="w-8 h-8 border-2 border-dashed border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-[10px] uppercase font-bold">Tap to Echo</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Base Node {isConnected ? 'Connected' : 'Available'}</span>
          </div>
          <div className="text-[9px] uppercase tracking-tighter opacity-30 text-center md:text-right">App ID: 691633c7669aee60603bdd83 • bc_db7eczjb</div>
        </div>
      </footer>

      <div className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-t from-[#00f3ff]/20 to-transparent rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
