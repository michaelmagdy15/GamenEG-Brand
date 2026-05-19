interface MarqueeTickerProps {
  speed?: 'slow' | 'normal' | 'fast';
  variant?: 'dark' | 'light';
}

const speeds = {
  slow: '45s',
  normal: '30s',
  fast: '18s',
};

/** One repeating unit of the ticker */
function TickerUnit({ textColor, variant }: { textColor: string, variant: 'dark' | 'light' }) {
  return (
    <>
      {/* Brand name */}
      <span className={`font-display text-[10px] sm:text-xs tracking-[0.3em] uppercase ${textColor} inline-flex items-center`}>
        G<span className="font-lambda">Λ</span>MÉN
      </span>

      <span className={`${textColor} mx-6 opacity-40`}>·</span>

      {/* French tagline */}
      <span translate="no" className={`notranslate font-french italic text-sm sm:text-base tracking-[0.15em] ${variant === 'dark' ? 'text-champagne-gold/90' : 'text-deep-walnut/90'} inline-block`}>
        L'élégance taillée en bois.
      </span>

      <span className={`${textColor} mx-6 opacity-40`}>·</span>

      {/* Origin */}
      <span className={`font-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase ${textColor} inline-block`}>
        H<span className="font-lambda">Λ</span>NDCR<span className="font-lambda">Λ</span>FTED IN EGYPT
      </span>

      <span className={`${textColor} mx-6 opacity-40`}>·</span>
    </>
  );
}

export default function MarqueeTicker({
  speed = 'normal',
  variant = 'dark',
}: MarqueeTickerProps) {
  const bg = variant === 'dark' ? 'bg-espresso' : 'bg-warm-cream';
  const textColor =
    variant === 'dark' ? 'text-champagne-gold/25' : 'text-deep-walnut/20';

  // Repeat enough units for a seamless loop
  const units = Array.from({ length: 6 });

  return (
    <div className={`${bg} overflow-hidden py-5 select-none grain-overlay`}>
      <div
        className="animate-marquee whitespace-nowrap flex items-center"
        style={{ animationDuration: speeds[speed] }}
      >
        {units.map((_, i) => (
          <TickerUnit key={i} textColor={textColor} variant={variant} />
        ))}
      </div>
    </div>
  );
}

