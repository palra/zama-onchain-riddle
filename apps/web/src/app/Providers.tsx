"use client";

import { config } from "@/lib/wagmi/config";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { enableMapSet } from "immer";
import { ThemeProvider } from "./ThemeProvider";
import { RainbowKitProvider } from "./RainbowKitProvider";

const queryClient = new QueryClient();

enableMapSet();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
