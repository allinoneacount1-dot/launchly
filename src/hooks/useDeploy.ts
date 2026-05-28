'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '../components/WalletConnect';

export interface DeployConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

export interface ChainDeployResult {
  chain: string;
  status: 'idle' | 'preparing' | 'signing' | 'submitted' | 'confirmed' | 'failed';
  txHash?: string;
  contractAddress?: string;
  explorerUrl?: string;
  error?: string;
}

const EVM_CHAINS: Record<string, { chainId: number; factory: string; explorer: string }> = {
  sepolia:     { chainId: 11155111, factory: process.env.NEXT_PUBLIC_SEPOLIA_FACTORY || '',     explorer: 'https://sepolia.etherscan.io' },
  baseSepolia: { chainId: 84532,   factory: process.env.NEXT_PUBLIC_BASE_SEPOLIA_FACTORY || '', explorer: 'https://sepolia.basescan.org' },
  bscTestnet:  { chainId: 97,      factory: process.env.NEXT_PUBLIC_BSC_TESTNET_FACTORY || '',  explorer: 'https://testnet.bscscan.com' },
  ethereum:    { chainId: 1,       factory: process.env.NEXT_PUBLIC_ETH_FACTORY || '',           explorer: 'https://etherscan.io' },
  base:        { chainId: 8453,    factory: process.env.NEXT_PUBLIC_BASE_FACTORY || '',           explorer: 'https://basescan.org' },
  bsc:         { chainId: 56,      factory: process.env.NEXT_PUBLIC_BSC_FACTORY || '',            explorer: 'https://bscscan.com' },
};

const FACTORY_ABI = [
  'function createToken(string name, string symbol, uint8 decimals, uint256 initialSupply) payable returns (address)',
  'event TokenCreated(uint256 indexed tokenId, address indexed tokenAddress, address indexed creator, string name, string symbol, uint8 decimals, uint256 initialSupply, uint256 timestamp)',
];

export function useDeploy() {
  const { evmWallet, solanaWallet } = useWallet();
  const [deploying, setDeploying] = useState(false);
  const [results, setResults] = useState<ChainDeployResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => { setResults([]); setError(null); setDeploying(false); }, []);

  /* ---- EVM via window.ethereum (MetaMask / etc) ---- */
  const deployEvm = useCallback(async (chainKey: string, cfg: DeployConfig): Promise<ChainDeployResult> => {
    const chain = EVM_CHAINS[chainKey];
    if (!chain?.factory) return { chain: chainKey, status: 'failed', error: `No factory on ${chainKey}` };

    try {
      const eth = (window as any).ethereum;
      if (!eth) return { chain: chainKey, status: 'failed', error: 'No EVM wallet' };

      // Switch chain
      try {
        await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x' + chain.chainId.toString(16) }] });
      } catch (e: any) {
        if (e?.code !== 4902) throw e; // ignore "already on chain" errors
      }

      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];
      if (!from) return { chain: chainKey, status: 'failed', error: 'No account' };

      // Build tx data
      const { Interface } = await import('ethers');
      const iface = new Interface(FACTORY_ABI);
      const supply = BigInt(cfg.initialSupply) * (10n ** BigInt(cfg.decimals));
      const data = iface.encodeFunctionData('createToken', [cfg.name, cfg.symbol, cfg.decimals, supply]);

      const txHash: string = await eth.request({ method: 'eth_sendTransaction', params: [{ from, to: chain.factory, data }] });

      return { chain: chainKey, status: 'submitted', txHash, explorerUrl: `${chain.explorer}/tx/${txHash}` };
    } catch (e: any) {
      const msg = e?.message || String(e);
      return { chain: chainKey, status: 'failed', error: msg.includes('rejected') ? 'Rejected' : msg.slice(0, 150) };
    }
  }, []);

  /* ---- Solana via window.solana (Phantom / Glow) ---- */
  const deploySolana = useCallback(async (cfg: DeployConfig): Promise<ChainDeployResult> => {
    const sol = (window as any).solana;
    if (!sol) return { chain: 'solana', status: 'failed', error: 'No Solana wallet' };

    try {
      if (!sol.publicKey) await sol.connect();

      // Dynamic import — only loaded when needed (no build bloat)
      const web3 = await import('@solana/web3.js');
      const splToken = await import('@solana/spl-token');

      const conn = new web3.Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com', 'confirmed'
      );

      const mintKeypair = web3.Keypair.generate();
      const creator = sol.publicKey;
      const rentExempt = await conn.getMinimumBalanceForRentExemption(splToken.MINT_SIZE);

      const tx = new web3.Transaction();
      tx.add(web3.SystemProgram.createAccount({
        fromPubkey: creator,
        newAccountPubkey: mintKeypair.publicKey,
        space: splToken.MINT_SIZE,
        lamports: rentExempt,
        programId: splToken.TOKEN_PROGRAM_ID,
      }));
      tx.add(splToken.createInitializeMintInstruction(
        mintKeypair.publicKey, cfg.decimals, creator, creator, splToken.TOKEN_PROGRAM_ID
      ));

      tx.feePayer = creator;
      tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
      tx.partialSign(mintKeypair);

      const signed = await sol.signTransaction(tx);
      const sig = await conn.sendRawTransaction(signed.serialize());
      await conn.confirmTransaction(sig, 'confirmed');

      return {
        chain: 'solana', status: 'confirmed', txHash: sig,
        contractAddress: mintKeypair.publicKey.toBase58(),
        explorerUrl: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
      };
    } catch (e: any) {
      const msg = e?.message || String(e);
      return { chain: 'solana', status: 'failed', error: msg.includes('rejected') ? 'Rejected' : msg.slice(0, 150) };
    }
  }, []);

  /* ---- Multi-chain orchestrator ---- */
  const deployAll = useCallback(async (cfg: DeployConfig, chains: string[]) => {
    setDeploying(true);
    setError(null);
    setResults(chains.map(c => ({ chain: c, status: 'idle' as const })));

    await Promise.all(chains.map(async (chain) => {
      setResults(prev => prev.map(r => r.chain === chain ? { ...r, status: 'signing' as const } : r));
      const res = chain === 'solana' ? await deploySolana(cfg) : await deployEvm(chain, cfg);
      setResults(prev => prev.map(r => r.chain === chain ? { ...r, ...res } : r));
    }));

    setDeploying(false);
  }, [deployEvm, deploySolana]);

  return { deployAll, deployEvm, deploySolana, deploying, results, error, reset };
}
