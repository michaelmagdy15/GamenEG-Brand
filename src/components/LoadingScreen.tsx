import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-walnut"
      initial={{ opacity: 1 }}
      animate={{ opacity: complete ? 0 : 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      pointerEvents={complete ? 'none' : 'auto'}
    >
      {/* Simulation of drawing logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <h1 className="text-warm-cream font-display text-5xl tracking-[0.25em] font-medium uppercase text-center mb-4">
          Gamén
        </h1>
        <p className="text-champagne-gold font-french italic text-xl text-center">
          L'élégance taillée en bois
        </p>
      </motion.div>
    </motion.div>
  );
}
