# Onchain Riddle Bot

This is the automated bot for the [Zama On-chain Riddle Challenge](https://zamaai.notion.site/Challenge-On-chain-Riddle-1975a7358d5e80279c2de1c1af608610?pvs=4). It manages riddle submissions and simulates fake players for the OnchainRiddle smart contract.

---

## What does it do?

- Submits new riddles to the contract when the current one is solved
- Listens for contract events in real-time (e.g., when a riddle is solved)
- Uses a mnemonic to control multiple accounts:
  - **Account #1**: Reserved for the bot (riddle setter)
  - **Account #2**: For your own wallet (e.g., import into MetaMask)
  - **Accounts #3-20**: Used by the bot to simulate fake players submitting answers
- Each fake player runs in parallel, submitting random answers from the riddle collection
- Handles graceful shutdown and event unsubscription

---

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create your environment file:**
   Create a `.env` file in `apps/bot/` with the following variables:
   ```env
   # Mnemonic phrase for the bot wallet (must match the contract deployer)
   BOT_MNEMONIC="your mnemonic phrase here"

   # RPC endpoint (defaults to local Hardhat node)
   RPC_URL="http://localhost:8545"

   # Number of fake players to simulate (must be less than 18)
   PLAYERS_NUMBER=10

   # (Optional) Deployed contract address (if not using default)
   CONTRACT_ADDRESS=0xYourContractAddress
   ```
   - `PLAYERS_NUMBER` controls how many fake players are spawned (max 17).
   - `BOT_MNEMONIC` must match the mnemonic used to deploy the contract.

---

## Usage

### Development
Run the bot in development mode (with hot reload):
```bash
pnpm dev
```

### Production
Build and run the bot:
```bash
pnpm build
pnpm start
```

---

## How it works

- On startup, the bot checks if a riddle is active. If not, it submits a new random riddle.
- It listens for the `Winner` event. When a riddle is solved, it waits 10 seconds and submits a new riddle.
- For each fake player, a loop runs in parallel, submitting random answers at random intervals.
- All riddles and answers are loaded from `src/riddles.json`.

---

## Environment Variables

| Variable         | Description                                 | Required | Default                |
|------------------|---------------------------------------------|----------|------------------------|
| `BOT_MNEMONIC`   | Mnemonic phrase for the bot wallet          | Yes      | -                      |
| `CONTRACT_ADDRESS` | Address of the deployed contract          | Yes      | -                      |
| `RPC_URL`        | RPC endpoint URL                           | No       | `http://localhost:8545`|
| `PLAYERS_NUMBER` | Number of fake players (max 17)            | No       | 0                      |

---

## Riddle Collection

- The bot uses a collection of riddles in `src/riddles.json`.
- Each riddle has a `question` and a simple, lowercase `answer`.

---

## Notes

- The bot is designed for local development and testing with the Hardhat node.
- For best results, use the same mnemonic for both the bot and contract deployment.
- You can import Account #2 into MetaMask for manual testing.
- If you restart the Hardhat node, restart the bot as well.
