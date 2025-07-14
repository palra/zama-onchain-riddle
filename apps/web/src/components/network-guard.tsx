"use client";

import { useSwitchChain } from 'wagmi';
import { useNetworkValidation } from '@/hooks/useNetworkValidation';
import { useEffect } from 'react';

export function NetworkGuard() {
  const { chain, targetChain, isOnCorrectNetwork } = useNetworkValidation();
  const { switchChain, isPending } = useSwitchChain();

  useEffect(() => {
    if (chain && !isOnCorrectNetwork && !isPending) {
      // Automatically switch to the correct network
      switchChain({ chainId: targetChain.id });
    }
  }, [chain, targetChain.id, isOnCorrectNetwork, switchChain, isPending]);

  // Show loading state while switching networks
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Zama On-chain Riddle
          </h1>
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border"></div>
            <p className="text-lg text-muted-foreground">
              Switching to {targetChain.name}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show network mismatch screen
  if (chain && !isOnCorrectNetwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Zama On-chain Riddle
          </h1>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Wrong network detected
            </p>
            <p className="text-sm text-muted-foreground">
              You&apos;re connected to {chain.name}, but this app requires {targetChain.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Switching automatically...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
