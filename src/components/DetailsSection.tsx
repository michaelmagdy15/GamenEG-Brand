import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';

export default function DetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const layer1Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -170, -170]);
  const layer2Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 0, 0]);
  const layer3Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 170, 170]);
  const layer1Rotate = useTransform(scrollYProgress, [0.3, 0.8], [-5, -14]);
  const layer3Rotate = useTransform(scrollYProgress, [0.3, 0.8], [5, 14]);

  const layer1Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const layer2Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const layer3Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [1, 0, 0, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-espresso text-warm-cream">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.12),transparent_62%)]" />

        <motion.div style={{ opacity: titleOpacity }} className="absolute z-50 pointer-events-none text-center px-4">
          <h2 className="font-header text-5xl md:text-7xl mb-4">Precision Deconstructed</h2>
          <p className="font-french italic text-champagne-gold text-2xl md:text-3xl">One detail. All the attention.</p>
        </motion.div>

        <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center">
          <motion.div
            className="absolute inset-[12%] rounded-full border border-champagne-gold/15"
            style={{ rotate: ringRotate }}
          />
          <motion.div
            className="absolute inset-[24%] rounded-full border border-dashed border-champagne-gold/15"
            style={{ rotate: useTransform(ringRotate, (value) => -value * 1.35) }}
          />

          <motion.div style={{ y: layer1Y, opacity: layer1Opacity, rotate: layer1Rotate }} className="absolute inset-0 flex items-center justify-center">
            <div className="absolute right-0 translate-x-24 lg:translate-x-40 w-64 text-left hidden md:block">
              <div className="w-12 h-[1px] bg-champagne-gold mb-4" />
              <h4 className="font-accent tracking-widest text-champagne-gold mb-2 text-sm">THE GRAIN</h4>
              <p className="font-body text-sm text-warm-cream/70">A polished walnut body with visible variation in tone, cut to hold its sculptural bow shape.</p>
            </div>
            <img src={brandAssets.twoToneBowTie} alt="Wood grain detail" className="w-80 h-auto object-contain drop-shadow-2xl opacity-85" />
          </motion.div>

          <motion.div style={{ y: layer2Y, opacity: layer2Opacity }} className="absolute inset-0 flex items-center justify-center">
            <div className="absolute left-0 -translate-x-24 lg:-translate-x-40 w-64 text-right hidden md:block">
              <div className="w-12 h-[1px] bg-warm-cream ml-auto mb-4" />
              <h4 className="font-accent tracking-widest text-warm-cream mb-2 text-sm">THE EMBLEM</h4>
              <p className="font-body text-sm text-warm-cream/70">Brass iconography sits at the center, giving each piece its signature Egyptian character.</p>
            </div>
            <img src={brandAssets.ankhBowTie} alt="Brass emblem detail" className="w-72 h-auto object-contain drop-shadow-2xl" />
          </motion.div>

          <motion.div style={{ y: layer3Y, opacity: layer3Opacity, rotate: layer3Rotate }} className="absolute inset-0 flex items-center justify-center">
            <div className="absolute right-0 translate-x-24 lg:translate-x-40 w-64 text-left translate-y-24 hidden md:block">
              <div className="w-12 h-[1px] bg-champagne-gold mb-4" />
              <h4 className="font-accent tracking-widest text-champagne-gold mb-2 text-sm">THE SIGNATURE</h4>
              <p className="font-body text-sm text-warm-cream/70">A custom center mark, finished in warm brass and aligned with the GAMEN identity.</p>
            </div>
            <img src={brandAssets.heroBowTie} alt="GAMEN signature detail" className="w-80 h-auto object-contain drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
