import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.1], [0, 0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      style={{ opacity }}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full border border-champagne-gold/30 bg-deep-walnut/80 backdrop-blur-sm flex items-center justify-center text-champagne-gold hover:bg-champagne-gold hover:text-deep-walnut transition-colors duration-300 group"
      aria-label="Back to top"
    >
      <ArrowUp
        size={18}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </motion.button>
  );
}
