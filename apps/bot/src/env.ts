export function env<T>(env: string, defaultValue?: string) {
  const value = process.env[env];
  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`${env} env var missing`);
  }

  return value;
}

export const MNEMONIC = env('BOT_MNEMONIC');
export const RPC_URL = env('RPC_URL');
export const PLAYERS_NUMBER = +env('PLAYERS_NUMBER', "0")
if (PLAYERS_NUMBER > 18) {
  throw new Error("Cannot have 18 or more players, not enough funds");
}
