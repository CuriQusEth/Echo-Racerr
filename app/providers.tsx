'use client';

import { ReactNode, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
    }),
  },
  pollingInterval: 200, // Base Denim 200ms canonical block interval
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
