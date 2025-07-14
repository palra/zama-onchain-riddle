import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { fallback, http, webSocket } from 'wagmi'
import { hardhat } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: "Zama on-chain riddle",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default',
  chains: [hardhat],
  transports: {
    [hardhat.id]: fallback([
      webSocket('ws://127.0.0.1:8545'),
      http(),
    ]),
  },
})

// Utility function to get the target chain (first configured chain)
export const getTargetChain = () => config.chains[0];

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
