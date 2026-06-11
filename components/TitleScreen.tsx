'use client';
import { motion } from 'motion/react';
import { Play, Trophy, Wrench } from 'lucide-react';

interface TitleScreenProps {
  onStartRace: () => void;
  onViewLeaderboard: () => void;
  onViewGarage: () => void;
}

export default function TitleScreen({ onStartRace, onViewLeaderboard, onViewGarage }: TitleScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 px-4">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 relative"
        >
          <div className="absolute inset-0 blur-[30px] bg-[#00ffcc]/30 rounded-full scale-150 -z-10" />
          <h1 className="text-6xl font-black font-['Cinzel'] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] via-white to-[#00ffcc] echo-text mb-2 glitch" data-text="ECHO">
            ECHO
          </h1>
          <h1 className="text-5xl font-black font-['Cinzel'] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-white to-[#ff00ff] glitch" style={{ animationDelay: '0.5s' }} data-text="RACER">
            RACER
          </h1>
          <p className="mt-4 text-[#00ffcc] font-mono text-sm tracking-[0.2em] opacity-80 uppercase">
            Sonic Velocity
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartRace}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00ffcc]/20 to-transparent border border-[#00ffcc]/50 text-[#00ffcc] font-['Cinzel'] font-bold text-xl flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-[#00ffcc]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <Play className="fill-current" />
            START RUN
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="w-1 h-4 bg-[#00ffcc] animate-pulse" />
              <span className="w-1 h-4 bg-[#00ffcc] animate-pulse" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-4 bg-[#00ffcc] animate-pulse" style={{ animationDelay: '0.2s' }} />
            </span>
          </motion.button>

          <div className="flex gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewGarage}
              className="flex-1 py-3 rounded-xl bg-[#111] border border-[#333] hover:border-[#ff00ff]/50 text-white font-mono text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Wrench size={16} className="text-[#ff00ff]" />
              GARAGE
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewLeaderboard}
              className="flex-1 py-3 rounded-xl bg-[#111] border border-[#333] hover:border-[#E8A020]/50 text-white font-mono text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Trophy size={16} className="text-[#E8A020]" />
              RANKS
            </motion.button>
          </div>
        </div>

      </div>

      <div className="mb-8 text-center text-[#444] font-mono text-[10px] space-y-1 tracking-wider">
        <p>ERC-8021 ATTRIBUTION READY</p>
        <p>ERC-8004 TRUSTLESS AGENT SUPPORT</p>
        <p>BASE MAINNET</p>
      </div>
    </div>
  );
}
