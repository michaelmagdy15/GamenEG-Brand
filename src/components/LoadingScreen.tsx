import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import BrandWordmark from './BrandWordmark';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
      setTimeout(onComplete, 1000);
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <BrandWordmark className="block text-champagne-gold text-5xl tracking-[0.25em] text-center mb-4" />
        <p className="text-champagne-gold font-french italic text-xl text-center">
          L'élégance taillée en bois
        </p>
      </motion.div>
    </motion.div>
  );
}
