import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'brand' | 'tagline' | 'exit'>('intro');
  const [progress, setProgress] = useState(0);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Phase 1: Show brand name early
    const t1 = setTimeout(() => setPhase('brand'), 100);
    // Phase 2: Show tagline at ~1s
    const t2 = setTimeout(() => setPhase('tagline'), 1000);

    // Phase 3: Progress bar fills smoothly in ~1.5 seconds
    let current = 0;
    const interval = setInterval(() => {
      current += 1.5;
      
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(Math.floor(current));
    }, 20);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Phase 4: Handle exit and complete states
  useEffect(() => {
    let exitTimeoutId: NodeJS.Timeout;
    let completeTimeoutId: NodeJS.Timeout;

    if (progress >= 100) {
      exitTimeoutId = setTimeout(() => {
        setPhase('exit');
        completeTimeoutId = setTimeout(() => {
          setIsUnmounted(true);
          onComplete();
        }, 1600); // 1.6s matches door animation duration
      }, 500);
    }

    return () => {
      if (exitTimeoutId) clearTimeout(exitTimeoutId);
      if (completeTimeoutId) clearTimeout(completeTimeoutId);
    };
  }, [progress, onComplete]);

  const isExiting = phase === 'exit';

  if (isUnmounted) return null;



  return (
    <motion.div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Left Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isExiting ? -90 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.1 }}
        style={{ transformOrigin: 'left center' }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#1a1412] z-20 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isExiting ? 90 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.1 }}
        style={{ transformOrigin: 'right center' }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#1a1412] z-20 shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Content layer — sits between the two curtains */}
      <div className="absolute inset-0 z-25 flex flex-col items-center justify-center">
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col items-center"
            >
              {/* Brand Logo Drawing Animation */}
              <div className="mb-4 flex justify-center items-center">
                <svg viewBox="0 0 800 150" className="w-[300px] sm:w-[400px] lg:w-[600px] h-auto overflow-visible">
                  <motion.text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-display tracking-[0.2em]"
                    fontSize="100"
                    fill="transparent"
                    stroke="#cfc5b2"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    initial={{ strokeDasharray: 1200, strokeDashoffset: 1200, fill: "rgba(207,197,178,0)" }}
                    animate={{ 
                      strokeDashoffset: phase !== 'intro' ? 0 : 1200, 
                      fill: phase === 'tagline' ? "rgba(207,197,178,1)" : "rgba(207,197,178,0)" 
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1.8, ease: "easeInOut", delay: 0.2 },
                      fill: { duration: 1, ease: "easeInOut", delay: 0.4 }
                    }}
                  >
                    <tspan>G</tspan><tspan className="font-lambda">Λ</tspan><tspan>MÉN</tspan>
                  </motion.text>
                </svg>
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
