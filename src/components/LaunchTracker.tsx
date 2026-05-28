'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface LaunchRecord {
  id: string;
  name: string;
  symbol: string;
  supply: string;
  decimals: number;
  chains: { chain: string; status: 'pending' | 'confirmed' | 'failed'; txHash?: string; contractAddress?: string; explorerUrl?: string }[];
  creator: string; // wallet address
  createdAt: number; // timestamp
  holders: number;
  liquidity: string;
  description?: string;
}

interface LaunchCtx {
  launches: LaunchRecord[];
  addLaunch: (launch: LaunchRecord) => void;
  updateLaunch: (id: string, updates: Partial<LaunchRecord>) => void;
  updateChainStatus: (id: string, chain: string, status: LaunchRecord['chains'][0]['status'], txHash?: string, contractAddress?: string) => void;
  getLaunchesByCreator: (address: string) => LaunchRecord[];
}

const LaunchCtx = createContext<LaunchCtx>(null!);
export function useLaunches() { return useContext(LaunchCtx); }

export function LaunchProvider({ children }: { children: React.ReactNode }) {
  const [launches, setLaunches] = useState<LaunchRecord[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem('launchly_launches');
      if (s) setLaunches(JSON.parse(s));
    } catch {/**/}
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem('launchly_launches', JSON.stringify(launches));
  }, [launches]);

  const addLaunch = useCallback((launch: LaunchRecord) => {
    setLaunches(prev => [launch, ...prev]);
  }, []);

  const updateLaunch = useCallback((id: string, updates: Partial<LaunchRecord>) => {
    setLaunches(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const updateChainStatus = useCallback((id: string, chain: string, status: LaunchRecord['chains'][0]['status'], txHash?: string, contractAddress?: string) => {
    setLaunches(prev => prev.map(l => {
      if (l.id !== id) return l;
      return {
        ...l,
        chains: l.chains.map(c => c.chain === chain ? { ...c, status, txHash: txHash ?? c.txHash, contractAddress: contractAddress ?? c.contractAddress } : c),
      };
    }));
  }, []);

  const getLaunchesByCreator = useCallback((address: string) => {
    return launches.filter(l => l.creator.toLowerCase() === address.toLowerCase());
  }, [launches]);

  return (
    <LaunchCtx.Provider value={{ launches, addLaunch, updateLaunch, updateChainStatus, getLaunchesByCreator }}>
      {children}
    </LaunchCtx.Provider>
  );
}
