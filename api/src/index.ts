/**
 * Launchly API — orchestrates multi-chain token deployments.
 *
 * POST /api/deploy
 *   Body: { name, symbol, decimals, initialSupply, chains[], walletAddress }
 *   Response: { status, txHash, contractAddress, chain, explorerUrl }
 *
 * GET /api/deployments/:address
 *   Returns all tokens created by a wallet address.
 *
 * GET /api/token/:chain/:address
 *   Returns token info (name, symbol, supply) for a deployed token.
 */

import express from "express";
import cors from "cors";
import { z } from "zod";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------------ */
/*  Env / config                                                       */
/* ------------------------------------------------------------------ */

const PORT = Number(process.env.PORT) || 3001;

const EVM_CONFIG: Record<string, { rpc: string; factory: string; chainId: number; explorer: string }> = {
  ethereum: {
    rpc: process.env.ETH_RPC || "",
    factory: process.env.ETH_FACTORY || "",
    chainId: 1,
    explorer: "https://etherscan.io",
  },
  sepolia: {
    rpc: process.env.SEPOLIA_RPC || "",
    factory: process.env.SEPOLIA_FACTORY || "",
    chainId: 11155111,
    explorer: "https://sepolia.etherscan.io",
  },
  base: {
    rpc: process.env.BASE_RPC || "",
    factory: process.env.BASE_FACTORY || "",
    chainId: 8453,
    explorer: "https://basescan.org",
  },
  bsc: {
    rpc: process.env.BSC_RPC || "",
    factory: process.env.BSC_FACTORY || "",
    chainId: 56,
    explorer: "https://bscscan.com",
  },
};

const SOLANA_CONFIG = {
  rpc: process.env.SOLANA_RPC || "https://api.devnet.solana.com",
  programId: process.env.SOLANA_PROGRAM_ID || "",
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const DeploySchema = z.object({
  name: z.string().min(1).max(32),
  symbol: z.string().min(1).max(10),
  decimals: z.number().min(0).max(18),
  initialSupply: z.string(), // string to handle big numbers
  chains: z.array(z.enum(["solana", "ethereum", "base", "bnb"])).min(1),
  walletAddress: z.string(),
});

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "launchly-api", version: "1.0.0" });
});

// Get deployment config (factory addresses, RPC URLs for frontend)
app.get("/api/config", (_req, res) => {
  res.json({
    evmChains: Object.fromEntries(
      Object.entries(EVM_CONFIG).map(([k, v]) => [k, { chainId: v.chainId, factory: v.factory, explorer: v.explorer }])
    ),
    solana: {
      rpc: SOLANA_CONFIG.rpc,
      programId: SOLANA_CONFIG.programId,
      cluster: SOLANA_CONFIG.rpc.includes("mainnet") ? "mainnet" : "devnet",
    },
  });
});

// Deploy token (initiates deployment — actual signing happens client-side)
app.post("/api/deploy", async (req, res) => {
  const body = DeploySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: body.error.issues.map(i => i.message) });
  }

  const { name, symbol, decimals, initialSupply, chains, walletAddress } = body.data;

  // Return deployment instructions for the frontend to execute
  const instructions = chains.map((chain) => {
    if (chain === "solana") {
      return {
        chain: "solana",
        action: "create_spl_token",
        rpc: SOLANA_CONFIG.rpc,
        programId: SOLANA_CONFIG.programId,
        params: { name, symbol, decimals, initialSupply, creator: walletAddress },
      };
    }

    const evmKey = chain === "bnb" ? "bsc" : chain;
    const cfg = EVM_CONFIG[evmKey];
    if (!cfg?.factory) {
      return { chain, error: `Factory not deployed on ${chain}` };
    }

    return {
      chain,
      action: "create_erc20",
      rpc: cfg.rpc,
      factory: cfg.factory,
      chainId: cfg.chainId,
      explorer: cfg.explorer,
      params: { name, symbol, decimals, initialSupply },
    };
  });

  res.json({
    status: "ready",
    tokenId: ethers.id(`${walletAddress}-${Date.now()}-${symbol}`),
    instructions,
    estimatedTime: `${chains.length * 20}s`,
  });
});

// Get deployments by wallet address
app.get("/api/deployments/:address", async (req, res) => {
  const address = req.params.address;
  if (!ethers.isAddress(address) && !address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  // TODO: Query on-chain data from all supported chains
  // For now return empty — will be populated after first real deployment
  res.json({ address, tokens: [] });
});

// Get token info
app.get("/api/token/:chain/:address", async (req, res) => {
  const { chain, address } = req.params;

  if (chain === "solana") {
    // TODO: Query Solana SPL token info
    return res.json({ chain, address, name: "", symbol: "", decimals: 0, supply: "0" });
  }

  const evmKey = chain === "bnb" ? "bsc" : chain;
  const cfg = EVM_CONFIG[evmKey];
  if (!cfg?.rpc) {
    return res.status(400).json({ error: `Unsupported chain: ${chain}` });
  }

  try {
    const provider = new ethers.JsonRpcProvider(cfg.rpc);
    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
    ];
    const erc20 = new ethers.Contract(address, abi, provider);

    const [name, symbol, decimals, supply] = await Promise.all([
      erc20.name().catch(() => ""),
      erc20.symbol().catch(() => ""),
      erc20.decimals().catch(() => 0),
      erc20.totalSupply().catch(() => 0n),
    ]);

    return res.json({
      chain,
      address,
      name,
      symbol,
      decimals,
      supply: supply.toString(),
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`Launchly API running on port ${PORT}`);
});
