import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';
import BrandWordmark from './BrandWordmark';

export default function RitualSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const boxLidY = useTransform(scrollYProgress, [0.18, 0.52], [0, -220]);
  const boxLidOpacity = useTransform(scrollYProgress, [0.45, 0.62], [1, 0]);
  const productOpacity = useTransform(scrollYProgress, [0.28, 0.48], [0, 1]);
  const ribbonOpacity = useTransform(scrollYProgress, [0.2, 0.38], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[240vh] bg-deep-walnut">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-champagne-gold)_0%,transparent_70%)] opacity-[0.08]" />

        {/* Box body */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-champagne-gold flex items-center justify-center rounded-sm">
          <div className="w-[90%] h-[90%] bg-espresso flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.16),transparent_62%)]" />
            <motion.div style={{ opacity: productOpacity }} className="relative z-10">
              <img src={brandAssets.pharaohBowTie} alt="Product in box" className="w-64 max-w-[72vw] h-auto" loading="lazy" />
            </motion.div>
          </div>
        </div>

        {/* Ribbon — opacity only */}
        <motion.div style={{ opacity: ribbonOpacity }} className="absolute z-30 h-[430px] w-8 bg-champagne-gold/95" />
        <motion.div style={{ opacity: ribbonOpacity }} className="absolute z-30 h-8 w-[430px] bg-champagne-gold/95" />

        {/* Box lid — Y + opacity only, no rotateX */}
        <motion.div
          style={{ y: boxLidY, opacity: boxLidOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-deep-walnut border border-champagne-gold/30 flex items-center justify-center rounded-sm z-20"
        >
          <BrandWordmark className="text-champagne-gold text-4xl tracking-widest opacity-90" />
        </motion.div>

        {/* Text reveal */}
        <motion.div style={{ opacity: textOpacity }} className="absolute bottom-24 text-center px-4 z-30">
          <p className="font-french italic text-4xl lg:text-5xl text-champagne-gold">
            Every piece arrives<br />as a ceremony of intention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
