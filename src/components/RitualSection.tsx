import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';

export default function RitualSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // Phase 1: Ribbon slides apart (0.05 - 0.2)
  const ribbonHX = useTransform(scrollYProgress, [0.05, 0.2], [0, 260]);
  const ribbonVY = useTransform(scrollYProgress, [0.05, 0.2], [0, 260]);
  const ribbonOpacity = useTransform(scrollYProgress, [0.15, 0.22], [1, 0]);

  // Phase 2: Lid opens with 3D rotation (0.2 - 0.45)
  const lidRotateX = useTransform(scrollYProgress, [0.2, 0.45], [0, -115]);
  const lidOpacity = useTransform(scrollYProgress, [0.4, 0.48], [1, 0]);

  // Phase 3: Product rises from box (0.3 - 0.5)
  const productY = useTransform(scrollYProgress, [0.3, 0.5], [40, 0]);
  const productOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const productScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  // Phase 4: Glow pulse (0.45 - 0.6)
  const glowOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.75], [0, 0.25, 0]);

  // Phase 5: Text reveal (0.65 - 0.85)
  const textOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.65, 0.8], [30, 0]);

  // Box body subtle scale
  const boxScale = useTransform(scrollYProgress, [0.45, 0.6], [1, 0.92]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-deep-walnut grain-overlay">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(207,197,178,0.06),transparent_55%)]" />

        {/* Golden glow pulse behind box */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(207,197,178,0.4),transparent_60%)]"
        />

        {/* 3D BOX ASSEMBLY */}
        <div className="relative" style={{ perspective: '1000px' }}>

          {/* Box body */}
          <motion.div
            style={{ scale: boxScale }}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
          >
            {/* Box base — dark interior with gold trim */}
            <div className="absolute inset-0 border-2 border-champagne-gold/20 bg-espresso rounded-sm overflow-hidden">
              {/* Inner velvet-like gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(90,60,38,0.6),transparent_70%)]" />
              <div className="absolute inset-[6%] border border-champagne-gold/10 rounded-sm" />

              {/* Product reveal */}
              <motion.div
                style={{ opacity: productOpacity, y: productY, scale: productScale }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <img
                  src={brandAssets.pharaohBowTie}
                  alt="Pharaoh Seal bow tie"
                  className="w-[75%] h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* BOX LID — 3D rotateX hinge from top edge */}
            <motion.div
              style={{
                rotateX: lidRotateX,
                opacity: lidOpacity,
              }}
              className="absolute inset-0 z-20 origin-top"
            >
              <div className="w-full h-full bg-deep-walnut border-2 border-champagne-gold/25 rounded-sm flex flex-col items-center justify-center gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                {/* Embossed brand on lid */}
                <div className="h-px w-12 bg-champagne-gold/30" />
                <p className="font-display text-3xl sm:text-4xl tracking-[0.2em] text-champagne-gold/70">
                  G<span className="font-lambda">Λ</span>MÉN
                </p>
                <div className="h-px w-12 bg-champagne-gold/30" />
                <p className="font-accent text-[8px] uppercase tracking-[0.3em] text-champagne-gold/35 mt-2">
                  Atelier du Caire
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIBBON — splits apart before lid opens */}
          <motion.div
            style={{ x: ribbonHX, opacity: ribbonOpacity }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-4 sm:w-5 h-[120%] bg-champagne-gold/80 z-30 rounded-full"
          />
          <motion.div
            style={{ x: useTransform(ribbonHX, v => -v), opacity: ribbonOpacity }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-full w-4 sm:w-5 h-[120%] bg-champagne-gold/80 z-30 rounded-full"
          />
          <motion.div
            style={{ y: ribbonVY, opacity: ribbonOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-[120%] bg-champagne-gold/80 z-30 rounded-full"
          />
          <motion.div
            style={{ y: useTransform(ribbonVY, v => -v), opacity: ribbonOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full h-4 sm:h-5 w-[120%] bg-champagne-gold/80 z-30 rounded-full"
          />
        </div>

        {/* Text reveal */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-16 sm:bottom-20 text-center px-6 z-10"
        >
          <p className="font-accent text-[9px] uppercase tracking-[0.3em] text-champagne-gold/40 mb-4">
            The Unboxing
          </p>
          <p className="font-french italic text-3xl sm:text-4xl lg:text-5xl text-champagne-gold leading-snug">
            Every piece arrives<br />as a ceremony of intention.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
