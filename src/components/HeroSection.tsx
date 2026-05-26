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
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Phase 1: Initial view — bow tie + brand reveal (logo + tagline together)
  // Perfectly symmetric cross-fade: fades out from 0.2 to 0.55
  const brandOpacity = useTransform(scrollYProgress, [0.2, 0.55], [1, 0]);
  const brandScale = useTransform(scrollYProgress, [0.2, 0.55], [1, 0.95]);
  const brandY = useTransform(scrollYProgress, [0.2, 0.55], ['0px', '-30px']);

  // Phase 2: CTA — Handcrafted reveal
  // Perfectly symmetric cross-fade: fades in from 0.3 to 0.65 (overlap 0.3 to 0.55 has constant total opacity of 0.714)
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.65], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.3, 0.65], ['30px', '0px']);

  // Background text parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.06, 0.06, 0]);

  // Bow tie scene fades slightly as text takes over
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [1, 1, 0.4, 0.2]);

  return (
    <section ref={containerRef} className="relative h-[120svh] sm:h-[120vh] bg-deep-walnut grain-overlay -mb-[20svh] sm:-mb-[25vh] md:-mb-[30vh]">
      {/* h-svh = Safari-safe viewport height (excludes collapsible address bar) */}
      <div className="sticky top-0 h-svh w-full flex items-center justify-center overflow-hidden">

        {/* Ambient radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(207,197,178,0.12),transparent_58%)]" />



        {/* 3D Scene — fades down as scroll progresses */}
        <motion.div
          style={{ opacity: sceneOpacity }}
          className="absolute inset-0 flex items-center justify-center -translate-y-[15vh] sm:-translate-y-[18vh] md:-translate-y-[20vh]"
        >
          <HeroScene />
        </motion.div>

        {/* ============================================
            SCROLL TEXT SEQUENCE — centered, layered
            ============================================ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full overflow-hidden translate-y-[8vh] sm:translate-y-[10vh] md:translate-y-[12vh]">
          <div className="relative text-center px-6 max-w-3xl w-full">

            {/* Phase 1: Brand name & Tagline */}
            <motion.div style={{ opacity: brandOpacity, scale: brandScale, y: brandY }}>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-champagne-gold font-light tracking-[0.15em] leading-none">
                G<span className="font-lambda">Λ</span>MÉN
              </h1>
              <p translate="no" className="notranslate font-french italic text-lg sm:text-2xl md:text-3xl lg:text-4xl text-champagne-gold/75 font-light leading-snug mt-3 sm:mt-4 lg:mt-5">
                L'élégance taillée <span className="text-champagne-gold">en bois.</span>
              </p>
            </motion.div>

            {/* Phase 3: CTA */}
            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
            >
              <p className="font-display text-xl sm:text-4xl md:text-6xl text-champagne-gold font-light tracking-[0.1em] uppercase">
                H<span className="font-lambda">Λ</span>NDCR<span className="font-lambda">Λ</span>FTED IN EGYPT
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
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="font-accent text-[9px] uppercase tracking-[0.25em] text-champagne-gold/30">
            Scroll
          </p>
          <div className="w-px h-10 sm:h-16 bg-champagne-gold/15 overflow-hidden">
            <div className="w-full h-1/2 bg-champagne-gold/50 animate-scroll-hint" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
