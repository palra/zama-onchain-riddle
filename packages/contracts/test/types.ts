import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { OnchainRiddle } from "../types/OnchainRiddle";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    onchainRiddle: OnchainRiddle;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
