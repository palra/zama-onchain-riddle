import { OnchainRiddle__factory } from "@repo/contracts";

export const OnchainRiddle = {
  address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
  abi: OnchainRiddle__factory.abi,
} as const; 