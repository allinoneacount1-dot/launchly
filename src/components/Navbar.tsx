'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <span className="text-lg font-semibold gradient-text">Launch</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/launch" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Launch</Link>
          <Link href="/lobby" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Lobby</Link>
          <Link href="/dashboard" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</Link>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>X / Twitter</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary h-9 px-5 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
            Connect
          </button>
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
          <Link href="/dashboard" className="text-sm py-2" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
        </div>
      )}
    </nav>
  );
}
