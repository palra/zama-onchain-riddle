"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface WalletConnectProps {
  variant?: 'full' | 'header';
}

export function WalletConnect({ variant = 'full' }: WalletConnectProps) {
  if (variant === 'full') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Zama On-chain Riddle
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect your wallet to start playing
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure to connect to the Hardhat network
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return <ConnectButton />;
  }

  return null;
}
