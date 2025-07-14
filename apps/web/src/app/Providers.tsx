"use client";

import { config } from "@/lib/wagmi/config";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { enableMapSet } from "immer";

const queryClient = new QueryClient();

enableMapSet();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
