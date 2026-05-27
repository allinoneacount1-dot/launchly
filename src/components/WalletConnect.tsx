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

function isPhantom() {
  const w = getWin() as any;
  return !!w.solana?.isPhantom && !w.solana?.isGlow;
}
function isSolflare() {
  const w = getWin() as any;
  return !!w.solflare?.isSolflare;
}
function isMetaMask() {
  const w = getWin() as any;
  return !!w.ethereum?.isMetaMask && !w.ethereum?.isBraveWallet;
}
function getEthereum(): any {
  const w = getWin() as any;
  return w.ethereum ?? null;
}

const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Ethereum', '0x2a': 'Base', '0x38': 'BNB Chain',
  '0xa4b1': 'Arbitrum', '0x89': 'Polygon', '0xa': 'Optimism',
};

/* ------------------------------------------------------------------ */
/*  Connection functions                                               */
/* ------------------------------------------------------------------ */
async function connectPhantom(): Promise<ConnectedWallet> {
  const sol = (getWin() as any).solana;
  if (!sol?.isPhantom) throw new Error('Phantom extension not found');
  const r = await sol.connect();
  return { id: 'solana-phantom', name: 'Phantom', address: r.publicKey.toString(), icon: '👻' };
}

async function connectSolflare(): Promise<ConnectedWallet> {
  const s = (getWin() as any).solflare;
  if (!s?.isSolflare) throw new Error('Solflare extension not found');
  if (!s.connected) await s.connect();
  return { id: 'solana-solflare', name: 'Solflare', address: s.publicKey.toString(), icon: '☀️' };
}

async function connectMetaMask(): Promise<ConnectedWallet> {
  const eth = getEthereum();
  if (!eth) throw new Error('No EVM wallet found');
  const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
  const chainId: string = await eth.request({ method: 'eth_chainId' });
  if (!accounts.length) throw new Error('No accounts returned');
  return {
    id: 'evm-metamask', name: 'MetaMask', address: accounts[0], icon: '🦊',
    chain: CHAIN_NAMES[chainId] ?? undefined,
  };
}

async function connectAnyEvm(): Promise<ConnectedWallet> {
  const eth = getEthereum();
  if (!eth) throw new Error('No EVM wallet found');
  const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
  const chainId: string = await eth.request({ method: 'eth_chainId' });
  if (!accounts.length) throw new Error('No accounts returned');

  const win = getWin() as any;
  let name = 'EVM Wallet';
  let icon = '💳';
  if (eth.isBraveWallet) { name = 'Brave Wallet'; icon = '🦁'; }
  else if (win.rabby) { name = 'Rabby'; icon = '🐰'; }
  else if (eth.isCoinbaseWallet) { name = 'Coinbase Wallet'; icon = '🔵'; }
  else if (eth.isTrust) { name = 'Trust Wallet'; icon = '🛡️'; }
  else if (eth.isMetaMask) { name = 'MetaMask'; icon = '🦊'; }

  return {
    id: 'evm-generic', name, address: accounts[0], icon,
    chain: CHAIN_NAMES[chainId] ?? undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Wallet meta                                                        */
/* ------------------------------------------------------------------ */
const SOL_IDS = ['phantom', 'solflare', 'backpack', 'glow'] as const;
const EVM_IDS = ['metamask', 'brave', 'coinbase-evm', 'trust-evm', 'rabby'] as const;

const WALLET_META: Record<string, { label: string; icon: string }> = {
  phantom:        { label: 'Phantom',          icon: '👻' },
  solflare:       { label: 'Solflare',         icon: '☀️' },
  backpack:       { label: 'Backpack',         icon: '🎒' },
  glow:           { label: 'Glow',             icon: '✨' },
  metamask:       { label: 'MetaMask',         icon: '🦊' },
  brave:          { label: 'Brave Wallet',     icon: '🦁' },
  'coinbase-evm': { label: 'Coinbase Wallet',  icon: '🔵' },
  'trust-evm':    { label: 'Trust Wallet',     icon: '🛡️' },
  rabby:          { label: 'Rabby',            icon: '🐰' },
};

function detectInstalled(id: string): boolean {
  if (id === 'phantom') return isPhantom();
  if (id === 'solflare') return isSolflare();
  if (id === 'metamask') return isMetaMask();
  if (id === 'brave') return !!(getEthereum()?.isBraveWallet);
  if (id === 'rabby') return !!(getWin() as any).rabby;
  if (id === 'coinbase-evm') return !!(getEthereum()?.isCoinbaseWallet);
  if (id === 'trust-evm') return !!(getEthereum()?.isTrust);
  if (id === 'backpack') return !!(getWin() as any).backpack?.isBackpack;
  if (id === 'glow') return !!(getWin() as any).solana?.isGlow;
  return false;
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
}
const Ctx = createContext<Ctx>(null!);
export function useWallet() { return useContext(Ctx); }

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem('launchly_w'); if (s) setWallets(JSON.parse(s)); } catch {/**/}
  }, []);
  useEffect(() => { localStorage.setItem('launchly_w', JSON.stringify(wallets)); }, [wallets]);

  // Listen for account/chain changes
  useEffect(() => {
    const eth = getEthereum();
    if (!eth?.on) return;
    const onAccounts = (a: string[]) => { if (a.length === 0) setWallets(p => p.filter(w => !w.id.startsWith('evm-'))); };
    const onChain = () => setWallets(p => [...p]); // trigger re-render
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => { try { eth.removeListener('accountsChanged', onAccounts); eth.removeListener('chainChanged', onChain); } catch {/**/} };
  }, []);

  const connect = useCallback(async (id: string) => {
    setConnecting(id);
    let w: ConnectedWallet;
    try {
      if (id === 'phantom') w = await connectPhantom();
      else if (id === 'solflare') w = await connectSolflare();
      else if (id === 'metamask') w = await connectMetaMask();
      else w = await connectAnyEvm();

      setWallets(prev => [...prev.filter(x => x.id !== w.id), w]);
    } finally {
      setConnecting(null);
    }
  }, []);

  const disconnect = useCallback((id: string) => {
    // Also disconnect from the actual wallet extension
    const win = getWin() as any;
    if (id === 'solana-phantom' && win.solana?.disconnect) { try { win.solana.disconnect(); } catch {/**/} }
    if (id === 'solana-solflare' && win.solflare?.disconnect) { try { win.solflare.disconnect(); } catch {/**/} }
    setWallets(prev => prev.filter(x => x.id !== id));
  }, []);

  const disconnectAll = useCallback(() => {
    disconnect('solana-phantom');
    disconnect('solana-solflare');
    disconnect('evm-metamask');
    disconnect('evm-generic');
  }, [disconnect]);

  const solanaWallet = wallets.find(w => w.id.startsWith('solana-')) ?? null;
  const evmWallet = wallets.find(w => w.id.startsWith('evm-')) ?? null;

  return (
    <Ctx.Provider value={{ wallets, connecting, modalOpen, setModalOpen, connect, disconnect, disconnectAll, isConnected: wallets.length > 0, solanaWallet, evmWallet }}>
      {children}
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
      <button className="btn-primary h-9 px-5 text-sm gap-2" onClick={() => setModalOpen(true)} disabled={connecting !== null}>
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

  useEffect(() => { if (!modalOpen) { setError(null); setTab('solana'); } }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modalOpen, setModalOpen]);

  const doConnect = async (id: string) => {
    setError(null);
    try { await connect(id); }
    catch (e: any) {
      if (e?.message?.includes('rejected') || e?.code === 4001) return; // user cancelled — no error
      setError(e?.message ?? 'Connection failed');
    }
  };

  const installedMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    [...SOL_IDS, ...EVM_IDS].forEach(id => { m[id] = detectInstalled(id); });
    return m;
  }, [modalOpen]);

  if (!modalOpen) return null;

  const ids = tab === 'solana' ? SOL_IDS : EVM_IDS;
  const fmt = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />

      <div
        className="glass-card-premium rounded-2xl w-full max-w-[460px] max-h-[85vh] overflow-hidden relative z-10"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Connect Wallet</h2>
          <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
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

        {/* Connected list */}
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
            {ids.map(id => {
              const meta = WALLET_META[id];
              const installed = installedMap[id];
              const active = wallets.find(w => w.id.includes(id));
              const busy = connecting === id;

              return (
                <button key={id} onClick={() => !active && !busy && doConnect(id)}
                  disabled={busy}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                  style={{
                    background: active ? 'rgba(16,185,129,0.05)' : 'transparent',
                    border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--color-border)',
                    opacity: busy ? 0.6 : 1,
                  }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: installed ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)' }}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{meta.label}</div>
                    <div className="text-[11px]" style={{ color: installed ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {installed ? 'Installed — click to connect' : 'Not installed — click for download link'}
                    </div>
                  </div>
                  {busy ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
                  ) : active ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" className="shrink-0"><path d="m5 12 5 5L20 7" /></svg>
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
