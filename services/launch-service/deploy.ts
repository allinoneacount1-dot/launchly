/**
 * Launchly Deployment Service
 *
 * Orchestrates token deployment across Solana and EVM chains.
 * The frontend sends transaction data, the service:
 * 1. Validates the deployment request
 * 2. Stores deployment records in DB
 * 3. Provides deployment status updates
 * 4. Can optionally relay transactions (for gasless deployments)
 */

export interface DeployRequest {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  chains: string[];
  creatorAddress: string;
  status: "pending" | "deploying" | "confirmed" | "failed";
  results: DeployResult[];
  createdAt: number;
  updatedAt: number;
}

export interface DeployResult {
  chain: string;
  txHash?: string;
  contractAddress?: string;
  status: "pending" | "submitted" | "confirmed" | "failed";
  error?: string;
  explorerUrl?: string;
  blockNumber?: number;
  gasUsed?: string;
  timestamp?: number;
}

/* ------------------------------------------------------------------ */
/*  EVM Deployment                                                     */
/* ------------------------------------------------------------------ */

const ERC20_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint8 decimals, uint256 initialSupply) payable returns (address)",
  "function getTokenCount() view returns (uint256)",
  "function allTokens(uint256) view returns (address)",
  "event TokenCreated(uint256 indexed tokenId, address indexed tokenAddress, address indexed creator, string name, string symbol, uint8 decimals, uint256 initialSupply, uint256 timestamp)",
];

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

/**
 * Create the unsigned transaction data for deploying on EVM chains.
 * The user signs this transaction with their wallet.
 */
export function buildEvmDeployTx(
  factoryAddress: string,
  name: string,
  symbol: string,
  decimals: number,
  initialSupply: string,
  fee: bigint = 0n
): { to: string; data: string; value: string } {
  const iface = new (await import("ethers")).Interface(ERC20_FACTORY_ABI);

  // Convert initialSupply to the appropriate decimal format
  const supply = BigInt(initialSupply) * BigInt(10 ** decimals);

  const data = iface.encodeFunctionData("createToken", [
    name,
    symbol,
    decimals,
    supply,
  ]);

  return {
    to: factoryAddress,
    data,
    value: fee.toString(),
  };
}

/**
 * Parse a deployed token address from a TokenCreated event log.
 */
export function parseTokenCreatedEvent(logs: any[]): string | null {
  const iface = new (await import("ethers")).Interface(ERC20_FACTORY_ABI);
  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "TokenCreated") {
        return parsed.args.tokenAddress;
      }
    } catch { /* not our event */ }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Solana Deployment                                                  */
/* ------------------------------------------------------------------ */

/**
 * Build the Solana transaction for creating an SPL token.
 * This creates the mint account + metadata + mints initial supply.
 *
 * The client must:
 * 1. Create a new keypair for the mint
 * 2. Call this function with the mint public key
 * 3. Sign and send the transaction
 */

export const SOLANA_DEPLOY_INSTRUCTIONS = {
  /**
   * Creates the transaction instructions for SPL token deployment.
   * These are the Anchor program instructions that need to be composed
   * with the client.
   */
  createToken: {
    programId: "Launchly111111111111111111111111111111111111111",
    accounts: {
      creator: "signer",
      mint: "new keypair (signer)",
      creatorTokenAccount: "derived ATA",
      metadata: "derived Metaplex PDA",
      creationRecord: "derived PDA [record, mint]",
      tokenMetadataProgram: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
      systemProgram: "11111111111111111111111111111111",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Deployment Storage                                                 */
/* ------------------------------------------------------------------ */

export class DeploymentStore {
  private deployments = new Map<string, DeployRequest>();

  create(req: Omit<DeployRequest, "id" | "status" | "results" | "createdAt" | "updatedAt">): DeployRequest {
    const id = `deploy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();
    const deploy: DeployRequest = {
      ...req,
      id,
      status: "pending",
      results: req.chains.map((chain) => ({ chain, status: "pending" as const })),
      createdAt: now,
      updatedAt: now,
    };
    this.deployments.set(id, deploy);
    return deploy;
  }

  get(id: string): DeployRequest | undefined {
    return this.deployments.get(id);
  }

  updateResult(id: string, chain: string, result: Partial<DeployResult>): DeployRequest | undefined {
    const deploy = this.deployments.get(id);
    if (!deploy) return undefined;

    const idx = deploy.results.findIndex((r) => r.chain === chain);
    if (idx >= 0) {
      deploy.results[idx] = { ...deploy.results[idx], ...result };
    }

    // Update overall status
    const allConfirmed = deploy.results.every((r) => r.status === "confirmed");
    const anyFailed = deploy.results.some((r) => r.status === "failed");
    deploy.status = allConfirmed ? "confirmed" : anyFailed ? "failed" : "deploying";
    deploy.updatedAt = Date.now();

    this.deployments.set(id, deploy);
    return deploy;
  }

  getByCreator(address: string): DeployRequest[] {
    return Array.from(this.deployments.values())
      .filter((d) => d.creatorAddress.toLowerCase() === address.toLowerCase())
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const deploymentStore = new DeploymentStore();
