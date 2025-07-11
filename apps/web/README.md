This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```bash
# WalletConnect Project ID (get one at https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Chain configuration (currently set to hardhat, can be changed via environment)
NEXT_PUBLIC_CHAIN_ID=31337
```

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Web3 Features

This app includes:

- **RainbowKit Integration**: Modern wallet connection UI
- **Wallet Connection Required**: Users must connect their wallet to access the app
- **Hardhat Network Support**: Currently configured for local development on Hardhat
- **Chain Switching**: Automatic prompts to switch to the correct network
- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and injected wallets

### Wallet Connection

The app requires users to connect their wallet before accessing the riddle game. The connection screen includes:

- Clear instructions to connect to the Hardhat network
- Multiple wallet options via RainbowKit
- Automatic network switching prompts

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
