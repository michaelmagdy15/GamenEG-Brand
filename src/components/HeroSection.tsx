import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import HeroScene from './canvas/HeroScene';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Apply spring physics to scroll progress for fluid inertia
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Phase 1: Initial view (0-0.15) — bow tie + brand reveal
  const brandOpacity = useTransform(scrollYProgress, [0, 0.05, 0.25], [1, 1, 0]);
  const brandScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);

  // Phase 2: Tagline slides in (0.15-0.45)
  const taglineOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.55], [0, 1, 0]);
  const taglineY = useTransform(scrollYProgress, [0.15, 0.25], [60, 0]);

  // Phase 3: Craft detail (0.45-0.75)
  const craftOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.85], [0, 1, 0]);
  const craftY = useTransform(scrollYProgress, [0.45, 0.55], [40, 0]);

  // Phase 4: CTA (0.75-1.0)
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

  // Background text parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5], [0.06, 0.06, 0]);

  // Bow tie scene fades slightly as text takes over
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.12, 0.5, 0.8], [1, 1, 0.4, 0.2]);

  // Divider line grows
  const dividerScale = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-deep-walnut grain-overlay">
      {/* h-svh = Safari-safe viewport height (excludes collapsible address bar) */}
      <div className="sticky top-0 h-svh w-full flex items-center justify-center overflow-hidden">

        {/* Ambient radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(207,197,178,0.12),transparent_58%)]" />

        {/* Giant background typography — parallax drift */}
        <motion.div
          style={{ y: bgY, opacity: bgOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-display text-[54px] sm:text-[72px] md:text-[180px] text-champagne-gold font-light leading-none whitespace-nowrap">
            ÉLÉGANCE
          </span>
          <span className="font-display text-[54px] sm:text-[72px] md:text-[180px] text-champagne-gold font-light leading-none whitespace-nowrap">
            TAILLÉE
          </span>
        </motion.div>

        {/* 3D Scene — fades down as scroll progresses */}
        <motion.div
          style={{ opacity: sceneOpacity }}
          className="absolute inset-0 flex items-center justify-center -translate-y-12 sm:-translate-y-16 md:-translate-y-20 lg:-translate-y-28"
        >
          <HeroScene />
        </motion.div>

        {/* ============================================
            SCROLL TEXT SEQUENCE — centered, layered
            ============================================ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full overflow-hidden translate-y-16 sm:translate-y-24 md:translate-y-28 lg:translate-y-40">
          <div className="text-center px-6 max-w-3xl w-full">

            {/* Phase 1: Brand name */}
            <motion.div style={{ opacity: brandOpacity, scale: brandScale }}>
              <p className="font-accent text-[10px] md:text-xs uppercase tracking-[0.35em] text-champagne-gold/60 mb-4 whitespace-nowrap">
                Atelier du Caire
              </p>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-champagne-gold font-light tracking-[0.15em] leading-none">
                G<span className="font-lambda">Λ</span>MÉN
              </h1>
              <motion.div
                style={{ scaleX: dividerScale }}
                className="h-px w-32 bg-champagne-gold/40 mx-auto mt-6 origin-center"
              />
            </motion.div>

            {/* Phase 2: Tagline */}
            <motion.div
              style={{ opacity: taglineOpacity, y: taglineY }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              <p className="font-french italic text-3xl sm:text-4xl md:text-5xl text-champagne-gold font-light leading-snug">
                L'élégance taillée<br />
                <span className="text-champagne-gold/60">en bois.</span>
              </p>
            </motion.div>

            {/* Phase 3: Craft */}
            <motion.div
              style={{ opacity: craftOpacity, y: craftY }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="h-px w-12 bg-champagne-gold/30" />
                <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-champagne-gold/50">
                  The Details
                </p>
                <div className="h-px w-12 bg-champagne-gold/30" />
              </div>
              <p className="font-body text-lg md:text-xl text-champagne-gold/70 max-w-md leading-relaxed">
                Hand-selected walnut. Brass insignias cast from pharaonic moulds.
                Each piece signed, numbered, and unrepeatable.
              </p>
            </motion.div>

            {/* Phase 4: CTA */}
            <motion.div
              style={{ opacity: ctaOpacity }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            >
              <p className="font-display text-4xl sm:text-6xl text-champagne-gold font-light">
                Discover the Collection
              </p>
              <div className="h-px w-16 bg-champagne-gold/30" />
              <p className="font-accent text-[10px] uppercase tracking-[0.25em] text-champagne-gold/40">
                Scroll to continue
              </p>
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator — visible only at start */}
        <motion.div
          style={{ opacity: brandOpacity }}
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <p className="font-accent text-[9px] uppercase tracking-[0.25em] text-champagne-gold/30">
            Scroll
          </p>
          <div className="w-px h-16 bg-champagne-gold/15 overflow-hidden">
            <div className="w-full h-1/2 bg-champagne-gold/50 animate-scroll-hint" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
