declare module 'ethers' {
  export class Interface {
    constructor(abi: any[]);
    encodeFunctionData(functionName: string, args: any[]): string;
    parseLog(log: any): { name: string; args: any } | null;
  }
  function getAddress(address: string): string;
  function isAddress(address: string): boolean;
  function id(text: string): string;
  function formatEther(wei: bigint): string;
}

declare module '@solana/web3.js' {
  export class Connection {
    constructor(rpcUrl: string, commitment?: string);
    getMinimumBalanceForRentExemption(size: number): Promise<number>;
    getLatestBlockhash(): Promise<{ blockhash: string }>;
    sendRawTransaction(tx: Buffer): Promise<string>;
    confirmTransaction(sig: string, commitment?: string): Promise<void>;
  }
  export class Transaction {
    feePayer?: any;
    recentBlockhash?: string;
    add(...instructions: any[]): void;
    partialSign(...signers: any[]): void;
  }
  export class Keypair {
    static generate(): Keypair;
    publicKey: { toBase58(): string };
  }
  export const SystemProgram: {
    createAccount(params: any): any;
  };
  export const clusterApiUrl: (cluster: string) => string;
}

declare module '@solana/spl-token' {
  export const MINT_SIZE: number;
  export const TOKEN_PROGRAM_ID: any;
  export const ASSOCIATED_TOKEN_PROGRAM_ID: any;
  export function createInitializeMintInstruction(
    mint: any, decimals: number, mintAuthority: any, freezeAuthority: any, programId: any
  ): any;
  export function getAssociatedTokenAddress(mint: any, owner: any): any;
}

declare module '@solana/wallet-adapter-base' {
  export class WalletError extends Error {
    error: any;
    constructor(message?: string, error?: any);
  }
}
