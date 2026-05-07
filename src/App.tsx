/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/web3';
import { GameProvider } from './game/GameContext';
import GameRouter from './components/GameRouter';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <div className="w-full h-screen bg-black text-white overflow-hidden select-none">
            <GameRouter />
          </div>
        </GameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
