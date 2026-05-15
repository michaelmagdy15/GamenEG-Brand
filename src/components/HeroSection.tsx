import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { brandAssets } from '../brandAssets';
import BrandWordmark from './BrandWordmark';
import HeroScene from './canvas/HeroScene';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 1, 0]);
  const taglineOpacity = useTransform(scrollYProgress, [0.6, 0.8, 0.9], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.3, 0.9], [30, -30]);
  const taglineY = useTransform(scrollYProgress, [0.6, 0.9], [20, -20]);

  const productScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const productRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 22 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 22 });

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-deep-walnut">
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
          pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(207,197,178,0.18),transparent_58%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <motion.h1
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
            className="font-display text-[84px] md:text-[180px] text-champagne-gold font-light leading-none opacity-10"
          >
            ÉLÉGANCE
          </motion.h1>
          <motion.h1
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="font-display text-[84px] md:text-[180px] text-champagne-gold font-light leading-none opacity-10"
          >
            TAILLÉE
          </motion.h1>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <HeroScene />
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            scale: productScale,
            opacity: productOpacity,
            willChange: 'transform, opacity',
          }}
        >
          
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-[320px] h-[320px] md:w-[520px] md:h-[520px]">
              <div className="absolute -left-20 md:-left-40 top-10 text-right space-y-4 hidden sm:block">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">Walnut Origin</p>
                  <p className="font-french italic text-lg leading-tight text-champagne-gold">Cairo hand-selected<br />ancient timber</p>
                </div>
                <div className="h-[1px] w-24 bg-champagne-gold/30 ml-auto" />
              </div>

              <div className="absolute -right-20 md:-right-40 bottom-10 text-left space-y-4 hidden sm:block">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">Signature</p>
                  <p className="font-french italic text-lg leading-tight text-champagne-gold">Brass initials<br />poli à la main</p>
                </div>
                <div className="h-[1px] w-24 bg-champagne-gold/30 mr-auto" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute z-10 flex flex-col items-center text-center px-4">
          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-champagne-gold text-[72px] sm:text-[112px] font-light mb-2 uppercase leading-none drop-shadow-md"
          >
            <BrandWordmark />
          </motion.h1>
          <motion.p
            style={{ opacity: taglineOpacity, y: taglineY }}
            className="text-champagne-gold font-french italic text-3xl font-light drop-shadow-sm"
          >
            L'élégance taillée en bois.
          </motion.p>
        </div>

        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-champagne-gold/20 overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-champagne-gold"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
