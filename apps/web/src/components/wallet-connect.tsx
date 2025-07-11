"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface WalletConnectProps {
  variant?: 'full' | 'header';
}

export function WalletConnect({ variant = 'full' }: WalletConnectProps) {
  if (variant === 'full') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Zama On-chain Riddle
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect your wallet to start playing
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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