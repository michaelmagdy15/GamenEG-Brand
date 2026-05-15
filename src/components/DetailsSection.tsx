import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';

const details = [
  {
    image: brandAssets.twoToneBowTie,
    alt: 'Two-tone walnut bow tie',
    label: 'THE GRAIN',
    description: 'A polished walnut body with visible variation in tone, cut to hold its sculptural bow shape.',
    side: 'right' as const,
  },
  {
    image: brandAssets.ankhBowTie,
    alt: 'Eye of Horus brass emblem bow tie',
    label: 'THE EMBLEM',
    description: 'Brass iconography sits at the center, giving each piece its signature Egyptian character.',
    side: 'left' as const,
  },
  {
    image: brandAssets.heroBowTie,
    alt: 'GAMÉN signature bow tie',
    label: 'THE SIGNATURE',
    description: 'A custom center mark, finished in warm brass and aligned with the GAMÉN identity.',
    side: 'right' as const,
  },
];

export default function DetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });

  // Title: visible at start and end
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.15, 0.85, 0.9], [1, 1, 0, 0, 1]);

  // Each detail gets its own window: fade in → hold → fade out
  // Detail 1: 0.12 - 0.38
  const d1Opacity = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0]);
  const d1Scale  = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0.85, 1, 1, 0.85]);
  const d1LabelX = useTransform(scrollYProgress, [0.12, 0.22], [40, 0]);

  // Detail 2: 0.38 - 0.62
  const d2Opacity = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.62], [0, 1, 1, 0]);
  const d2Scale  = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.62], [0.85, 1, 1, 0.85]);
  const d2LabelX = useTransform(scrollYProgress, [0.38, 0.48], [-40, 0]);

  // Detail 3: 0.62 - 0.85
  const d3Opacity = useTransform(scrollYProgress, [0.62, 0.68, 0.79, 0.85], [0, 1, 1, 0]);
  const d3Scale  = useTransform(scrollYProgress, [0.62, 0.68, 0.79, 0.85], [0.85, 1, 1, 0.85]);
  const d3LabelX = useTransform(scrollYProgress, [0.62, 0.72], [40, 0]);

  // Ring rotation driven by scroll
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const opacities = [d1Opacity, d2Opacity, d3Opacity];
  const scales = [d1Scale, d2Scale, d3Scale];
  const labelXs = [d1LabelX, d2LabelX, d3LabelX];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-espresso text-warm-cream">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.1),transparent_62%)]" />

        {/* Title — visible at start and end */}
        <motion.div style={{ opacity: titleOpacity }} className="absolute z-20 pointer-events-none text-center px-4">
          <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-champagne-gold/50 mb-4">Craftsmanship</p>
          <h2 className="font-header text-5xl md:text-7xl mb-4">Precision Deconstructed</h2>
          <p className="font-french italic text-champagne-gold text-2xl md:text-3xl">One detail. All the attention.</p>
        </motion.div>

        {/* Center showcase area */}
        <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center">
          {/* Decorative rings — scroll-driven rotation */}
          <motion.div
            style={{ rotate: ringRotate }}
            className="absolute inset-[12%] rounded-full border border-champagne-gold/12"
          />
          <motion.div
            style={{ rotate: useTransform(ringRotate, v => -v) }}
            className="absolute inset-[24%] rounded-full border border-dashed border-champagne-gold/10"
          />

          {/* Detail layers — each fades in AND out, no stacking */}
          {details.map((detail, i) => (
            <motion.div
              key={detail.label}
              style={{ opacity: opacities[i], scale: scales[i] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Annotation label */}
              <motion.div
                style={{ x: labelXs[i], opacity: opacities[i] }}
                className={`absolute ${
                  detail.side === 'right'
                    ? 'right-0 translate-x-20 lg:translate-x-36 text-left'
                    : 'left-0 -translate-x-20 lg:-translate-x-36 text-right'
                } w-56 hidden md:block`}
              >
                <div className={`w-10 h-px bg-champagne-gold/40 mb-3 ${detail.side === 'left' ? 'ml-auto' : ''}`} />
                <h4 className="font-accent tracking-[0.2em] text-champagne-gold text-[11px] mb-2">{detail.label}</h4>
                <p className="font-body text-sm text-warm-cream/60 leading-relaxed">{detail.description}</p>
              </motion.div>

              {/* Product image */}
              <img
                src={detail.image}
                alt={detail.alt}
                className="w-72 md:w-80 h-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-4 hidden lg:flex">
          {details.map((detail, i) => (
            <motion.div
              key={detail.label}
              style={{ opacity: useTransform(opacities[i], v => 0.2 + v * 0.8) }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full border border-champagne-gold/40" />
              <span className="font-accent text-[9px] uppercase tracking-[0.15em] text-champagne-gold/40">
                {detail.label.replace('THE ', '')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
