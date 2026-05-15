import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'brand' | 'tagline' | 'exit'>('intro');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Progress bar fills (0-100 over ~2s)
    let current = 0;
    const interval = setInterval(() => {
      current += 1.5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(Math.floor(current));
    }, 25);

    // Phase 2: Show brand name at ~0.3s
    const t1 = setTimeout(() => setPhase('brand'), 300);
    // Phase 3: Show tagline at ~1.2s
    const t2 = setTimeout(() => setPhase('tagline'), 1200);
    // Phase 4: Exit at ~2.8s
    const t3 = setTimeout(() => setPhase('exit'), 2800);
    // Phase 5: Unmount at ~4.2s (after curtain animation finishes)
    const t4 = setTimeout(onComplete, 4200);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const isExiting = phase === 'exit';

  // Split the brand name for staggered letter animation
  const brandLetters = 'GAMÉN'.split('');

  return (
    <motion.div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Left Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isExiting ? -90 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.1 }}
        style={{ transformOrigin: 'left center' }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#1a1412] z-20 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)] border-r border-champagne-gold/10"
      >
        <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isExiting ? 90 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.1 }}
        style={{ transformOrigin: 'right center' }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#1a1412] z-20 shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)] border-l border-champagne-gold/10"
      >
        <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Center seam line — golden line at the split that shrinks away */}
      <motion.div
        initial={{ scaleX: 1, opacity: 1 }}
        animate={{
          scaleX: isExiting ? 0 : 1,
          opacity: isExiting ? 0 : 1,
        }}
        transition={{ duration: 0.6, ease, delay: 0.05 }}
        className="absolute top-1/2 left-0 right-0 h-px bg-champagne-gold/30 z-30 origin-center -translate-y-1/2"
      />

      {/* Content layer — sits between the two curtains */}
      <div className="absolute inset-0 z-25 flex flex-col items-center justify-center">
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col items-center"
            >
              {/* Staggered brand letters */}
              <div className="flex items-baseline gap-[0.04em] mb-4 overflow-hidden">
                {brandLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: '120%', opacity: 0 }}
                    animate={{
                      y: phase !== 'intro' ? '0%' : '120%',
                      opacity: phase !== 'intro' ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.9,
                      ease,
                      delay: i * 0.07,
                    }}
                    className="font-display text-6xl sm:text-8xl lg:text-[120px] text-champagne-gold tracking-[0.15em] leading-none inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Tagline — appears after brand settles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: phase === 'tagline' ? 1 : 0,
                  y: phase === 'tagline' ? 0 : 10,
                }}
                transition={{ duration: 0.8, ease }}
                className="overflow-hidden"
              >
                <p className="font-french italic text-champagne-gold/70 text-lg sm:text-xl tracking-wide">
                  L'elegance taillee en bois
                </p>
              </motion.div>

              {/* Progress indicator — minimal golden line */}
              <div className="mt-10 w-32 sm:w-48 h-px bg-champagne-gold/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-champagne-gold/60 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                />
              </div>

              {/* Percentage */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== 'intro' ? 0.4 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 font-mono text-[10px] text-champagne-gold/40 tracking-[0.3em]"
              >
                {progress}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
