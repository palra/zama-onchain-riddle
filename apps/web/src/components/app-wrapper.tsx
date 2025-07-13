"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { WalletConnect } from "./wallet-connect";
import { useEffect } from "react";
import { useNetworkValidation } from "@/hooks/useNetworkValidation";
import { Puzzle } from "lucide-react";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { isConnected } = useAccount();
  const { targetChain, isOnCorrectNetwork } = useNetworkValidation();
  const { switchChain, isPending } = useSwitchChain();

  useEffect(() => {
    if (!isOnCorrectNetwork && !isPending && isConnected) {
      switchChain({ chainId: targetChain.id });
    }
  }, [isConnected, targetChain.id, isOnCorrectNetwork, switchChain, isPending]);

  // If not connected, show wallet connection screen
  if (!isConnected || !isOnCorrectNetwork) {
    return <WalletConnect variant="full" />;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Puzzle className="h-6 w-6 text-gray-900 dark:text-white" />
                <span className="hidden sm:inline">Zama On-chain Riddle</span>
              </span>
            </h1>
            <WalletConnect variant="header" />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
