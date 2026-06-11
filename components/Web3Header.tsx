'use client';

import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Sun, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseEther } from 'viem';
import { encodeAttributionData, getAttributionData } from '@/lib/erc8021';
import { useState } from 'react';

export default function Web3Header() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: injected() });
    }
  };

  const sendGMTransaction = () => {
    // Contract 0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3
    // Send 0 ETH with ERC-8021 data
    console.log("Sending GM with 8021 data:", getAttributionData());
    
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'),
      data: encodeAttributionData() as `0x${string}`, 
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex justify-between items-start pointer-events-auto">
      <div className="flex flex-col gap-2 relative z-50">
        <AnimatePresence>
          {isConnected && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={sendGMTransaction}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              disabled={isPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun size={14} className={isPending ? "animate-spin" : ""} />
               {isPending ? "SENDING..." : isSuccess ? "GM SENT!" : "SAY GM"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleConnect}
        className="px-4 py-2 rounded-full bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 border border-[#00ffcc]/30 text-[#00ffcc] font-mono text-xs flex items-center gap-2 backdrop-blur-md transition-all uppercase whitespace-nowrap overflow-hidden max-w-[150px] shadow-[0_0_15px_rgba(0,255,204,0.15)]"
      >
        <Wallet size={14} />
        {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "CONNECT"}
      </button>
    </div>
  );
}
