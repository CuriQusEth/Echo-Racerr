'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Upload } from 'lucide-react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { getAttributionData, encodeAttributionData } from '@/lib/erc8021';

interface GameOverScreenProps {
  score: number;
  distance: number;
  onRetry: () => void;
  onHome: () => void;
}

export default function GameOverScreen({ score, distance, onRetry, onHome }: GameOverScreenProps) {
  const { isConnected } = useAccount();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recordOnChain = () => {
    if (!isConnected) return;
    
    // Minimal demonstration of submitting score on-chain using SIWE/8021 concepts
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // Provided contract
      value: parseEther('0'),
      data: encodeAttributionData() as `0x${string}`, 
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <h2 className="text-4xl font-black font-['Cinzel'] tracking-widest text-[#ff3333] mb-2 glitch" data-text="CRASHED">
          CRASHED
        </h2>
        
        <div className="w-full bg-[#111] border border-[#333] rounded-2xl p-6 mb-8 mt-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent opacity-50" />
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#666] font-mono text-sm">DISTANCE</span>
            <span className="text-2xl font-bold font-mono text-white">{Math.floor(distance)}m</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#666] font-mono text-sm">ECHO COMBO</span>
            <span className="text-2xl font-bold font-mono text-[#00ffcc]">{Math.floor(score)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {mounted && isConnected && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={recordOnChain}
              disabled={isPending || isSuccess}
              className={`w-full py-3 rounded-xl border font-mono text-sm flex items-center justify-center gap-2 transition-colors ${
                isSuccess 
                  ? 'bg-[#00ffcc]/20 border-[#00ffcc]/50 text-[#00ffcc]' 
                  : 'bg-[#ff00ff]/10 border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/20'
              }`}
            >
              <Upload size={16} />
              {isPending ? 'CONFIRMING ON BASE DENIM (200ms)...' : isSuccess ? 'CONFIRMED ON BASE MAINNET' : 'RECORD RUN ON BASE MAINNET'}
            </motion.button>
          )}

          <div className="flex gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex-1 py-4 rounded-xl bg-[#00ffcc]/20 border border-[#00ffcc]/50 text-[#00ffcc] font-['Cinzel'] font-bold flex items-center justify-center gap-2 transition-colors hover:bg-[#00ffcc]/30"
            >
              <RotateCcw size={18} />
              RETRY
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="px-6 py-4 rounded-xl bg-[#111] border border-[#333] text-white hover:border-[#666] transition-colors"
            >
              <Home size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
