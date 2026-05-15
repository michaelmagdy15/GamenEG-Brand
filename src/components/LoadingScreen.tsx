import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import BrandWordmark from './BrandWordmark';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [complete, setComplete] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    // We enforce a minimum loading time for aesthetics, but also wait for Three.js assets
    let timer: NodeJS.Timeout;
    
    if (progress === 100) {
      // Once assets are 100% loaded, wait 800ms before dismissing for smooth transition
      timer = setTimeout(() => {
        setComplete(true);
        setTimeout(onComplete, 1000);
      }, 800);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [progress, onComplete]);

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
        <div className="mt-8 flex justify-center">
          <p className="text-champagne-gold/50 font-mono text-sm tracking-widest">
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
