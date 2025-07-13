import 'dotenv/config';
import * as bot from './bot';
import * as contract from './contract';
import { OnchainRiddle } from './contract';
import { createPlayer } from './players';
import { randomRiddle } from './riddles';
import { PLAYERS_NUMBER } from './env';


async function main() {
  try {
    console.log('🤖 Bot starting...');
    console.log('📝 Account:', bot.account.address);
    console.log('📋 Contract:', OnchainRiddle.address);

    // Example: Set a new riddle (only bot can do this)
    // const newRiddle = "What has keys, but no locks; space, but no room; and you can enter, but not go in?";
    // const answer = "keyboard";
    // const answerHash = keccak256(encodePacked(answer));

    // const hash = await contract.write.setRiddle([newRiddle, answerHash]);
    // console.log('✅ Riddle set:', hash);

    const { isActive } = await contract.fetchState();
    if (!isActive) {
      await bot.submitRiddle(randomRiddle());
    }

    const unwatch = bot.listenToSolvedRiddle({
      onRiddleSolved() {
        void bot.submitRiddle(
          randomRiddle()
        )
      },
    })


    for (let i = 0; i < PLAYERS_NUMBER; i++) {
      const player = createPlayer(i);
      player.loop(); // don't await, run in parallel
    }

    process.on('exit', () => {
      unwatch();
      console.log('👂 Unwatched contract event subscription.');
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

