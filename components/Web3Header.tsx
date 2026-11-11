'use client';

import { useAccount, useConnect, useDisconnect, useSendTransaction, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base } from 'wagmi/chains';
import { Sun, Wallet, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseEther } from 'viem';
import { encodeAttributionData, getAttributionData } from '@/lib/erc8021';
import { useState, useEffect } from 'react';

export default function Web3Header() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: injected() });
    }
  };

  const isWrongChain = isConnected && chainId !== base.id;

  const sendGMTransaction = () => {
    // Contract 0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3 on Base Mainnet
    // Send 0 ETH with ERC-8021 data on Denim 200ms canonical blocks
    console.log("Sending GM with 8021 data on Base Denim Mainnet:", getAttributionData());
    
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'),
      data: encodeAttributionData() as `0x${string}`, 
    });
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex justify-between items-center pointer-events-auto">
      {/* Network / Denim Status Badge */}
      <div className="flex items-center gap-2">
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0052FF]/15 border border-[#0052FF]/40 text-xs font-mono text-[#70a4ff] shadow-[0_0_12px_rgba(0,82,255,0.25)] cursor-pointer"
          onClick={() => setShowTooltip(!showTooltip)}
          title="Base Denim Mainnet • 200ms Native Canonical Blocks"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffcc]"></span>
          </span>
          <span className="font-bold tracking-tight text-white flex items-center gap-1">
            BASE <span className="text-[#00ffcc] text-[10px] bg-[#00ffcc]/10 px-1 py-0.2 rounded">DENIM</span>
          </span>
          <span className="text-[10px] text-[#88b0ff] hidden sm:inline">• 200ms</span>
        </div>

        {isWrongChain && (
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="px-2.5 py-1 rounded-full bg-[#ff3333]/20 border border-[#ff3333]/50 text-[#ff8888] text-[10px] font-mono hover:bg-[#ff3333]/30 transition-all"
          >
            Switch to Base Mainnet
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {isConnected && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={sendGMTransaction}
              disabled={isPending}
              className="px-3 py-1.5 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-1.5 font-['Cinzel'] text-xs font-bold"
            >
              {isSuccess ? (
                <CheckCircle2 size={13} className="text-[#00ffcc]" />
              ) : (
                <Sun size={13} className={isPending ? "animate-spin" : ""} />
              )}
              {isPending ? "CONFIRMING (200ms)..." : isSuccess ? "GM CONFIRMED!" : "SAY GM"}
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={handleConnect}
          className="px-3.5 py-1.5 rounded-full bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 border border-[#00ffcc]/30 text-[#00ffcc] font-mono text-xs flex items-center gap-2 backdrop-blur-md transition-all uppercase whitespace-nowrap overflow-hidden max-w-[150px] shadow-[0_0_15px_rgba(0,255,204,0.15)]"
        >
          <Wallet size={13} />
          {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "CONNECT"}
        </button>
      </div>
    </div>
  );
}
