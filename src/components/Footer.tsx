import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto glass-card rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <span className="text-lg font-semibold gradient-text">Launch</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ly</span>
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>© 2026 Launchly. All rights reserved.</div>
        <div className="flex gap-8">
          <Link href="/lobby" className="text-sm transition-colors hover:text-[var(--color-primary)]" style={{ color: 'var(--color-text-secondary)' }}>Lobby</Link>
          <Link href="/launch" className="text-sm transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-text-secondary)' }}>Launch</Link>
          <Link href="/dashboard" className="text-sm transition-colors hover:text-[var(--color-primary)]" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</Link>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>X / Twitter</a>
        </div>
      </div>
    </footer>
  );
}
