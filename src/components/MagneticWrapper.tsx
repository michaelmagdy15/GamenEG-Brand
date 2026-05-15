import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

// Detect touch-only devices once at module load — avoids repeated media query checks
const isTouchOnly =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function MagneticWrapper({
  children,
  strength = 0.35,
  className = '',
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.5 });

  // Render passthrough on touch devices — no motion overhead
  if (isTouchOnly) {
    return <div className={className}>{children}</div>;
  }

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
