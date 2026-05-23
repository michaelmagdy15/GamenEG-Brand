import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';

const steps = ['Select', 'Carve', 'Polish'];

export default function OriginSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });

  const rawWoodOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [1, 1, 0]);
  const carvedOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6], [0, 1, 0]);
  const finishedOpacity = useTransform(scrollYProgress, [0.5, 0.65, 0.85], [0, 1, 1]);
  const progressHeight = useTransform(scrollYProgress, [0.05, 0.85], ['0%', '100%']);

  // Derive active step from scroll progress
  const activeStepFromScroll = useTransform(scrollYProgress, (v) =>
    v < 0.33 ? 0 : v < 0.58 ? 1 : 2
  );

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-deep-walnut text-warm-cream grain-overlay">
      <div className="sticky top-0 h-svh w-full flex items-center justify-center overflow-hidden">
        {/* Progress indicator */}
        <div className="absolute inset-y-0 left-6 md:left-12 flex items-center z-20">
          <div className="relative h-[48vh] w-px bg-champagne-gold/20">
            <motion.div className="absolute top-0 left-0 w-px bg-champagne-gold" style={{ height: progressHeight }} />
            <div className="absolute -left-2 inset-y-0 flex flex-col justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="block h-4 w-4 rounded-full border transition-colors bg-deep-walnut border-champagne-gold/40" />
                  <span className="hidden sm:block font-accent text-[10px] uppercase tracking-[0.22em] text-champagne-gold/45">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.12),transparent_58%)]" />

        {/* Images — opacity-only transitions, no X transforms */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
          <motion.img
            style={{ opacity: rawWoodOpacity }}
            src={brandAssets.twoToneBowTie}
            alt="Two-tone wooden bow tie"
            className="absolute max-w-xl w-[78vw] object-cover rounded-sm"
            loading="lazy"
          />
          <motion.img
            style={{ opacity: carvedOpacity }}
            src={brandAssets.ankhBowTie}
            alt="GΛMÉN bow tie with Egyptian brass detail"
            className="absolute max-w-xl w-[78vw] object-cover"
            loading="lazy"
          />
          <motion.img
            style={{ opacity: finishedOpacity }}
            src={brandAssets.heroBowTie}
            alt="Finished GΛMÉN bow tie"
            className="absolute max-w-2xl w-[88vw] object-contain"
            loading="lazy"
          />
        </div>

        {/* Text overlays */}
        <div className="absolute inset-x-0 bottom-[15vh] flex items-end justify-center pointer-events-none text-center px-4">
          <motion.h2 style={{ opacity: rawWoodOpacity }} className="absolute font-header text-3xl md:text-5xl lg:text-6xl text-warm-cream drop-shadow-xl">
            Sélectionné à la main
          </motion.h2>
          <motion.h2 style={{ opacity: carvedOpacity }} className="absolute font-header text-3xl md:text-5xl lg:text-6xl text-warm-cream drop-shadow-xl">
            Sculpté avec intention
          </motion.h2>
          <motion.h2 style={{ opacity: finishedOpacity }} className="absolute font-header text-3xl md:text-5xl lg:text-6xl text-champagne-gold drop-shadow-xl">
            Poli jusqu'à la perfection
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
