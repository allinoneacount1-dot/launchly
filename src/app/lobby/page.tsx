'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';
import { FadeInUp, AnimatedCounter } from '@/components/Animations';
import { useLaunches } from '@/components/LaunchTracker';

const CHAIN_MAP: Record<string, { logo: React.ReactNode; color: string; name: string }> = {
  solana: { logo: <SolanaLogo size={14} />, color: '#9945FF', name: 'SOL' },
  ethereum: { logo: <EthereumLogo size={9} />, color: '#627EEA', name: 'ETH' },
  base: { logo: <BaseLogo size={14} />, color: '#0052FF', name: 'BASE' },
  bnb: { logo: <BnbLogo size={14} />, color: '#F0B90B', name: 'BNB' },
};

// Seed data for first-time visitors
const SEED_LAUNCHES = [
  { id: 'seed1', name: 'MoonCat', symbol: 'MCAT', supply: '1000000000', decimals: 9, chains: [{ chain: 'solana', status: 'confirmed' as const, txHash: '5KJh...x9pQ' }, { chain: 'ethereum', status: 'confirmed' as const, txHash: '0xab...3f21' }], creator: '0x1234...5678', createdAt: Date.now() - 120000, holders: 1247, liquidity: '$45,200' },
  { id: 'seed2', name: 'DeFi Rockets', symbol: 'DFR', supply: '500000000', decimals: 9, chains: [{ chain: 'solana', status: 'confirmed' as const }, { chain: 'base', status: 'confirmed' as const }, { chain: 'bnb', status: 'confirmed' as const }], creator: '0xabcd...ef01', createdAt: Date.now() - 300000, holders: 892, liquidity: '$128,500' },
  { id: 'seed3', name: 'PepeVerse', symbol: 'PEPV', supply: '420000000000', decimals: 9, chains: [{ chain: 'solana', status: 'confirmed' as const }], creator: '0x9876...5432', createdAt: Date.now() - 720000, holders: 3421, liquidity: '$89,100' },
  { id: 'seed4', name: 'SolanaAI', symbol: 'SAI', supply: '100000000', decimals: 9, chains: [{ chain: 'solana', status: 'confirmed' as const }, { chain: 'ethereum', status: 'confirmed' as const }, { chain: 'base', status: 'pending' as const }], creator: '0xfeed...beef', createdAt: Date.now() - 1080000, holders: 567, liquidity: '$234,000' },
  { id: 'seed5', name: 'GreenEnergy', symbol: 'GREN', supply: '2000000000', decimals: 9, chains: [{ chain: 'solana', status: 'confirmed' as const }, { chain: 'bnb', status: 'confirmed' as const }], creator: '0xdead...cafe', createdAt: Date.now() - 1500000, holders: 234, liquidity: '$12,800' },
];

export default function LobbyPage() {
  const { launches } = useLaunches();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Merge seed + real launches
  const allLaunches = [...launches, ...SEED_LAUNCHES.filter(s => !launches.find(l => l.id === s.id))];

  // Simulate live data updates for seed launches
  const [liveData, setLiveData] = useState<Record<string, { holders: number; progress: number }>>({});
  useEffect(() => {
    const initial: Record<string, { holders: number; progress: number }> = {};
    allLaunches.forEach(l => {
      if (!liveData[l.id]) {
        const allConfirmed = l.chains.every(c => c.status === 'confirmed');
        initial[l.id] = { holders: l.holders || Math.floor(Math.random() * 3000) + 100, progress: allConfirmed ? 100 : Math.floor(Math.random() * 60) + 20 };
      }
    });
    setLiveData(prev => ({ ...prev, ...initial }));
  }, [launches.length]);

  // Animate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const next = { ...prev };
        for (const id in next) {
          const launch = allLaunches.find(l => l.id === id);
          const allConfirmed = launch?.chains.every(c => c.status === 'confirmed');
          if (!allConfirmed) {
            next[id] = {
              holders: next[id].holders + Math.floor(Math.random() * 3),
              progress: Math.min(100, next[id].progress + Math.random() * 1.5),
            };
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [allLaunches.length]);

  const filtered = allLaunches.filter(l => {
    const allConfirmed = l.chains.every(c => c.status === 'confirmed');
    const hasPending = l.chains.some(c => c.status === 'pending');
    if (filter === 'live' && allConfirmed) return false;
    if (filter === 'completed' && !allConfirmed) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.symbol.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalHolders = allLaunches.reduce((sum, l) => sum + (liveData[l.id]?.holders ?? l.holders ?? 0), 0);
  const liveCount = allLaunches.filter(l => !l.chains.every(c => c.status === 'confirmed')).length;

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-grid">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <div className="section-label">Launch Lobby</div>
          <h1 className="text-3xl md:text-4xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Live Token Launches</h1>
          <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Watch tokens launch in real-time across all supported chains.</p>
        </FadeInUp>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Launches', value: allLaunches.length, color: 'var(--color-primary-light)' },
            { label: 'Live Now', value: liveCount || 2, color: 'var(--color-success)' },
            { label: 'Total Holders', value: totalHolders, color: 'var(--color-accent-light)' },
            { label: 'Active Chains', value: 4, color: '#F0B90B' },
          ].map((s, i) => (
            <FadeInUp key={i} delay={i * 100}>
              <div className="glass-card-premium rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold stat-number mb-1">
                  <AnimatedCounter end={s.value} suffix="+" duration={2000} />
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            </FadeInUp>
          ))}
        </div>

        {/* Filters */}
        <FadeInUp className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {['all', 'live', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? '' : 'glass-card'}`}
                style={{ background: filter === f ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : undefined, color: filter === f ? 'white' : 'var(--color-text-secondary)' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input className="input-field max-w-xs" placeholder="Search tokens..." value={search} onChange={e => setSearch(e.target.value)} />
        </FadeInUp>

        {/* Launch cards */}
        {filtered.length === 0 ? (
          <div className="glass-card-premium rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>No launches yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Be the first to launch a token on Launchly!</p>
            <Link href="/launch" className="btn-primary h-10 px-6 text-sm">Launch Your Token</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((launch, idx) => {
              const allConfirmed = launch.chains.every(c => c.status === 'confirmed');
              const ld = liveData[launch.id] ?? { holders: launch.holders ?? 0, progress: allConfirmed ? 100 : 50 };

              return (
                <FadeInUp key={launch.id} delay={idx * 80}>
                  <div className="glass-card-premium rounded-2xl p-5 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold stat-number">
                          {launch.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{launch.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>${launch.symbol}</div>
                        </div>
                      </div>
                      <span className={allConfirmed ? 'status-pending' : 'status-live'}>
                        {allConfirmed ? 'Done' : 'Live'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {launch.chains.map(c => {
                        const cm = CHAIN_MAP[c.chain];
                        if (!cm) return null;
                        return (
                          <div key={c.chain} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs" style={{ background: cm.color + '15', color: cm.color }}>
                            {cm.logo}
                            {cm.name}
                            {c.status === 'confirmed' && <span className="text-[10px]">✓</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{Math.round(ld.progress)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full rounded-full transition-all duration-1000 progress-animated" style={{ width: `${ld.progress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Holders</div>
                        <div className="text-sm font-medium counter-up" style={{ color: 'var(--color-text-primary)' }}>{ld.holders.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Liquidity</div>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{launch.liquidity ?? '$0'}</div>
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Time</div>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{timeAgo(launch.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
