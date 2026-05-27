'use client';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 40, className = '', showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/launchly-logo.svg"
        alt="Launchly"
        width={size}
        height={size}
        className="rounded-lg"
        style={{ objectFit: 'contain' }}
      />
      {showText && (
        <>
          <span className="text-lg font-semibold gradient-text">Launch</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ly</span>
        </>
      )}
    </div>
  );
}
