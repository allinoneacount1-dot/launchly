export function SolanaLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 397.7 311.7" width={size} height={size}>
      <defs>
        <linearGradient id="sol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path fill="url(#sol-grad)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
      <path fill="url(#sol-grad)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
      <path fill="url(#sol-grad)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
    </svg>
  );
}

export function EthereumLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 256 417" width={size} height={size * 1.63}>
      <path fill="#627EEA" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
      <path fill="#8C9FEA" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
      <path fill="#627EEA" d="M127.961 312.187l-1.575 1.92V414.45l1.575 4.6L256 236.587z" />
      <path fill="#8C9FEA" d="M127.962 419.05V312.187L0 236.587z" />
    </svg>
  );
}

export function BaseLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 111 111" width={size} height={size}>
      <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
      <path d="M55.5 91.5c19.882 0 36-16.118 36-36s-16.118-36-36-36c-18.128 0-33.11 13.4-35.67 30.84h47.34v10.32H19.83C22.39 78.1 37.372 91.5 55.5 91.5z" fill="white" />
    </svg>
  );
}

export function BnbLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path fill="#F0B90B" d="M16 0l4 4-8 8-4-4zm8 8l4 4-12 12-4-4zm-16 0l4 4-4 4-4-4zm8 8l4 4-4 4-4-4z" />
      <path fill="#F0B90B" d="M16 4l6.928 6.928L16 17.856 9.072 10.928z" />
      <rect x="4" y="12" width="8" height="8" fill="#F0B90B" rx="1" transform="rotate(45 8 16)" />
      <rect x="20" y="12" width="8" height="8" fill="#F0B90B" rx="1" transform="rotate(45 24 16)" />
      <rect x="12" y="20" width="8" height="8" fill="#F0B90B" rx="1" transform="rotate(45 16 24)" />
      <rect x="12" y="4" width="8" height="8" fill="#F0B90B" rx="1" transform="rotate(45 16 8)" />
      <rect x="12" y="12" width="8" height="8" fill="#F0B90B" rx="1" transform="rotate(45 16 16)" />
    </svg>
  );
}
