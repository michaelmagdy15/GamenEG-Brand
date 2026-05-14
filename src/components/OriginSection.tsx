import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function OriginSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const rawWoodOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0]);
  const carvedOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const finishedOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);

  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const chiseAudioRef = useRef<HTMLAudioElement | null>(null);
  const polishAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chiseAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2023/10/01/audio_10a1122615.mp3'); // Example carving/chisel sound
    polishAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_7acb8caebc.mp3'); // Example polishing/sanding sound
    
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

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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
    <section ref={containerRef} className="relative h-[300vh] bg-deep-walnut text-warm-cream" onClick={() => setAudioEnabled(true)}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Images sequence */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
          {/* Raw Wood */}
          <motion.img 
            style={{ opacity: rawWoodOpacity }}
            src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop"
            alt="Raw Wood"
            className="absolute max-w-lg w-full object-cover rounded-sm shadow-2xl opacity-60"
          />
          {/* Chiseled / Carved */}
          <motion.img 
            style={{ opacity: carvedOpacity }}
            src="https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=2670&auto=format&fit=crop"
            alt="Carved Wood"
            className="absolute max-w-lg w-full object-cover shadow-2xl opacity-80 mix-blend-luminosity"
          />
          {/* Finished Product */}
          <motion.img 
            style={{ opacity: finishedOpacity }}
            src="https://images.unsplash.com/photo-1549488344-c7da441d4013?q=80&w=2670&auto=format&fit=crop"
            alt="Finished Watch"
            className="absolute max-w-lg w-full object-cover shadow-2xl"
          />
        </div>

        {/* Text Sequence */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center px-4">
          <motion.h2 
            style={{ opacity: text1Opacity }}
            className="absolute font-header text-4xl md:text-6xl text-warm-cream"
          >
            Sélectionné à la main
          </motion.h2>
          <motion.h2 
            style={{ opacity: text2Opacity }}
            className="absolute font-header text-4xl md:text-6xl text-warm-cream"
          >
            Sculpté avec intention
          </motion.h2>
          <motion.h2 
            style={{ opacity: text3Opacity }}
            className="absolute font-header text-4xl md:text-6xl text-champagne-gold"
          >
            Poli jusqu'à la perfection
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
