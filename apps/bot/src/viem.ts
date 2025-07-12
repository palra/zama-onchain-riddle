import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { RPC_URL } from "./env";

export const clientConfig = {
  chain: hardhat,
  transport: http(RPC_URL)
} as const;

export const publicClient = createPublicClient({
  ...clientConfig
})
