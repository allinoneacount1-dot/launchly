'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WalletConnectButton, ConnectModal } from './WalletConnect';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img src="/launchly-logo.svg" alt="Launchly" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-semibold gradient-text">Launch</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/launch" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Launch</Link>
          <Link href="/lobby" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Lobby</Link>
          <Link href="/how-it-works" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>How It Works</Link>
          <Link href="/dashboard" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</Link>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>X</a>
        </div>

        <div className="flex items-center gap-3">
          <WalletConnectButton />
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/launch" className="text-sm py-2" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setMobileOpen(false)}>Launch</Link>
          <Link href="/lobby" className="text-sm py-2" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setMobileOpen(false)}>Lobby</Link>
          <Link href="/how-it-works" className="text-sm py-2" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/dashboard" className="text-sm py-2" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
        </div>
      )}

      <ConnectModal />
    </nav>
  );
}
