import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const onEnter = useCallback(() => setIsHovering(true), []);
  const onLeave = useCallback(() => setIsHovering(false), []);

  useEffect(() => {
    if (!isFinePointer || shouldReduceMotion) return;

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      // Ignore touch-simulated mouse movements to prevent stuck cursors on hybrid screens
      if ((e as any).sourceCapabilities?.firesTouchEvents) return;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onDocLeave = () => setIsVisible(false);
    const onDocEnter = () => setIsVisible(true);
    const onTouchStart = () => setIsVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('mouseleave', onDocLeave);
    document.addEventListener('mouseenter', onDocEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mouseenter', onDocEnter);
    };
  }, [isFinePointer, shouldReduceMotion, cursorX, cursorY, isVisible]);

  // Use event delegation on document.body instead of MutationObserver
  // This is O(1) instead of O(n) listeners and never leaks
  useEffect(() => {
    if (!isFinePointer || shouldReduceMotion) return;

    const INTERACTIVE = 'A,BUTTON,INPUT,TEXTAREA,SELECT,[role="button"],.cursor-hover';

    const handleOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest?.(INTERACTIVE)) setIsHovering(true);
    };
    const handleOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest?.(INTERACTIVE)) setIsHovering(false);
    };

    document.body.addEventListener('mouseover', handleOver, { passive: true });
    document.body.addEventListener('mouseout', handleOut, { passive: true });

    return () => {
      document.body.removeEventListener('mouseover', handleOver);
      document.body.removeEventListener('mouseout', handleOut);
    };
  }, [isFinePointer, shouldReduceMotion]);

  if (!isFinePointer || shouldReduceMotion) return null;

  return (
    <>
      {/* Dot — follows mouse exactly */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 8 : 6,
            height: isHovering ? 8 : 6,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full bg-champagne-gold"
        />
      </motion.div>

      {/* Ring — follows with spring lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : 36,
            height: isHovering ? 56 : 36,
            opacity: isVisible ? 1 : 0,
            borderWidth: isHovering ? 2 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          className="rounded-full border-champagne-gold/60"
          style={{ borderStyle: 'solid', borderColor: 'rgba(207,197,178,0.5)' }}
        />
      </motion.div>
    </>
  );
}
