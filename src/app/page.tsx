'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => setOpen(!open)}>
        <span className="text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>{question}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}>
        <div className="px-6 pb-6 text-sm leading-relaxed border-t pt-4" style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>{answer}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glow orbs */}
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--color-primary)', top: '-10%', left: '-5%', opacity: 0.08 + scrollY * 0.0001 }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: 'var(--color-accent)', bottom: '-5%', right: '-3%', opacity: 0.06 }} />

        <div className="max-w-[740px] mx-auto">
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.06))' }} />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }} />
              <span className="gradient-text">CA — To be announced</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {['Launch', 'Your', 'Token', 'on'].map((w, i) => (
                <span key={i} className="word-reveal inline-block mr-[0.3em]" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>{w}</span>
              ))}
              <br />
              {['Every', 'Chain.', 'Instantly.'].map((w, i) => (
                <span key={i} className="word-reveal inline-block mr-[0.3em] gradient-text" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>{w}</span>
              ))}
            </h1>

            <p className="text-base leading-relaxed mb-10 max-w-[540px] mx-auto" style={{ color: 'var(--color-text-secondary)', animation: 'wordReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards', opacity: 0 }}>
              Launchly is the first multi-chain token launchpad powered by a built-in privacy mixer. Deploy to Solana, Ethereum, Base, and BNB Chain with one click — no ETH required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" style={{ animation: 'wordReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards', opacity: 0 }}>
              <Link href="/launch" className="btn-primary w-full sm:w-auto h-12 px-8 text-base">Launch Your Token</Link>
              <Link href="/lobby" className="btn-secondary w-full sm:w-auto h-12 px-8 text-base">View Lobby</Link>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)', animation: 'wordReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards', opacity: 0 }}>
              <span>Single launchpad per launch</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>Live launch lobby</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>4 supported chains</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll text */}
      <section className="relative py-24 px-6" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-2xl md:text-4xl font-medium leading-relaxed tracking-tight flex flex-wrap justify-center gap-x-2 gap-y-1" style={{ color: 'var(--color-text-primary)' }}>
            {['Launchly', 'is', 'the', 'first', 'multi-chain', 'token', 'launchpad', 'with', 'a', 'built-in', 'privacy', 'mixer.', 'Deploy', 'your', 'token', 'to', 'Solana,', 'Ethereum,', 'Base,', 'and', 'BNB', 'Chain', 'simultaneously', '—', 'using', 'only', 'a', 'Solana', 'wallet.', 'No', 'ETH', 'needed.'].map((w, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <span className="inline-block" style={{ color: 'var(--color-text-primary)' }}>{w}</span>
              </ScrollReveal>
            ))}
          </p>
        </div>
      </section>

      {/* Why Launchly */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-16">
            <div className="section-label">Why Launchly</div>
            <h2 className="text-3xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Everything You Need to Go Multi-Chain</h2>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Built for founders who want reach without complexity.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚡', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', title: 'True One-Click Multi-Chain', desc: 'Deploy your token to up to 5 chains at once. No switching wallets, no separate transactions.' },
              { icon: '🌐', color: '#627EEA', bg: 'rgba(98, 126, 234, 0.1)', title: 'No ETH? No Problem.', desc: 'Our built-in privacy mixer covers EVM gas fees using Solana — the only wallet you need.' },
              { icon: '📊', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)', title: 'Unified Dashboard', desc: 'Track your token\'s performance, liquidity, and holders across every chain from one place.' },
              { icon: '🔒', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', title: 'Built-In Privacy Mixer', desc: 'Our privacy layer obscures cross-chain gas payments, keeping your launch strategy confidential.' },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-2xl" style={{ background: f.bg }}>{f.icon}</div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-16">
            <div className="section-label">The Process</div>
            <h2 className="text-3xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>From Idea to Every Chain in 3 Steps</h2>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>No multi-wallet juggling. No separate deployments. Just fill, connect, and launch.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Fill In Your Token Details', desc: 'Enter your token name, symbol, supply, logo, and description once. Launchly handles the rest.' },
              { num: '02', title: 'Select Your Chains', desc: 'Choose any combination of Solana, Ethereum, Base, and BNB Chain. Launch to one or all four.' },
              { num: '03', title: 'Connect & Launch', desc: 'Connect your Solana wallet and hit launch. Our mixer funds the gas on every EVM chain for you.' },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="glass-card rounded-2xl p-8 h-full" style={{ background: `linear-gradient(135deg, ${i === 0 ? 'rgba(139,92,246,0.06)' : i === 1 ? 'rgba(6,182,212,0.06)' : 'rgba(245,158,11,0.06)'}, transparent)` }}>
                  <div className="text-2xl font-medium gradient-text mb-4">{s.num}</div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features + Dashboard Preview */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8">
              <div className="section-label">Features</div>
              <h2 className="text-3xl font-medium mb-6" style={{ color: 'var(--color-text-primary)' }}>Powerful tools for multi-chain launches</h2>
              <div className="space-y-6">
                {[
                  { title: 'Solana + EVM Wallet Connect', desc: 'Seamlessly connect Phantom, Solflare, MetaMask, or WalletConnect.' },
                  { title: 'Instant Liquidity Pool Setup', desc: 'Automatically create liquidity pools on leading DEXs at launch.' },
                  { title: 'Smart Chain Routing', desc: 'Route deployments to optimal RPC endpoints for fastest confirmation.' },
                  { title: 'Enterprise Reliability', desc: '99.9% uptime with redundant infrastructure across every chain.' },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Launch Dashboard</span>
                </div>
                <span className="status-live">Ready</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Solana Deploy', color: '#9945FF', status: 'Confirmed', time: '2s ago' },
                  { name: 'Ethereum Deploy', color: '#627EEA', status: 'Confirmed', time: '15s ago' },
                  { name: 'Base Deploy', color: '#0052FF', status: 'Confirmed', time: '18s ago' },
                ].map((d, i) => (
                  <div key={i} className="glass-card rounded-xl flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{d.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{ color: d.color }}>{d.status}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Chains: 4</span>
                <Link href="/dashboard" className="gradient-text text-sm font-medium hover:underline">View Details →</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-16">
            <div className="section-label">Multi-Chain</div>
            <h2 className="text-3xl font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Launch Everywhere That Matters</h2>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Launchly supports the fastest-growing chains in Web3 today.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Solana', type: 'L1', desc: 'Lightning-fast, ultra-low fees. Your home base.', logo: <SolanaLogo size={24} />, bg: 'rgba(153, 69, 255, 0.1)', color: '#9945FF' },
              { name: 'Ethereum', type: 'L1', desc: 'The original. Maximum credibility and reach.', logo: <EthereumLogo size={15} />, bg: 'rgba(98, 126, 234, 0.1)', color: '#627EEA' },
              { name: 'Base', type: 'L2', desc: 'Coinbase\'s L2. Retail-friendly and growing fast.', logo: <BaseLogo size={24} />, bg: 'rgba(0, 82, 255, 0.1)', color: '#0052FF' },
              { name: 'BNB Chain', type: 'L1', desc: 'Massive DeFi ecosystem. Millions of users.', logo: <BnbLogo size={24} />, bg: 'rgba(240, 185, 11, 0.1)', color: '#F0B90B' },
            ].map((c, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 flex items-start gap-4 h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.color }}>
                    {c.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.name}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{c.type}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{c.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal className="text-center mb-16">
            <div className="section-label">FAQ</div>
            <h2 className="text-3xl font-medium" style={{ color: 'var(--color-text-primary)' }}>Common Questions</h2>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              { q: 'Do I need ETH to launch on Ethereum or Base?', a: 'No. Launchly\'s built-in privacy mixer handles EVM gas fees on your behalf. You only need a Solana wallet and SOL to get started.' },
              { q: 'Which wallets are supported?', a: 'We support Phantom, Solflare, MetaMask, and WalletConnect. Launchly bridges both Solana and EVM ecosystems for you.' },
              { q: 'Can I choose which chains to launch on?', a: 'Absolutely. Choose any combination of Solana, Ethereum, Base, and BNB Chain. Launch to one or all four simultaneously.' },
              { q: 'How long does a multi-chain launch take?', a: 'Typically under 60 seconds for all chains. Solana confirms in ~2 seconds, EVM chains in 15-30 seconds each.' },
              { q: 'Is my launch data private?', a: 'Yes. Our built-in privacy mixer obscures the origin of cross-chain gas payments, keeping your launch strategy confidential.' },
              { q: 'What token standards do you support?', a: 'SPL tokens on Solana, ERC-20 on Ethereum/Base, and BEP-20 on BNB Chain. All deployed with verified, audited contracts.' },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <FaqItem question={faq.q} answer={faq.a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-10 md:p-14 text-center">
              <h2 className="text-3xl font-medium mb-6" style={{ color: 'var(--color-text-primary)' }}>Your Token. Every Chain. Right Now.</h2>
              <p className="text-base leading-relaxed mb-10 max-w-[540px] mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Stop choosing between ecosystems. Launchly puts your token everywhere it needs to be — in one click.
              </p>
              <Link href="/launch" className="btn-primary h-12 px-10 text-base">Start Your Launch</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
