'use client';

import { useState } from 'react';
import { SolanaLogo, EthereumLogo, BaseLogo, BnbLogo } from '@/components/ChainLogos';

const STEPS = [
  {
    num: '01',
    title: 'Connect Your Wallet',
    subtitle: 'One wallet to rule them all',
    desc: 'Connect any Solana wallet (Phantom, Solflare, etc.) — that\'s all you need. Launchly\'s built-in bridge handles the rest across EVM chains. No MetaMask required, though you can connect it too for convenience.',
    icon: '🔗',
    details: [
      'Supports Phantom, Solflare, Backpack, and more',
      'WalletConnect for mobile users',
      'Optional MetaMask for EVM chain management',
      'One signature to authorize all chains',
    ],
  },
  {
    num: '02',
    title: 'Fill Your Token Details',
    subtitle: 'Deploy everywhere with one form',
    desc: 'Enter your token name, ticker, supply, decimals, and optional metadata (logo, website, socials). Launchly auto-generates verified, audited smart contracts for each chain — SPL for Solana, ERC-20 for Ethereum/Base, BEP-20 for BNB.',
    icon: '📝',
    details: [
      'Token name, symbol, and total supply',
      'Configurable decimals (default: 9)',
      'Logo upload (IPFS auto-pinned)',
      'Optional: website, Twitter, Telegram links',
    ],
  },
  {
    num: '03',
    title: 'Select Your Chains',
    subtitle: 'Pick your battlefield',
    desc: 'Choose any combination of Solana, Ethereum, Base, and BNB Chain. Solana is always included as your home base — add EVM chains as needed. Each chain gets its own deployed contract with the same token identity.',
    icon: '⛓️',
    details: [
      { name: 'Solana', tag: 'Home Base', color: '#9945FF', logo: <SolanaLogo size={18} />, desc: 'Lightning-fast SPL tokens with near-zero fees. Your home base chain.' },
      { name: 'Ethereum', tag: 'L1', color: '#627EEA', logo: <EthereumLogo size={11} />, desc: 'Maximum credibility and liquidity. ERC-20 standard.' },
      { name: 'Base', tag: 'L2', color: '#0052FF', logo: <BaseLogo size={18} />, desc: 'Coinbase\'s L2 — retail-friendly with growing DeFi.' },
      { name: 'BNB Chain', tag: 'L1', color: '#F0B90B', logo: <BnbLogo size={18} />, desc: 'Massive user base. BEP-20 standard with PancakeSwap ready.' },
    ],
  },
  {
    num: '04',
    title: 'Privacy Mixer Activates',
    subtitle: 'Cover your gas, hide your trail',
    desc: 'Here\'s the magic: instead of buying ETH/BNB for gas on each EVM chain, our built-in privacy mixer converts a small amount of your SOL and routes it to cover gas fees on all selected EVM chains. Your launch origin stays private.',
    icon: '🔒',
    details: [
      'No need to hold ETH, BNB, or BASE tokens',
      'SOL → gas conversion happens automatically',
      'Mixer obscures cross-chain payment origin',
      'Typically costs ~0.001 SOL total per EVM chain',
    ],
  },
  {
    num: '05',
    title: 'Review & Launch',
    subtitle: 'One click. Every chain.',
    desc: 'Review your token details, selected chains, and total cost. Hit Launch and watch the magic happen — contracts deploy simultaneously across all chosen chains. Solana confirms in ~2s, EVM chains in 15-30s each.',
    icon: '🚀',
    details: [
      'Side-by-side review of all deployments',
      'Real-time progress tracking per chain',
      'Transaction hash links for each chain',
      'Auto-redirect to Dashboard after completion',
    ],
  },
  {
    num: '06',
    title: 'Track & Manage',
    subtitle: 'One dashboard, all chains',
    desc: 'Your unified Dashboard shows holder counts, liquidity pools, and transaction history across every chain. Manage liquidity, transfer ownership, or launch another token — all from one place.',
    icon: '📊',
    details: [
      'Real-time holder tracking per chain',
      'Liquidity pool monitoring on all DEXs',
      'One-click liquidity addition',
      'Cross-chain transfer ownership tools',
    ],
  },
];

const ARCHITECTURE = [
  { from: 'User Wallet (SOL)', to: 'Launchly Protocol', label: 'Token metadata + SOL for gas' },
  { from: 'Launchly Protocol', to: 'Solana Program', label: 'SPL Token creation + LP seed' },
  { from: 'Launchly Protocol', to: 'EVM Router Contracts', label: 'ERC-20/BEP-20 deploy requests' },
  { from: 'Privacy Mixer', to: 'EVM Gas Relayers', label: 'Converted SOL → gas on each chain' },
  { from: 'EVM Router Contracts', to: 'DEX Pools', label: 'Auto-LP creation post-deploy' },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredArch, setHoveredArch] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-6 py-12 bg-grid">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <img src="/launchly-logo.svg" alt="Launchly" className="mx-auto mb-6 rounded-2xl" style={{ width: 72, height: 72, objectFit: 'contain' }} />
          <div className="section-label">How It Works</div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            From <span className="gradient-text">Zero</span> to <span className="gradient-text">Every Chain</span>
          </h1>
          <p className="text-base max-w-[600px] mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Understand the magic behind multi-chain token launches. No ETH required — just SOL and a click.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="glass-card-premium rounded-2xl p-8 mb-16">
          <h2 className="text-lg font-medium text-center mb-8" style={{ color: 'var(--color-text-primary)' }}>System Architecture</h2>
          <div className="flex flex-col items-center gap-3">
            {ARCHITECTURE.map((step, i) => (
              <div key={i} className="w-full max-w-[700px]">
                <div
                  className="flex items-center gap-4 rounded-xl p-4 transition-all duration-300 cursor-default"
                  style={{
                    background: hoveredArch === i ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                    border: hoveredArch === i ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                  }}
                  onMouseEnter={() => setHoveredArch(i)}
                  onMouseLeave={() => setHoveredArch(null)}
                >
                  <div className="glass-card-premium rounded-lg px-3 py-2 text-xs font-mono min-w-[140px] text-center shrink-0" style={{ color: 'var(--color-primary-light)', background: 'rgba(139, 92, 246, 0.06)' }}>
                    {step.from}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
                    <div className="text-xs text-center px-3 py-1 rounded-full" style={{ color: 'var(--color-text-muted)', background: 'rgba(6, 182, 212, 0.06)' }}>
                      {step.label}
                    </div>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))' }} />
                  </div>
                  <div className="glass-card-premium rounded-lg px-3 py-2 text-xs font-mono min-w-[140px] text-center shrink-0" style={{ color: 'var(--color-accent)', background: 'rgba(6, 182, 212, 0.06)' }}>
                    {step.to}
                  </div>
                </div>
                {i < ARCHITECTURE.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step */}
        <div className="mb-16">
          <h2 className="text-xl font-medium text-center mb-10" style={{ color: 'var(--color-text-primary)' }}>Step-by-Step Process</h2>

          {/* Step tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${activeStep === i ? '' : 'glass-card opacity-60 hover:opacity-100'}`}
                style={{
                  background: activeStep === i ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : undefined,
                  color: activeStep === i ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.num}. {s.title}</span>
                <span className="sm:hidden">{s.num}</span>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div className="glass-card-premium rounded-2xl p-8 md:p-10" key={activeStep}>
            <div className="flex items-start gap-6 mb-6">
              <div className="text-4xl">{STEPS[activeStep].icon}</div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-primary-light)' }}>
                  Step {STEPS[activeStep].num} of 06
                </div>
                <h3 className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {STEPS[activeStep].title}
                </h3>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {STEPS[activeStep].subtitle}
                </div>
              </div>
            </div>

            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {STEPS[activeStep].desc}
            </p>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {STEPS[activeStep].details.map((detail: any, i: number) => (
                <div key={i} className="flex items-start gap-3 glass-card rounded-xl p-4">
                  {typeof detail === 'string' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{detail}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: detail.color + '15' }}>
                        {detail.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{detail.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: detail.color + '15', color: detail.color }}>{detail.tag}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{detail.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                className="btn-secondary h-10 px-5 text-sm"
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? 0.3 : 1 }}
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                {STEPS.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: i === activeStep ? 'var(--color-primary)' : 'var(--color-border)', width: i === activeStep ? 20 : 8 }} />
                ))}
              </div>
              <button
                onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))}
                className="btn-primary h-10 px-5 text-sm"
                disabled={activeStep === STEPS.length - 1}
                style={{ opacity: activeStep === STEPS.length - 1 ? 0.3 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Mixer Deep Dive */}
        <div className="glass-card-premium rounded-2xl p-8 md:p-10 mb-16" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(6, 182, 212, 0.04))' }}>
          <div className="text-center mb-10">
            <div className="section-label">Privacy Mixer</div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              How the <span className="gradient-text">Privacy Mixer</span> Works
            </h2>
            <p className="text-sm max-w-[500px] mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              The secret sauce that makes multi-chain launches possible with just SOL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 'A',
                title: 'You Pay in SOL',
                desc: 'When you launch, Launchly calculates the total gas needed for all EVM chains. You pay once in SOL — no need to swap or buy ETH/BNB yourself.',
                icon: '💰',
              },
              {
                step: 'B',
                title: 'Mixer Converts & Routes',
                desc: 'Our privacy mixer receives your SOL, converts it to native gas tokens (ETH, BNB, etc.) via decentralized DEXs, and routes each gas amount to the respective chain\'s relayer.',
                icon: '🔄',
              },
              {
                step: 'C',
                title: 'Gas-Free EVM Deploy',
                desc: 'The relayer contract on each EVM chain pays the gas for your token deployment. The link between your wallet and the EVM deployment is broken — privacy preserved.',
                icon: '🛡️',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  {item.icon}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-3" style={{ background: 'var(--color-primary)', color: 'white' }}>
                  {item.step}
                </div>
                <h3 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Chains Detail */}
        <div className="glass-card-premium rounded-2xl p-8 md:p-10 mb-16">
          <div className="text-center mb-10">
            <div className="section-label">Supported Chains</div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Launch Everywhere That Matters</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Each chain deploys a native token standard with verified contracts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Solana', standard: 'SPL Token', color: '#9945FF', logo: <SolanaLogo size={28} />, bg: 'rgba(153, 69, 255, 0.08)', features: ['Near-zero fees (~0.0005 SOL)', '2s confirmation', 'Raydium/Orca LP ready', 'Home base — always included'] },
              { name: 'Ethereum', standard: 'ERC-20', color: '#627EEA', logo: <EthereumLogo size={17} />, bg: 'rgba(98, 126, 234, 0.08)', features: ['Maximum liquidity', 'Uniswap V3 LP ready', 'Audited contracts', 'Gas covered by mixer'] },
              { name: 'Base', standard: 'ERC-20', color: '#0052FF', logo: <BaseLogo size={28} />, bg: 'rgba(0, 82, 255, 0.08)', features: ['Coinbase L2 ecosystem', 'Aerodrome LP ready', 'Low fees, fast finality', 'Gas covered by mixer'] },
              { name: 'BNB Chain', standard: 'BEP-20', color: '#F0B90B', logo: <BnbLogo size={28} />, bg: 'rgba(240, 185, 11, 0.08)', features: ['Millions of users', 'PancakeSwap LP ready', 'Ultra-low fees', 'Gas covered by mixer'] },
            ].map((chain, i) => (
              <div key={i} className="glass-card-premium rounded-2xl p-6 flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: chain.bg }}>
                  {chain.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>{chain.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: chain.color + '15', color: chain.color }}>{chain.standard}</span>
                  </div>
                  <ul className="space-y-1.5 mt-3">
                    {chain.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: chain.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ expanded */}
        <div className="glass-card-premium rounded-2xl p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="section-label">FAQ</div>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Got Questions?</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How much does it cost?', a: 'You only pay in SOL. Typically ~0.001 SOL per launch as a base fee, plus ~0.0005 SOL per EVM chain for gas coverage via the privacy mixer. No hidden fees.' },
              { q: 'Is my token contract renounced?', a: 'Yes. All deployed contracts are immutable and ownership-renounced by default. You retain mint authority on Solana (configurable).' },
              { q: 'Can I add liquidity after launch?', a: 'Absolutely. From your Dashboard, you can add liquidity to any supported DEX on each chain with one click. Or do it manually — your contract is standard.' },
              { q: 'What if deployment fails on one chain?', a: 'Each chain deploys independently. If one fails, the others continue. You can retry failed chains from the Dashboard without re-launching the whole thing.' },
              { q: 'Are the contracts audited?', a: 'Yes. All base contracts (SPL, ERC-20, BEP-20) are standard, verified, and audited templates. You can verify the source on any block explorer.' },
              { q: 'Can I launch a token with a tax/fee?', a: 'Custom tokenomics (tax, reflection, etc.) are coming in V2. For now, Launchly supports standard fee-free tokens. The infrastructure is ready for custom modules.' },
              { q: 'How is privacy maintained?', a: 'Our privacy mixer uses a DEX swap + relayer pattern. SOL is converted to native gas tokens and sent to relayer contracts. The original wallet address never appears on EVM chains.' },
            ].map((faq, i) => (
              <FaqDetail key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ready to Launch?</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>Your token. Every chain. One click.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/launch" className="btn-primary h-12 px-10 text-base">🚀 Start Your Launch</a>
            <a href="/lobby" className="btn-secondary h-12 px-10 text-base">👀 View Live Launches</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqDetail({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: open ? 'rgba(139, 92, 246, 0.04)' : 'transparent', border: '1px solid', borderColor: open ? 'rgba(139, 92, 246, 0.15)' : 'var(--color-border)' }}>
      <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-sm font-medium pr-4" style={{ color: 'var(--color-text-primary)' }}>{question}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0 }}>
        <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{answer}</div>
      </div>
    </div>
  );
}
