import { mnemonicToAccount } from "viem/accounts";
import { OnchainRiddle } from "./contract";
import { MNEMONIC } from "./env";
import { clientConfig, publicClient } from "./viem";
import { createWalletClient, keccak256, stringToBytes } from "viem";
import { setTimeout } from "timers/promises";

export const account = mnemonicToAccount(MNEMONIC);
const walletClient = createWalletClient({
  account,
  ...clientConfig
})

export async function submitRiddle({ question, answer }: { question: string, answer: string }) {
  try {
    console.log('📝 Submitting new riddle...');
    console.log('   Riddle:', question);
    console.log('   Answer:', answer);
    const answerHash = keccak256(stringToBytes(answer));
    console.log('   Answer hash:', answerHash);

    const txHash = await walletClient.writeContract({
      ...OnchainRiddle,
      functionName: 'setRiddle',
      args: [question, answerHash],
    });
    console.log('✅ Riddle submitted! Tx hash:', txHash);
  } catch (error) {
    console.error('❌ Failed to submit riddle:', error);
  }
}

export function listenToSolvedRiddle({
  onRiddleSolved,
  waitBefore = 10000
}: {
  onRiddleSolved?: () => void,
  waitBefore?: number
}) {
  console.log('👂 Listening for Winner event...');
  return publicClient.watchContractEvent({
    ...OnchainRiddle,
    eventName: 'Winner',
    onLogs: async (logs) => {
      for (const log of logs) {
        console.log('🎉 Riddle solved!');
        console.log('  Winner:', log.args.user);

        await setTimeout(waitBefore ?? 0);
        onRiddleSolved?.();
      }
    },
    onError: (err) => {
      console.error('❌ Error watching RiddleSolved event:', err);
    }
  });
}