export function env(env: string) {
  const value = process.env[env];
  if (!value) {
    throw new Error(`${env} env var missing`);
  }

  return value;
}

export const MNEMONIC = env('BOT_MNEMONIC');
export const RPC_URL = env('RPC_URL');