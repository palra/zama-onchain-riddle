# Riddle Bot

A Node.js bot that automatically submits riddles to the OnchainRiddle smart contract. The bot listens for events and submits new riddles whenever the current one is solved.

## Features

- 🤖 Automatically submits new riddles when the current one is solved
- 👂 Listens to contract events in real-time
- 🔐 Uses secure mnemonic phrase authentication
- 🎯 Includes a collection of 100 classic riddles
- 🛑 Graceful shutdown handling
- ⏱️ Configurable delay before submitting new riddles
- 🔄 Random riddle selection from predefined collection

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - `BOT_MNEMONIC`: The mnemonic phrase for the bot wallet (must be the deployer)
   - `CONTRACT_ADDRESS`: The deployed contract address
   - `RPC_URL`: RPC endpoint (defaults to local Hardhat)

3. **Build the project:**
   ```bash
   pnpm build
   ```

## Usage

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm start
```

## How it works

1. The bot connects to the blockchain using the provided RPC URL
2. It verifies the current contract state (riddle, isActive, winner)
3. If no riddle is active, it submits a new random riddle
4. It listens for `Winner` events (when someone solves a riddle)
5. When a riddle is solved, it waits 10 seconds then submits a new random riddle
6. The bot cycles through a predefined collection of 100 riddles

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BOT_MNEMONIC` | Mnemonic phrase for the bot wallet | Yes | - |
| `CONTRACT_ADDRESS` | Address of the deployed contract | Yes | - |
| `RPC_URL` | RPC endpoint URL | No | `http://localhost:8545` |

## Events

The bot listens to these contract events:

- `Winner`: Triggered when someone solves a riddle
  - Waits 10 seconds before submitting a new riddle
  - Logs the winner's address

## Riddle Collection

The bot includes a collection of 100 riddles in `src/riddles.json`. Each riddle has:
- `question`: The riddle text
- `answer`: Simple lowercase answer (easy to hash)

Examples:
- "What has keys, but no locks; space, but no room; and you can enter, but not go in?" → "keyboard"
- "What gets wetter and wetter the more it dries?" → "towel"
- "What has a head and a tail but no body?" → "coin"
