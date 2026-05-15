import { AnimatePresence, motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { useState, useRef } from 'react';
import { brandAssets } from '../brandAssets';

const pieces = [
  {
    id: 'signature',
    name: 'GAMÉN Signature',
    detail: 'Brass monogram over dark walnut',
    image: brandAssets.heroBowTie,
    accent: 'The original. Where it all began.',
  },
  {
    id: 'pharaoh',
    name: 'Pharaoh Seal',
    detail: 'A ceremonial brass centerpiece',
    image: brandAssets.pharaohBowTie,
    accent: 'Inspired by ancient thrones.',
  },
  {
    id: 'horus',
    name: 'Eye of Horus',
    detail: 'Ancient symbolism in polished brass',
    image: brandAssets.ankhBowTie,
    accent: 'Protection meets precision.',
  },
];

export default function AtelierExperience() {
  const [activeId, setActiveId] = useState(pieces[0].id);
  const activePiece = pieces.find((piece) => piece.id === activeId) ?? pieces[0];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Scroll-based parallax for decorative elements
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const bgShift = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Stagger reveal for left column
  const staggerDelay = (i: number) => ({ delay: 0.15 + i * 0.12, duration: 0.7 });

  return (
    <section
      ref={sectionRef}
      className="relative bg-deep-walnut text-champagne-gold px-4 sm:px-8 py-28 lg:py-36 overflow-hidden"
    >
      {/* Animated light sweep */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent,rgba(207,197,178,0.16),transparent)] animate-light-sweep" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-24 items-center">

        {/* LEFT COLUMN — text + selectors with scroll reveal */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(0)}
            className="font-accent text-[10px] uppercase tracking-[0.28em] mb-6 text-champagne-gold/60"
          >
            Interactive Atelier
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(1)}
            className="font-header text-4xl sm:text-5xl lg:text-7xl leading-none mb-8 text-warm-cream"
          >
            Choose the center<br />of attention.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(2)}
            className="font-french italic text-xl sm:text-2xl lg:text-3xl text-champagne-gold/70 max-w-xl"
          >
            Every bow tie keeps the same sculpted silhouette. The emotion changes with the emblem.
          </motion.p>

          {/* Selection buttons — stagger in */}
          <div className="mt-12 grid gap-3 max-w-xl">
            {pieces.map((piece, i) => (
              <motion.button
                key={piece.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={staggerDelay(3 + i)}
                onClick={() => setActiveId(piece.id)}
                className={`group text-left border px-5 py-4 transition-all duration-300 ${
                  activeId === piece.id
                    ? 'border-champagne-gold bg-champagne-gold text-deep-walnut scale-[1.02]'
                    : 'border-champagne-gold/20 text-champagne-gold hover:border-champagne-gold/50 hover:bg-champagne-gold/5'
                }`}
              >
                <span className="block font-header text-xl sm:text-2xl">{piece.name}</span>
                <span
                  className={`block font-body text-sm mt-1 transition-colors ${
                    activeId === piece.id ? 'text-deep-walnut/70' : 'text-champagne-gold/50'
                  }`}
                >
                  {piece.detail}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — product showcase with orbit rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[420px] lg:min-h-[580px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.18),transparent_58%)]" />

          <motion.div style={{ y: bgShift }} className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            {/* Decorative orbit rings — scroll-driven */}
            <motion.div
              style={{ rotate: ringRotate }}
              className="absolute inset-[8%] rounded-full border border-champagne-gold/15"
            />
            <motion.div
              style={{ rotate: useTransform(ringRotate, v => -v * 1.3) }}
              className="absolute inset-[18%] rounded-full border border-champagne-gold/12 border-dashed"
            />
            <div className="absolute inset-[27%] rounded-full border border-champagne-gold/8" />

            {/* Product image with AnimatePresence crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePiece.id}
                initial={{ opacity: 0, scale: 0.82, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.82, rotateY: 15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center"
                style={{ perspective: '800px' }}
              >
                <img
                  src={activePiece.image}
                  alt={activePiece.name}
                  className="w-[110%] max-w-none h-auto object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
                />
                {/* Accent text under product */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-6 font-french italic text-lg text-champagne-gold/50 text-center"
                >
                  {activePiece.accent}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
