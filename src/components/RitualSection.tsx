import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { brandAssets } from '../brandAssets';
import BrandWordmark from './BrandWordmark';

const glints = Array.from({ length: 11 }, (_, index) => ({
  id: index,
  left: `${12 + ((index * 17) % 76)}%`,
  top: `${18 + ((index * 23) % 62)}%`,
  delay: index * 0.18,
}));

export default function RitualSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const boxLidY = useTransform(scrollYProgress, [0.18, 0.52], [0, -220]);
  const boxLidRotateX = useTransform(scrollYProgress, [0.18, 0.52], [0, 58]);
  const boxLidOpacity = useTransform(scrollYProgress, [0.45, 0.62], [1, 0]);
  const productScale = useTransform(scrollYProgress, [0.34, 0.85], [0.72, 1.14]);
  const productY = useTransform(scrollYProgress, [0.34, 0.85], [18, -120]);
  const productOpacity = useTransform(scrollYProgress, [0.28, 0.48], [0, 1]);
  const ribbonY = useTransform(scrollYProgress, [0.08, 0.32], [0, -140]);
  const ribbonOpacity = useTransform(scrollYProgress, [0.2, 0.38], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const rustleAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasPlayedOpen, setHasPlayedOpen] = useState(false);

  useEffect(() => {
    openAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_226b9feef4.mp3');
    rustleAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_349d3dc747.mp3');
    if (openAudioRef.current) openAudioRef.current.volume = 0.4;
    if (rustleAudioRef.current) rustleAudioRef.current.volume = 0.3;

    return () => {
      openAudioRef.current?.pause();
      rustleAudioRef.current?.pause();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!audioEnabled) return;

    if (latest > 0.25 && latest < 0.4 && !hasPlayedOpen) {
      openAudioRef.current?.play().catch(() => {});
      setHasPlayedOpen(true);
    } else if (latest < 0.2) {
      setHasPlayedOpen(false);
    }

    if (latest > 0.45 && latest < 0.7) {
      if (rustleAudioRef.current?.paused) rustleAudioRef.current.play().catch(() => {});
    } else {
      rustleAudioRef.current?.pause();
    }
  });

  return (
    <section ref={containerRef} className="relative h-[260vh] bg-deep-walnut" onClick={() => setAudioEnabled(true)} onMouseEnter={() => setAudioEnabled(true)}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-champagne-gold)_0%,transparent_70%)] opacity-8" />

        {glints.map((glint) => (
          <motion.span
            key={glint.id}
            className="absolute h-1 w-1 rounded-full bg-champagne-gold"
            style={{ left: glint.left, top: glint.top }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1.4, 0.4], y: [0, -18, -36] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: glint.delay, ease: 'easeInOut' }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-champagne-gold shadow-2xl flex items-center justify-center rounded-sm">
          <div className="w-[90%] h-[90%] bg-espresso shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.16),transparent_62%)]" />
            <motion.div style={{ scale: productScale, y: productY, opacity: productOpacity }} className="relative z-10">
              <img src={brandAssets.pharaohBowTie} alt="Product in box" className="w-64 max-w-[72vw] h-auto drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>

        <motion.div style={{ y: ribbonY, opacity: ribbonOpacity }} className="absolute z-30 h-[430px] w-8 bg-champagne-gold/95 shadow-xl" />
        <motion.div style={{ y: ribbonY, opacity: ribbonOpacity }} className="absolute z-30 h-8 w-[430px] bg-champagne-gold/95 shadow-xl" />

        <motion.div
          style={{
            y: boxLidY,
            rotateX: boxLidRotateX,
            opacity: boxLidOpacity,
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-deep-walnut border border-champagne-gold/30 shadow-2xl flex items-center justify-center rounded-sm z-20"
        >
          <BrandWordmark className="text-champagne-gold text-4xl tracking-widest opacity-90" />
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="absolute bottom-24 text-center px-4 z-30">
          <p className="font-french italic text-4xl lg:text-5xl text-champagne-gold drop-shadow-lg">
            Every piece arrives<br />as a ceremony of intention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
