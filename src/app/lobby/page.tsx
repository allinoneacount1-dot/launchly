'use client';

import { useState, useEffect, useRef } from 'react';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';
import { FadeInUp, ScaleIn, AnimatedCounter } from '@/components/Animations';

const MOCK_LAUNCHES = [
  { id: 1, name: 'MoonCat', symbol: 'MCAT', chains: ['solana', 'ethereum'], supply: '1,000,000,000', holders: 1247, liquidity: '$45,200', time: '2m ago', status: 'live', progress: 87 },
  { id: 2, name: 'DeFi Rockets', symbol: 'DFR', chains: ['solana', 'base', 'bnb'], supply: '500,000,000', holders: 892, liquidity: '$128,500', time: '5m ago', status: 'live', progress: 64 },
  { id: 3, name: 'PepeVerse', symbol: 'PEPV', chains: ['solana'], supply: '420,000,000,000', holders: 3421, liquidity: '$89,100', time: '12m ago', status: 'live', progress: 92 },
  { id: 4, name: 'SolanaAI', symbol: 'SAI', chains: ['solana', 'ethereum', 'base'], supply: '100,000,000', holders: 567, liquidity: '$234,000', time: '18m ago', status: 'live', progress: 45 },
  { id: 5, name: 'GreenEnergy', symbol: 'GREN', chains: ['solana', 'bnb'], supply: '2,000,000,000', holders: 234, liquidity: '$12,800', time: '25m ago', status: 'live', progress: 71 },
  { id: 6, name: 'MetaGuild', symbol: 'MGUILD', chains: ['solana', 'ethereum'], supply: '50,000,000', holders: 1893, liquidity: '$567,000', time: '31m ago', status: 'completed', progress: 100 },
  { id: 7, name: 'QuantumSwap', symbol: 'QSWAP', chains: ['solana', 'base'], supply: '750,000,000', holders: 445, liquidity: '$78,900', time: '42m ago', status: 'live', progress: 33 },
  { id: 8, name: 'PixelPunks', symbol: 'PXPK', chains: ['solana'], supply: '10,000,000,000', holders: 5678, liquidity: '$156,300', time: '1h ago', status: 'completed', progress: 100 },
];

const CHAIN_MAP: Record<string, { logo: React.ReactNode; color: string; name: string }> = {
  solana: { logo: <SolanaLogo size={14} />, color: '#9945FF', name: 'SOL' },
  ethereum: { logo: <EthereumLogo size={9} />, color: '#627EEA', name: 'ETH' },
  base: { logo: <BaseLogo size={14} />, color: '#0052FF', name: 'BASE' },
  bnb: { logo: <BnbLogo size={14} />, color: '#F0B90B', name: 'BNB' },
};

export default function LobbyPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [launches, setLaunches] = useState(MOCK_LAUNCHES);

  useEffect(() => {
    const interval = setInterval(() => {
      setLaunches(prev => prev.map(l => ({
        ...l,
        holders: l.status === 'live' ? l.holders + Math.floor(Math.random() * 5) : l.holders,
        progress: l.status === 'live' ? Math.min(100, l.progress + Math.random() * 2) : l.progress,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = launches.filter(l => {
    if (filter === 'live' && l.status !== 'live') return false;
    if (filter === 'completed' && l.status !== 'completed') return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.symbol.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            { label: 'Total Launches', value: 1247, color: 'var(--color-primary-light)' },
            { label: 'Live Now', value: 6, color: 'var(--color-success)' },
            { label: 'Total Volume', value: 12, suffix: '.4M', isSpecial: true, color: 'var(--color-accent-light)' },
            { label: 'Active Chains', value: 4, color: '#F0B90B' },
          ].map((s, i) => (
            <FadeInUp key={i} delay={i * 100}>
              <div className="glass-card-premium rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold stat-number mb-1">
                  {s.isSpecial ? (
                    <AnimatedCounter end={s.value} prefix="$" suffix={s.suffix} duration={2000} />
                  ) : (
                    <AnimatedCounter end={s.value} suffix="+" duration={2000} />
                  )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((launch, idx) => (
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
                  <span className={launch.status === 'live' ? 'status-live' : 'status-pending'}>
                    {launch.status === 'live' ? 'Live' : 'Done'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {launch.chains.map(c => (
                    <div key={c} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs" style={{ background: CHAIN_MAP[c]?.color + '15', color: CHAIN_MAP[c]?.color }}>
                      {CHAIN_MAP[c]?.logo}
                      {CHAIN_MAP[c]?.name}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{Math.round(launch.progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-1000 progress-animated" style={{ width: `${launch.progress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Holders</div>
                    <div className="text-sm font-medium counter-up" style={{ color: 'var(--color-text-primary)' }}>{launch.holders.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Liquidity</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{launch.liquidity}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Time</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{launch.time}</div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </div>
  );
}
