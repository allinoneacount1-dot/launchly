'use client';

import { useState, useEffect } from 'react';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';

const MOCK_DEPLOYS = [
  { chain: 'solana', status: 'confirmed', txHash: '5KJh...x9pQ', time: '2s ago', block: '245,891,234', gas: '0.0008 SOL' },
  { chain: 'ethereum', status: 'confirmed', txHash: '0xab...3f21', time: '15s ago', block: '19,234,567', gas: '0.003 ETH (mixed)' },
  { chain: 'base', status: 'confirmed', txHash: '0xcd...8a12', time: '18s ago', block: '8,912,345', gas: '0.001 ETH (mixed)' },
  { chain: 'bnb', status: 'pending', txHash: '0xef...pending', time: '—', block: '—', gas: '0.002 BNB (mixed)' },
];

const CHAIN_MAP: Record<string, { logo: React.ReactNode; color: string; name: string }> = {
  solana: { logo: <SolanaLogo size={20} />, color: '#9945FF', name: 'Solana' },
  ethereum: { logo: <EthereumLogo size={12} />, color: '#627EEA', name: 'Ethereum' },
  base: { logo: <BaseLogo size={20} />, color: '#0052FF', name: 'Base' },
  bnb: { logo: <BnbLogo size={20} />, color: '#F0B90B', name: 'BNB Chain' },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen px-6 py-12 bg-grid">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-label">Dashboard</div>
          <h1 className="text-3xl md:text-4xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Your Launch Dashboard</h1>
          <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Track deployments, holders, and performance across all chains.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Launches', value: '3', icon: '🚀' },
            { label: 'Chains Used', value: '4', icon: '⛓️' },
            { label: 'Total Holders', value: '5,891', icon: '👥' },
            { label: 'Total Liquidity', value: '$1.2M', icon: '💧' },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {['overview', 'deployments', 'holders', 'liquidity'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === tab ? '' : 'glass-card'}`}
              style={{ background: activeTab === tab ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : undefined, color: activeTab === tab ? 'white' : 'var(--color-text-secondary)' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Latest Deploy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deploy Status */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>Latest Deployment</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>MoonCat ($MCAT) — Launched 2 minutes ago</p>
                </div>
                <span className="status-live">Active</span>
              </div>

              <div className="space-y-3">
                {MOCK_DEPLOYS.map((d, i) => {
                  const chain = CHAIN_MAP[d.chain];
                  return (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: chain.color + '15' }}>
                          {chain.logo}
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</div>
                          <div className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{d.txHash}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Block</div>
                          <div className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{d.block}</div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Gas</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{d.gas}</div>
                        </div>
                        <div>
                          {d.status === 'confirmed' ? <span className="status-live">Confirmed</span> : <span className="status-pending">Pending</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Token Info */}
          <div>
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Token Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Name', value: 'MoonCat' },
                  { label: 'Symbol', value: '$MCAT' },
                  { label: 'Supply', value: '1,000,000,000' },
                  { label: 'Decimals', value: '9' },
                  { label: 'Chains', value: '4' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn-secondary w-full h-10 text-sm">Add Liquidity</button>
                <button className="btn-secondary w-full h-10 text-sm">Transfer Ownership</button>
                <button className="btn-secondary w-full h-10 text-sm">View on Explorer</button>
                <a href="/launch" className="btn-primary w-full h-10 text-sm text-center block">Launch Another Token</a>
              </div>
            </div>
          </div>
        </div>

        {/* Holder Distribution */}
        <div className="mt-8">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-6" style={{ color: 'var(--color-text-primary)' }}>Holder Distribution by Chain</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { chain: 'solana', holders: 2847, pct: 48 },
                { chain: 'ethereum', holders: 1523, pct: 26 },
                { chain: 'base', holders: 891, pct: 15 },
                { chain: 'bnb', holders: 630, pct: 11 },
              ].map((h, i) => {
                const chain = CHAIN_MAP[h.chain];
                return (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: chain.color + '15' }}>
                        {chain.logo}
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</div>
                    </div>
                    <div className="text-2xl font-semibold mb-1" style={{ color: chain.color }}>{h.holders.toLocaleString()}</div>
                    <div className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{h.pct}% of total</div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                      <div className="h-full rounded-full" style={{ width: `${h.pct}%`, background: chain.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
