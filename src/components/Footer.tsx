import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto glass-card rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2.5">
          <img src="/launchly-logo.svg" alt="Launchly" className="h-9 w-auto rounded-lg" style={{ objectFit: 'contain', maxHeight: 36 }} />
          <span className="text-lg font-semibold gradient-text">Launch</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ly</span>
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>© 2026 Launchly. All rights reserved.</div>
        <div className="flex gap-8">
          <Link href="/how-it-works" className="text-sm transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-text-secondary)' }}>How It Works</Link>
          <Link href="/launch" className="text-sm transition-colors hover:text-[var(--color-primary)]" style={{ color: 'var(--color-text-secondary)' }}>Launch</Link>
          <Link href="/dashboard" className="text-sm transition-colors hover:text-[var(--color-primary)]" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</Link>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>X / Twitter</a>
        </div>
      </div>
    </footer>
  );
}
