interface MarqueeTickerProps {
  text?: string;
  speed?: 'slow' | 'normal' | 'fast';
  variant?: 'dark' | 'light';
}

const speeds = {
  slow: '45s',
  normal: '30s',
  fast: '18s',
};

export default function MarqueeTicker({
  text = 'HANDCRAFTED IN CAIRO  ·  WALNUT & BRASS  ·  LIMITED EDITION  ·  ATELIER DU CAIRE  ·  ',
  speed = 'normal',
  variant = 'dark',
}: MarqueeTickerProps) {
  // We need at least 2 copies for seamless looping
  const repeated = text.repeat(8);

  const bg = variant === 'dark' ? 'bg-espresso' : 'bg-warm-cream';
  const textColor =
    variant === 'dark' ? 'text-champagne-gold/25' : 'text-deep-walnut/20';

  return (
    <div className={`${bg} overflow-hidden py-5 select-none grain-overlay`}>
      <div
        className="animate-marquee whitespace-nowrap flex"
        style={{ animationDuration: speeds[speed] }}
      >
        <span
          className={`font-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase ${textColor} inline-block`}
        >
          {repeated}
        </span>
        <span
          className={`font-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase ${textColor} inline-block`}
          aria-hidden
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
