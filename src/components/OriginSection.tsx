import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { brandAssets } from '../brandAssets';

const steps = ['Select', 'Carve', 'Polish'];

export default function OriginSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [activeStep, setActiveStep] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const chiseAudioRef = useRef<HTMLAudioElement | null>(null);
  const polishAudioRef = useRef<HTMLAudioElement | null>(null);

  const rawWoodOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0]);
  const carvedOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const finishedOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);
  const rawX = useTransform(scrollYProgress, [0, 0.35], ['0%', '-16%']);
  const carvedX = useTransform(scrollYProgress, [0.25, 0.65], ['16%', '-8%']);
  const finishedScale = useTransform(scrollYProgress, [0.55, 1], [0.8, 1.08]);
  const progressHeight = useTransform(scrollYProgress, [0.08, 0.92], ['0%', '100%']);

  useEffect(() => {
    chiseAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2023/10/01/audio_10a1122615.mp3');
    polishAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_7acb8caebc.mp3');

    if (chiseAudioRef.current) {
      chiseAudioRef.current.volume = 0.2;
      chiseAudioRef.current.loop = true;
    }
    if (polishAudioRef.current) {
      polishAudioRef.current.volume = 0.2;
      polishAudioRef.current.loop = true;
    }

    return () => {
      chiseAudioRef.current?.pause();
      polishAudioRef.current?.pause();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setActiveStep(latest < 0.38 ? 0 : latest < 0.7 ? 1 : 2);
    if (!audioEnabled) return;

    if (latest > 0.2 && latest < 0.5) {
      if (chiseAudioRef.current?.paused) chiseAudioRef.current.play().catch(() => {});
    } else {
      chiseAudioRef.current?.pause();
    }

    if (latest > 0.5 && latest < 0.8) {
      if (polishAudioRef.current?.paused) polishAudioRef.current.play().catch(() => {});
    } else {
      polishAudioRef.current?.pause();
    }
  });

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-deep-walnut text-warm-cream" onClick={() => setAudioEnabled(true)}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-y-0 left-6 md:left-12 flex items-center z-20">
          <div className="relative h-[48vh] w-px bg-champagne-gold/20">
            <motion.div className="absolute top-0 left-0 w-px bg-champagne-gold" style={{ height: progressHeight }} />
            <div className="absolute -left-2 inset-y-0 flex flex-col justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className={`block h-4 w-4 rounded-full border transition-colors ${activeStep >= index ? 'bg-champagne-gold border-champagne-gold' : 'bg-deep-walnut border-champagne-gold/40'}`} />
                  <span className={`hidden sm:block font-accent text-[10px] uppercase tracking-[0.22em] transition-colors ${activeStep === index ? 'text-champagne-gold' : 'text-champagne-gold/45'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.12),transparent_58%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
          <motion.img
            style={{ opacity: rawWoodOpacity, x: rawX }}
            src={brandAssets.twoToneBowTie}
            alt="Two-tone wooden bow tie"
            className="absolute max-w-xl w-[78vw] object-cover rounded-sm shadow-2xl"
          />
          <motion.img
            style={{ opacity: carvedOpacity, x: carvedX }}
            src={brandAssets.ankhBowTie}
            alt="GAMEN bow tie with Egyptian brass detail"
            className="absolute max-w-xl w-[78vw] object-cover shadow-2xl"
          />
          <motion.img
            style={{ opacity: finishedOpacity, scale: finishedScale }}
            src={brandAssets.heroBowTie}
            alt="Finished GAMEN bow tie"
            className="absolute max-w-2xl w-[88vw] object-contain drop-shadow-[0_46px_55px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center px-4">
          <motion.h2 style={{ opacity: rawWoodOpacity }} className="absolute font-header text-4xl md:text-7xl text-warm-cream">
            Sélectionné à la main
          </motion.h2>
          <motion.h2 style={{ opacity: carvedOpacity }} className="absolute font-header text-4xl md:text-7xl text-warm-cream">
            Sculpté avec intention
          </motion.h2>
          <motion.h2 style={{ opacity: finishedOpacity }} className="absolute font-header text-4xl md:text-7xl text-champagne-gold">
            Poli jusqu'à la perfection
          </motion.h2>
        </div>

        <button
          onClick={() => setAudioEnabled(true)}
          className="absolute bottom-8 right-6 md:right-12 z-20 border border-champagne-gold/35 px-4 py-3 font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold hover:bg-champagne-gold hover:text-deep-walnut transition-colors"
        >
          Sound {audioEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </section>
  );
}
