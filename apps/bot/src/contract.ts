import { OnchainRiddle__factory } from "@repo/contracts";
import { env } from "./env";
import { publicClient } from "./viem";

const CONTRACT_ADDRESS = env('CONTRACT_ADDRESS') as `0x${string}`;

export const OnchainRiddle = {
  address: CONTRACT_ADDRESS,
  abi: OnchainRiddle__factory.abi,
}

export async function fetchState() {
  const [riddle, isActive, winner] = await Promise.all([
    publicClient.readContract({
      ...OnchainRiddle,
      functionName: 'riddle'
    }),
    publicClient.readContract({
      ...OnchainRiddle,
      functionName: 'isActive'
    }),
    publicClient.readContract({
      ...OnchainRiddle,
      functionName: 'winner'
    })
  ]);

  console.log('🧩 Current riddle:', riddle);
  console.log('🎯 Is active:', isActive);
  console.log('🏆 Winner:', winner);

  return {
    riddle,
    isActive,
    winner,
  }
}