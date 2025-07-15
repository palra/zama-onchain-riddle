# Zama Onchain Riddle – Technical Challenge

My submission for the [Zama On-chain riddle Challenge](https://zamaai.notion.site/Challenge-On-chain-Riddle-1975a7358d5e80279c2de1c1af608610?pvs=4). It consists of a full-stack, on-chain riddle game, including a smart contract, a web frontend, and a bot that interacts with the contract.

Uses Next.js 15, Tailwind v4, Shadcn components, TanStack {Query,Form,Virtual}, Jotai, Immer, Wagmi and RainbowKit.

**See challenge report: [REPORT.md](./REPORT.md)**

---

## Project Structure

- **`packages/contracts/`** – Solidity smart contract and deployment scripts (Hardhat) - Git subtree from [poppyseedDev/solidity-riddle](https://github.com/poppyseedDev/solidity-riddle)
- **`apps/web/`** – Next.js web frontend for the riddle game
- **`apps/bot/`** – Node.js bot that manages riddle submissions on-chain - [README.md](./apps/bot/README.md)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v22+, ideally use [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/) (v8+ recommended)
- [Git](https://git-scm.com/)

---

## Monorepo Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:palra/zama-onchain-riddle.git
   cd zama-onchain-riddle
   ```

2. **Install dependencies (from the root):**
   ```bash
   nvm use
   corepack enable pnpm # If needed
   pnpm install
   ```

---

## Environment Variables

### 1. Web App (`apps/web`)

Create a `.env.local` file in `apps/web/` with the following variables:

```env
# WalletConnect Project ID (get one at https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Deployed contract address (if not set, defaults to local Hardhat deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### 2. Bot (`apps/bot`)

Create a `.env` file in `apps/bot/` with the following variables:

```env
# Mnemonic phrase for the bot wallet (must match the contract deployer)
BOT_MNEMONIC="your mnemonic phrase here"

# RPC endpoint (defaults to local Hardhat node)
RPC_URL="http://localhost:8545"

# (Optional) Number of players to simulate (must be less than 18)
PLAYERS_NUMBER=0

# (Optional) Deployed contract address (if not using default)
CONTRACT_ADDRESS=0xYourContractAddress
```

> Note: `.env.example` is already setup with all the good default values for local testing

### 3. Contracts (`packages/contracts`)

If deploying or testing contracts directly, you may need a `.env` file for Hardhat configuration. See `packages/contracts/README.md` for details.

---

## Running the Project

```bash
pnpm dev
```

It will start in parallel:
 * The Next.js app, at [http://localhost:3000](http://localhost:3000).
 * The bot service, that handles submissions of new riddles and fake players.
 * The Hardhat local node, hosting the OnchainRiddle contract.

To interact with the local Hardhat node, setup the accounts seeded by Hardhat. You can import the private key of the **Account #2** on Metamask for your own browser tests.

> The Account #1 is reserved for the bot, and Accounts #3 to #20 used by the bot service to simulate fake players.

