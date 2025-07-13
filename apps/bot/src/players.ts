import { createWalletClient, encodePacked, keccak256 } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { setTimeout } from "node:timers/promises";
import { MNEMONIC } from "./env";
import { clientConfig, publicClient } from "./viem";

import riddles from './riddles.json';
import { OnchainRiddle } from "./contract";

const wordList = riddles.map(({ answer }) => answer);

export function getRandomWord() {
  const idx = Math.floor(Math.random() * wordList.length);
  return wordList[idx]!;
}

export function createPlayer(playerIndex: number) {
  const account = mnemonicToAccount(MNEMONIC, {
    addressIndex: playerIndex + 2 // Index 0 is for the bot, index 1 is for Metamask
  });

  console.info(`ℹ️ Player #${playerIndex + 1} address: ${account.address}`);

  const walletClient = createWalletClient({
    account,
    ...clientConfig
  });

  async function submitNewAnswer() {
    const isActive = await publicClient.readContract({
      ...OnchainRiddle,
      functionName: 'isActive'
    });

    if (!isActive) {
      await setTimeout(10000);
      return;
    }

    const word = getRandomWord();
    console.log(`📝 Player #${playerIndex + 1} - Submitting answer: ${word}`);
    return walletClient.writeContract({
      ...OnchainRiddle,
      functionName: 'submitAnswer',
      args: [word]
    }).catch(err =>
      console.error(`❌ Player #${playerIndex + 1} - Failed to submit answer:`, err instanceof Error ? err.message : err)
    );
  }

  async function loop() {
    console.log(`▶️ Player #${playerIndex + 1} - Starting`);

    while (true) {
      await setTimeout(Math.random() * 9000 + 1000)
      await submitNewAnswer();
    }
  }

  return {
    submitNewAnswer,
    loop
  }
}
