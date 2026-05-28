'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';
import { FadeInUp, FadeInLeft, ScaleIn, AnimatedCounter } from '@/components/Animations';
import { useWallet } from '@/components/WalletConnect';
import { useLaunches } from '@/components/LaunchTracker';

const CHAIN_MAP: Record<string, { logo: React.ReactNode; color: string; name: string }> = {
  solana: { logo: <SolanaLogo size={20} />, color: '#9945FF', name: 'Solana' },
  ethereum: { logo: <EthereumLogo size={12} />, color: '#627EEA', name: 'Ethereum' },
  base: { logo: <BaseLogo size={20} />, color: '#0052FF', name: 'Base' },
  bnb: { logo: <BnbLogo size={20} />, color: '#F0B90B', name: 'BNB Chain' },
};

export default function DashboardPage() {
  const { solanaWallet, evmWallet, setModalOpen, isConnected } = useWallet();
  const { launches, getLaunchesByCreator } = useLaunches();
  const [activeTab, setActiveTab] = useState('overview');

  const walletAddress = solanaWallet?.address ?? evmWallet?.address ?? '';
  const myLaunches = walletAddress ? getLaunchesByCreator(walletAddress) : [];
  const latestLaunch = myLaunches[0] ?? null;

  const totalHolders = myLaunches.reduce((sum, l) => sum + (l.holders ?? 0), 0);
  const totalChains = new Set(myLaunches.flatMap(l => l.chains.map(c => c.chain))).size;

  if (!isConnected) {
    return (
      <div className="min-h-screen px-6 py-12 bg-grid flex items-center justify-center">
        <div className="glass-card-premium rounded-2xl p-10 text-center max-w-md">
          <div className="text-5xl mb-6">🔗</div>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Connect Your Wallet</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>Connect your wallet to view your launch dashboard, track deployments, and manage your tokens.</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary h-11 px-8 text-sm">Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-grid">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <div className="section-label">Dashboard</div>
          <h1 className="text-3xl md:text-4xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Your Launch Dashboard</h1>
          <p className="text-base font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {solanaWallet && `${solanaWallet.icon} ${solanaWallet.address.slice(0, 6)}...${solanaWallet.address.slice(-4)}`}
            {solanaWallet && evmWallet && ' · '}
            {evmWallet && `${evmWallet.icon} ${evmWallet.address.slice(0, 6)}...${evmWallet.address.slice(-4)}`}
          </p>
        </FadeInUp>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Your Launches', value: myLaunches.length, icon: '🚀' },
            { label: 'Chains Used', value: totalChains, icon: '⛓️' },
            { label: 'Total Holders', value: totalHolders, icon: '👥' },
            { label: 'All Launches', value: launches.length, icon: '📊' },
          ].map((s, i) => (
            <FadeInUp key={i} delay={i * 100}>
              <div className="glass-card-premium rounded-2xl p-5">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xl font-bold stat-number mb-1">
                  <AnimatedCounter end={s.value} duration={2000} />
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            </FadeInUp>
          ))}
        </div>

        {/* Tabs */}
        <FadeInUp className="flex items-center gap-2 mb-8">
          {['overview', 'deployments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === tab ? '' : 'glass-card'}`}
              style={{ background: activeTab === tab ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : undefined, color: activeTab === tab ? 'white' : 'var(--color-text-secondary)' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </FadeInUp>

        {myLaunches.length === 0 ? (
          <div className="glass-card-premium rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>No launches yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Launch your first token to see it here!</p>
            <Link href="/launch" className="btn-primary h-10 px-6 text-sm">Launch Your Token</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FadeInLeft>
                <div className="glass-card-premium rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>Your Deployments</h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{myLaunches.length} token{myLaunches.length > 1 ? 's' : ''} launched</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {myLaunches.map((launch, i) => (
                      <FadeInUp key={launch.id} delay={i * 100}>
                        <div className="glass-card rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold stat-number">{launch.symbol.charAt(0)}</div>
                              <div>
                                <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{launch.name} (${launch.symbol})</div>
                                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Supply: {Number(launch.supply).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {launch.chains.map(c => {
                              const cm = CHAIN_MAP[c.chain];
                              if (!cm) return null;
                              return (
                                <div key={c.chain} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: cm.color + '15' }}>{cm.logo}</div>
                                    <div className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{cm.name}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {c.txHash && (
                                      <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                        {c.txHash.length > 16 ? `${c.txHash.slice(0, 8)}…${c.txHash.slice(-6)}` : c.txHash}
                                      </span>
                                    )}
                                    <span className={c.status === 'confirmed' ? 'status-live' : c.status === 'failed' ? 'text-xs px-2 py-0.5 rounded-full' : 'status-pending'}
                                      style={c.status === 'failed' ? { background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' } : undefined}>
                                      {c.status === 'confirmed' ? 'Confirmed' : c.status === 'failed' ? 'Failed' : 'Pending'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </FadeInUp>
                    ))}
                  </div>
                </div>
              </FadeInLeft>
            </div>

            <div>
              <ScaleIn delay={150}>
                <div className="glass-card-premium rounded-2xl p-6 mb-6">
                  <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Latest Token</h3>
                  {latestLaunch && (
                    <div className="space-y-3">
                      {[
                        { label: 'Name', value: latestLaunch.name },
                        { label: 'Symbol', value: `$${latestLaunch.symbol}` },
                        { label: 'Supply', value: Number(latestLaunch.supply).toLocaleString() },
                        { label: 'Decimals', value: String(latestLaunch.decimals) },
                        { label: 'Chains', value: String(latestLaunch.chains.length) },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                          <span style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScaleIn>

              <ScaleIn delay={300}>
                <div className="glass-card-premium rounded-2xl p-6">
                  <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/launch" className="btn-primary w-full h-10 text-sm block text-center">Launch Another Token</Link>
                    <Link href="/lobby" className="btn-secondary w-full h-10 text-sm block text-center">View Lobby</Link>
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
