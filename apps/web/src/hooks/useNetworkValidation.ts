import { useAccount } from 'wagmi';
import { getTargetChain } from '@/lib/wagmi/config';

export function useNetworkValidation() {
  const { chain, isConnected } = useAccount();
  const targetChain = getTargetChain();

  const isOnCorrectNetwork = chain?.id === targetChain.id;
  const isNetworkValid = isConnected && isOnCorrectNetwork;

  return {
    chain,
    targetChain,
    isConnected,
    isOnCorrectNetwork,
    isNetworkValid,
  };
} 