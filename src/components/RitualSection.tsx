import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function RitualSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const boxLidY = useTransform(scrollYProgress, [0.2, 0.5], [0, -200]);
  const boxLidRotateX = useTransform(scrollYProgress, [0.2, 0.5], [0, 45]);
  const boxLidOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

  const productScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1.1]);
  const productY = useTransform(scrollYProgress, [0.4, 0.8], [0, -100]);
  const productOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const textOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const rustleAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasPlayedOpen, setHasPlayedOpen] = useState(false);

  useEffect(() => {
    openAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_226b9feef4.mp3'); // Example box opening sound
    rustleAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_349d3dc747.mp3'); // Example velvet rustle sound
    
    if (openAudioRef.current) openAudioRef.current.volume = 0.4;
    if (rustleAudioRef.current) rustleAudioRef.current.volume = 0.3;

    return () => {
      openAudioRef.current?.pause();
      rustleAudioRef.current?.pause();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!audioEnabled) return;

    // Box opening sound at around 0.25
    if (latest > 0.25 && latest < 0.4 && !hasPlayedOpen) {
      openAudioRef.current?.play().catch(() => {});
      setHasPlayedOpen(true);
    } else if (latest < 0.2) {
      setHasPlayedOpen(false); // Reset if scrolled back up
    }

    // Velvet rustling sound at around 0.45
    if (latest > 0.45 && latest < 0.7) {
      if (rustleAudioRef.current?.paused) {
        rustleAudioRef.current.play().catch(() => {});
      }
    } else {
      rustleAudioRef.current?.pause();
    }
  });

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-deep-walnut" onClick={() => setAudioEnabled(true)} onMouseEnter={() => setAudioEnabled(true)}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000">
        
        {/* Background Ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-champagne-gold)_0%,transparent_70%)] opacity-5" />

        {/* The Box Base */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-void-end shadow-2xl flex items-center justify-center rounded-sm">
          {/* Velvet Interior Proxy */}
          <div className="w-[90%] h-[90%] bg-espresso shadow-inner flex items-center justify-center relative">
            
            {/* The Product Inside */}
            <motion.div 
              style={{ scale: productScale, y: productY, opacity: productOpacity }}
              className="relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1596766442654-2c06adbbcdbf?q=80&w=600&auto=format&fit=crop" 
                alt="Product in box" 
                className="w-48 h-auto drop-shadow-2xl mix-blend-screen"
                style={{ filter: 'brightness(1.5) contrast(1.2)' }}
              />
            </motion.div>

          </div>
        </div>

        {/* The Box Lid */}
        <motion.div 
          style={{ 
            y: boxLidY, 
            rotateX: boxLidRotateX, 
            opacity: boxLidOpacity,
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center'
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=600&auto=format&fit=crop')] bg-cover border border-champagne-gold/20 shadow-2xl flex items-center justify-center rounded-sm z-20"
        >
          <h2 className="text-warm-cream font-display text-4xl tracking-widest uppercase opacity-80 mix-blend-overlay">Gamén</h2>
        </motion.div>

        {/* Final Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute bottom-24 text-center px-4 z-30"
        >
          <p className="font-french italic text-4xl lg:text-5xl text-champagne-gold drop-shadow-lg">
            Every piece arrives<br/>as a ceremony of intention.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
