'use client';

import { useState, useCallback, useEffect, useMemo, createContext, useContext } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface ConnectedWallet {
  id: string;
  name: string;
  address: string;
  icon: string;
  chain?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getWin() { return typeof window !== 'undefined' ? window : {} as any; }

/* ------------------------------------------------------------------ */
/*  Wallet detection                                                   */
/* ------------------------------------------------------------------ */
function detectWallets() {
  const w = getWin() as any;
  const eth = w.ethereum;
  return {
    phantom:     !!w.solana?.isPhantom && !w.solana?.isGlow,
    solflare:    !!w.solflare?.isSolflare,
    backpack:    !!w.backpack?.isBackpack,
    glow:        !!w.solana?.isGlow,
    metamask:    !!eth?.isMetaMask && !eth?.isBraveWallet,
    brave:       !!eth?.isBraveWallet,
    coinbase:    !!eth?.isCoinbaseWallet,
    trust:       !!eth?.isTrust,
    rabby:       !!w.rabby,
  };
}

/* ------------------------------------------------------------------ */
/*  Wallet definitions                                                 */
/* ------------------------------------------------------------------ */
interface WalletDef {
  id: string;
  label: string;
  icon: string;
  type: 'solana' | 'evm';
  detect: (d: ReturnType<typeof detectWallets>) => boolean;
  connect: () => Promise<ConnectedWallet>;
  downloadUrl: string;
}

function getWalletDefs(): WalletDef[] {
  const w = getWin() as any;
  const eth = w.ethereum;

  return [
    {
      id: 'phantom', label: 'Phantom', icon: '👻', type: 'solana',
      detect: d => d.phantom,
      connect: async () => {
        const sol = w.solana;
        if (!sol?.isPhantom) throw new Error('Phantom not found');
        const r = await sol.connect();
        return { id: 'phantom', name: 'Phantom', address: r.publicKey.toString(), icon: '👻' };
      },
      downloadUrl: 'https://phantom.app/download',
    },
    {
      id: 'solflare', label: 'Solflare', icon: '☀️', type: 'solana',
      detect: d => d.solflare,
      connect: async () => {
        const s = w.solflare;
        if (!s?.isSolflare) throw new Error('Solflare not found');
        if (!s.connected) await s.connect();
        return { id: 'solflare', name: 'Solflare', address: s.publicKey.toString(), icon: '☀️' };
      },
      downloadUrl: 'https://solflare.com/download',
    },
    {
      id: 'backpack', label: 'Backpack', icon: '🎒', type: 'solana',
      detect: d => d.backpack,
      connect: async () => {
        const b = w.backpack;
        if (!b?.isBackpack) throw new Error('Backpack not found');
        const r = await b.connect();
        return { id: 'backpack', name: 'Backpack', address: r.publicKey.toString(), icon: '🎒' };
      },
      downloadUrl: 'https://backpack.app/download',
    },
    {
      id: 'metamask', label: 'MetaMask', icon: '🦊', type: 'evm',
      detect: d => d.metamask,
      connect: async () => {
        if (!eth) throw new Error('MetaMask not found');
        const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
        const chainId: string = await eth.request({ method: 'eth_chainId' });
        if (!accounts.length) throw new Error('No accounts returned');
        const CHAIN_NAMES: Record<string, string> = {
          '0x1': 'Ethereum', '0x2105': 'Base', '0x38': 'BNB Chain',
          '0xa4b1': 'Arbitrum', '0x89': 'Polygon', '0xa': 'Optimism',
          '0xaa36a7': 'Sepolia', '0x14a34': 'Base Sepolia', '0x61': 'BSC Testnet',
        };
        return { id: 'metamask', name: 'MetaMask', address: accounts[0], icon: '🦊', chain: CHAIN_NAMES[chainId] ?? `Chain ${parseInt(chainId, 16)}` };
      },
      downloadUrl: 'https://metamask.io/download',
    },
    {
      id: 'coinbase', label: 'Coinbase Wallet', icon: '🔵', type: 'evm',
      detect: d => d.coinbase,
      connect: async () => {
        if (!eth?.isCoinbaseWallet) throw new Error('Coinbase Wallet not found');
        const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) throw new Error('No accounts');
        return { id: 'coinbase', name: 'Coinbase Wallet', address: accounts[0], icon: '🔵' };
      },
      downloadUrl: 'https://www.coinbase.com/wallet/download',
    },
    {
      id: 'rabby', label: 'Rabby', icon: '🐰', type: 'evm',
      detect: d => d.rabby,
      connect: async () => {
        const r = w.rabby || w.ethereum;
        if (!r) throw new Error('Rabby not found');
        const accounts: string[] = await r.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) throw new Error('No accounts');
        return { id: 'rabby', name: 'Rabby', address: accounts[0], icon: '🐰' };
      },
      downloadUrl: 'https://rabby.io/download',
    },
    {
      id: 'brave', label: 'Brave Wallet', icon: '🦁', type: 'evm',
      detect: d => d.brave,
      connect: async () => {
        if (!eth?.isBraveWallet) throw new Error('Brave Wallet not found');
        const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) throw new Error('No accounts');
        return { id: 'brave', name: 'Brave Wallet', address: accounts[0], icon: '🦁' };
      },
      downloadUrl: 'https://brave.com/wallet',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
interface Ctx {
  wallets: ConnectedWallet[];
  connecting: string | null;
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  connect: (id: string) => Promise<void>;
  disconnect: (id: string) => void;
  disconnectAll: () => void;
  isConnected: boolean;
  solanaWallet: ConnectedWallet | null;
  evmWallet: ConnectedWallet | null;
  toast: string | null;
  setToast: (t: string | null) => void;
}
const Ctx = createContext<Ctx>(null!);
export function useWallet() { return useContext(Ctx); }

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem('launchly_w');
      if (s) {
        const parsed: ConnectedWallet[] = JSON.parse(s);
        // Re-verify each wallet is still connected
        const defs = getWalletDefs();
        const verified: ConnectedWallet[] = [];
        for (const w of parsed) {
          const def = defs.find(d => d.id === w.id);
          if (def && def.detect(detectWallets())) {
            verified.push(w);
          }
        }
        setWallets(verified);
      }
    } catch {/**/}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('launchly_w', JSON.stringify(wallets));
  }, [wallets]);

  // Listen for EVM account/chain changes
  useEffect(() => {
    const eth = (getWin() as any).ethereum;
    if (!eth?.on) return;
    const onAccounts = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWallets(p => p.filter(w => {
          const def = getWalletDefs().find(d => d.id === w.id);
          return def?.type !== 'evm';
        }));
        setToast('🦊 EVM wallet disconnected');
      } else {
        setWallets(p => p.map(w => {
          const def = getWalletDefs().find(d => d.id === w.id);
          if (def?.type === 'evm') return { ...w, address: accounts[0] };
          return w;
        }));
      }
    };
    const onChain = (chainId: string) => {
      const CHAIN_NAMES: Record<string, string> = {
        '0x1': 'Ethereum', '0x2105': 'Base', '0x38': 'BNB Chain',
        '0xaa36a7': 'Sepolia', '0x14a34': 'Base Sepolia', '0x61': 'BSC Testnet',
      };
      setWallets(p => p.map(w => {
        const def = getWalletDefs().find(d => d.id === w.id);
        if (def?.type === 'evm') return { ...w, chain: CHAIN_NAMES[chainId] ?? `Chain ${parseInt(chainId, 16)}` };
        return w;
      }));
    };
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => {
      try { eth.removeListener('accountsChanged', onAccounts); eth.removeListener('chainChanged', onChain); } catch {/**/}
    };
  }, []);

  const connect = useCallback(async (id: string) => {
    const defs = getWalletDefs();
    const def = defs.find(d => d.id === id);
    if (!def) throw new Error(`Unknown wallet: ${id}`);

    setConnecting(id);
    try {
      const w = await def.connect();
      setWallets(prev => [...prev.filter(x => x.id !== w.id), w]);
      setToast(`${def.icon} ${def.label} connected!`);
      setModalOpen(false);
    } finally {
      setConnecting(null);
    }
  }, []);

  const disconnect = useCallback((id: string) => {
    const w = getWin() as any;
    // Try to disconnect from extension
    try {
      if (id === 'phantom' && w.solana?.disconnect) w.solana.disconnect();
      if (id === 'solflare' && w.solflare?.disconnect) w.solflare.disconnect();
    } catch {/**/}
    setWallets(prev => prev.filter(x => x.id !== id));
    setToast('Wallet disconnected');
  }, []);

  const disconnectAll = useCallback(() => {
    const w = getWin() as any;
    try { w.solana?.disconnect(); } catch {/**/}
    try { w.solflare?.disconnect(); } catch {/**/}
    setWallets([]);
    setToast('All wallets disconnected');
  }, []);

  const solanaWallet = wallets.find(w => {
    const def = getWalletDefs().find(d => d.id === w.id);
    return def?.type === 'solana';
  }) ?? null;
  const evmWallet = wallets.find(w => {
    const def = getWalletDefs().find(d => d.id === w.id);
    return def?.type === 'evm';
  }) ?? null;

  return (
    <Ctx.Provider value={{ wallets, connecting, modalOpen, setModalOpen, connect, disconnect, disconnectAll, isConnected: wallets.length > 0, solanaWallet, evmWallet, toast, setToast }}>
      {children}
      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] glass-card-premium rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2"
          style={{ color: 'var(--color-text-primary)', animation: 'modalIn 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          onClick={() => setToast(null)}
        >
          {toast}
        </div>
      )}
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Connect Button (navbar)                                            */
/* ------------------------------------------------------------------ */
export function WalletConnectButton() {
  const { modalOpen, setModalOpen, connecting, isConnected, solanaWallet, evmWallet } = useWallet();

  if (!isConnected) {
    return (
      <button className="btn-primary h-9 px-5 text-sm gap-2" onClick={() => setModalOpen(true)} disabled={connecting !== null} aria-label="Connect wallet">
        {connecting !== null ? (
          <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /><span>Connecting…</span></>
        ) : (
          <><span>🔗</span><span>Connect</span></>
        )}
      </button>
    );
  }

  return (
    <button className="btn-secondary h-9 px-4 text-sm flex items-center gap-2" onClick={() => setModalOpen(true)}>
      {solanaWallet && (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-primary)' }}>
          <span>{solanaWallet.icon}</span>
          <span className="hidden sm:inline">{solanaWallet.address.slice(0, 4)}…{solanaWallet.address.slice(-4)}</span>
        </span>
      )}
      {evmWallet && (
        <span className="flex items-center gap-1.5 text-xs" style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: 8 }}>
          <span>{evmWallet.icon}</span>
          <span className="hidden sm:inline">{evmWallet.address.slice(0, 4)}…{evmWallet.address.slice(-4)}</span>
        </span>
      )}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Connect Modal                                                      */
/* ------------------------------------------------------------------ */
export function ConnectModal() {
  const { modalOpen, setModalOpen, wallets, connecting, connect, disconnect } = useWallet();
  const [tab, setTab] = useState<'solana' | 'evm'>('solana');
  const [error, setError] = useState<string | null>(null);
  const [detected, setDetected] = useState<ReturnType<typeof detectWallets> | null>(null);

  // Detect wallets when modal opens
  useEffect(() => {
    if (modalOpen) {
      setDetected(detectWallets());
    } else {
      setError(null);
      setTab('solana');
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modalOpen, setModalOpen]);

  const doConnect = async (id: string) => {
    setError(null);
    try {
      await connect(id);
    } catch (e: any) {
      const msg = e?.message ?? 'Connection failed';
      // User rejected — no error shown
      if (msg.includes('rejected') || e?.code === 4001 || msg.includes('User rejected')) return;
      // Wallet not found — show download prompt
      if (msg.includes('not found')) {
        const defs = getWalletDefs();
        const def = defs.find(d => d.id === id);
        if (def) {
          window.open(def.downloadUrl, '_blank');
          setError(`${def.label} not detected. Opening download page...`);
          return;
        }
      }
      setError(msg);
    }
  };

  if (!modalOpen) return null;

  const defs = getWalletDefs();
  const solDefs = defs.filter(d => d.type === 'solana');
  const evmDefs = defs.filter(d => d.type === 'evm');
  const activeDefs = tab === 'solana' ? solDefs : evmDefs;
  const fmt = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Connect Wallet">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />

      <div
        className="glass-card-premium rounded-2xl w-full max-w-[460px] max-h-[85vh] overflow-hidden relative z-10"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Connect Wallet</h2>
          <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-3">
          {(['solana', 'evm'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(null); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'rgba(255,255,255,0.03)',
                color: tab === t ? 'white' : 'var(--color-text-secondary)',
                border: tab === t ? 'none' : '1px solid var(--color-border)',
              }}>
              {t === 'solana' ? '🌐 Solana' : '⛓️ EVM'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-3 rounded-xl px-4 py-2.5 text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Connected wallets */}
        {wallets.length > 0 && (
          <div className="px-6 pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Connected</div>
            {wallets.map(w => (
              <div key={w.id} className="glass-card rounded-xl p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{w.icon}</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {w.name}
                      {w.chain && <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--color-text-muted)' }}>{w.chain}</span>}
                    </div>
                    <div className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{fmt(w.address)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-live">Connected</span>
                  <button onClick={() => disconnect(w.id)} className="text-[11px] px-2 py-1 rounded-lg transition-colors" style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)' }}>Disconnect</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wallet list */}
        <div className="px-6 py-3 overflow-y-auto" style={{ maxHeight: '35vh' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {tab === 'solana' ? 'Solana Wallets' : 'EVM Wallets'}
          </div>
          <div className="space-y-2">
            {activeDefs.map(def => {
              const isInstalled = detected ? def.detect(detected) : false;
              const isConnected = wallets.some(w => w.id === def.id);
              const isBusy = connecting === def.id;

              return (
                <button
                  key={def.id}
                  onClick={() => {
                    if (isConnected || isBusy) return;
                    if (!isInstalled) {
                      window.open(def.downloadUrl, '_blank');
                      return;
                    }
                    doConnect(def.id);
                  }}
                  disabled={isBusy}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                  style={{
                    cursor: isConnected ? 'default' : 'pointer',
                    background: isConnected ? 'rgba(16,185,129,0.05)' : 'transparent',
                    border: isConnected ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--color-border)',
                    opacity: isBusy ? 0.6 : 1,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: isInstalled ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)' }}>
                    {def.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{def.label}</div>
                    <div className="text-[11px]" style={{ color: isInstalled ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {isInstalled
                        ? (isConnected ? 'Connected ✓' : 'Detected — click to connect')
                        : 'Not installed — click to download'}
                    </div>
                  </div>
                  {isBusy ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
                  ) : isConnected ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" className="shrink-0"><path d="m5 12 5 5L20 7" /></svg>
                  ) : !isInstalled ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" className="shrink-0"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-1">
          <div className="text-[11px] text-center" style={{ color: 'var(--color-text-muted)' }}>
            Make sure your wallet extension is <span style={{ color: 'var(--color-text-secondary)' }}>unlocked</span> & enabled.
          </div>
        </div>
      </div>
    </div>
  );
}
