'use client';

import { useState } from 'react';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';

const CHAINS = [
  { id: 'solana', name: 'Solana', type: 'L1', logo: <SolanaLogo size={20} />, color: '#9945FF', bg: 'rgba(153, 69, 255, 0.08)', fee: '~0.001 SOL' },
  { id: 'ethereum', name: 'Ethereum', type: 'L1', logo: <EthereumLogo size={12} />, color: '#627EEA', bg: 'rgba(98, 126, 234, 0.08)', fee: 'Covered by mixer' },
  { id: 'base', name: 'Base', type: 'L2', logo: <BaseLogo size={20} />, color: '#0052FF', bg: 'rgba(0, 82, 255, 0.08)', fee: 'Covered by mixer' },
  { id: 'bnb', name: 'BNB Chain', type: 'L1', logo: <BnbLogo size={20} />, color: '#F0B90B', bg: 'rgba(240, 185, 11, 0.08)', fee: 'Covered by mixer' },
];

export default function LaunchPage() {
  const [step, setStep] = useState(1);
  const [selectedChains, setSelectedChains] = useState<string[]>(['solana']);
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    supply: '',
    decimals: '9',
    description: '',
    logo: '',
    website: '',
    twitter: '',
    telegram: '',
  });
  const [deploying, setDeploying] = useState(false);
  const [deployResults, setDeployResults] = useState<{ chain: string; status: string; txHash: string }[]>([]);

  const toggleChain = (id: string) => {
    if (id === 'solana') return; // Solana always selected
    setSelectedChains(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setStep(4);
    // Simulate deployment
    const results: { chain: string; status: string; txHash: string }[] = [];
    for (const chain of selectedChains) {
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
      results.push({
        chain,
        status: 'confirmed',
        txHash: `${chain.slice(0, 4)}_${Math.random().toString(36).slice(2, 10)}...${Math.random().toString(36).slice(2, 6)}`,
      });
      setDeployResults([...results]);
    }
    setDeploying(false);
  };

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen px-6 py-12 bg-grid">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-label">Token Launch</div>
          <h1 className="text-3xl md:text-4xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Create & Deploy Your Token</h1>
          <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Launch to multiple chains in one transaction. Only a Solana wallet needed.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {['Details', 'Chains', 'Review', 'Deploy'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step > i + 1 ? 'text-white' : step === i + 1 ? 'text-white' : ''}`}
                style={{ background: step >= i + 1 ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'var(--color-surface)', border: step >= i + 1 ? 'none' : '1px solid var(--color-border)' }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: step >= i + 1 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{s}</span>
              {i < 3 && <div className="w-8 h-px mx-2" style={{ background: step > i + 1 ? 'var(--color-primary)' : 'var(--color-border)' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Token Details */}
        {step === 1 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-6" style={{ color: 'var(--color-text-primary)' }}>Token Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Token Name *</label>
                <input className="input-field" placeholder="e.g. Launchly Token" value={form.name} onChange={e => updateForm('name', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Symbol *</label>
                <input className="input-field" placeholder="e.g. LCH" value={form.symbol} onChange={e => updateForm('symbol', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Total Supply *</label>
                <input className="input-field" placeholder="e.g. 1000000000" value={form.supply} onChange={e => updateForm('supply', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Decimals</label>
                <input className="input-field" placeholder="9" value={form.decimals} onChange={e => updateForm('decimals', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
                <textarea className="input-field min-h-[100px] resize-none" placeholder="Describe your token..." value={form.description} onChange={e => updateForm('description', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Logo URL</label>
                <input className="input-field" placeholder="https://..." value={form.logo} onChange={e => updateForm('logo', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Website</label>
                <input className="input-field" placeholder="https://..." value={form.website} onChange={e => updateForm('website', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Twitter</label>
                <input className="input-field" placeholder="@handle" value={form.twitter} onChange={e => updateForm('twitter', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Telegram</label>
                <input className="input-field" placeholder="@group" value={form.telegram} onChange={e => updateForm('telegram', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button className="btn-primary h-11 px-8 text-sm" onClick={() => setStep(2)} disabled={!form.name || !form.symbol || !form.supply}>
                Next: Select Chains →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Chain Selection */}
        {step === 2 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Select Chains</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Solana is always included as your home base. Add EVM chains as needed.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {CHAINS.map(chain => {
                const selected = selectedChains.includes(chain.id);
                const isSolana = chain.id === 'solana';
                return (
                  <button key={chain.id} onClick={() => toggleChain(chain.id)}
                    className={`glass-card rounded-2xl p-5 text-left transition-all ${selected ? 'ring-2' : ''}`}
                    style={{ borderColor: selected ? chain.color : undefined, boxShadow: selected ? `0 0 20px ${chain.color}22, inset 0 0 0 2px ${chain.color}` : undefined }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: chain.bg }}>{chain.logo}</div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{chain.type}</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selected ? '' : 'border'}`}
                        style={{ background: selected ? chain.color : 'transparent', borderColor: selected ? 'none' : 'var(--color-border)' }}>
                        {selected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="m5 12 5 5L20 7" /></svg>}
                      </div>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Gas: {chain.fee}</div>
                    {isSolana && <div className="text-xs mt-1" style={{ color: 'var(--color-primary-light)' }}>Required — home base chain</div>}
                  </button>
                );
              })}
            </div>

            <div className="glass-card rounded-xl p-4 mb-6" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Privacy Mixer Active</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>EVM gas fees are automatically covered through our privacy mixer. You only pay in SOL.</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button className="btn-secondary h-11 px-6 text-sm" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary h-11 px-8 text-sm" onClick={() => setStep(3)}>Next: Review →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-6" style={{ color: 'var(--color-text-primary)' }}>Review & Launch</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Token Info</div>
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Symbol', value: form.symbol },
                  { label: 'Supply', value: Number(form.supply).toLocaleString() },
                  { label: 'Decimals', value: form.decimals },
                  { label: 'Description', value: form.description || '—' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Deploying To</div>
                {selectedChains.map(id => {
                  const chain = CHAINS.find(c => c.id === id)!;
                  return (
                    <div key={id} className="flex items-center gap-3 glass-card rounded-xl p-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: chain.bg }}>{chain.logo}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{chain.fee}</div>
                      </div>
                      <span className="status-live">Ready</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 mb-8" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Total cost: <strong>~0.001 SOL</strong> — all EVM gas covered by mixer
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button className="btn-secondary h-11 px-6 text-sm" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary h-11 px-8 text-sm" onClick={handleDeploy}>
                🚀 Launch on {selectedChains.length} Chain{selectedChains.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Deployment Progress */}
        {step === 4 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {deploying ? 'Deploying...' : 'Deployment Complete! 🎉'}
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {deploying ? 'Your token is being deployed across selected chains.' : 'Your token is now live on all selected chains.'}
            </p>

            <div className="space-y-4 mb-8">
              {selectedChains.map(id => {
                const chain = CHAINS.find(c => c.id === id)!;
                const result = deployResults.find(r => r.chain === id);
                const isDeploying = deploying && !result;
                const isDone = !!result;

                return (
                  <div key={id} className="glass-card rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: chain.bg }}>{chain.logo}</div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</div>
                        {result && <div className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{result.txHash}</div>}
                      </div>
                    </div>
                    <div>
                      {isDeploying && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: chain.color }} />
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Deploying...</span>
                        </div>
                      )}
                      {isDone && <span className="status-live">Confirmed</span>}
                      {!isDeploying && !isDone && <span className="status-pending">Waiting...</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {!deploying && deployResults.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/dashboard" className="btn-primary h-11 px-8 text-sm text-center">View Dashboard</a>
                <a href="/lobby" className="btn-secondary h-11 px-8 text-sm text-center">View in Lobby</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
