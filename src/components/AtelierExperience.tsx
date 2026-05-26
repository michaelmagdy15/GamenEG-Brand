import { AnimatePresence, motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { useState, useRef } from 'react';
import { brandAssets } from '../brandAssets';

const pieces = [
  {
    id: 'classique',
    name: 'I. GΛMÉN Classiques',
    detail: 'Refined essentials',
    image: brandAssets.gamenClassique,
    accent: 'Refined essentials for distinguished style.',
  },
  {
    id: 'pharaoh',
    name: 'II. GΛMÉN Héritage',
    detail: 'Ceremonial brass centerpiece',
    image: brandAssets.pharaohBowTie,
    accent: 'Where royal legacy meets contemporary artistry.',
  },
  {
    id: 'signature',
    name: 'III. GΛMÉN Signature',
    detail: 'Brass monogram over dark walnut',
    image: brandAssets.signatureBowTie,
    accent: 'A signature of individuality and prestige.',
  },
];

const signatureEngravings = [
  {
    id: 'walnut',
    name: 'Walnut & Gold',
    material: 'Walnut Wood',
    accentColor: 'Gold Monogram',
    image: brandAssets.heroBowTie,
    description: 'Rich dark walnut base paired with a brilliant 24k gold monogram engraving.',
  },
  {
    id: 'ebony',
    name: 'Ebony & Silver',
    material: 'Ebony Wood',
    accentColor: 'Silver Monogram',
    image: brandAssets.darkClassicBowTie,
    description: 'Deep, charcoal-toned ebony wood accented with a pristine sterling silver monogram.',
  },
  {
    id: 'sycamore',
    name: 'Sycamore & Bronze',
    material: 'Sycamore Wood',
    accentColor: 'Bronze Monogram',
    image: brandAssets.twoToneBowTie,
    description: 'Golden sycamore wood adorned with a rustic, hand-polished bronze monogram.',
  },
] as const;

export default function AtelierExperience() {
  const [activeId, setActiveId] = useState(pieces[0].id);
  const [selectedEngraving, setSelectedEngraving] = useState<'walnut' | 'ebony' | 'sycamore'>('walnut');

  const basePiece = pieces.find((piece) => piece.id === activeId) ?? pieces[0];
  const isSignatureActive = activeId === 'signature';
  
  const currentEngraving = signatureEngravings.find(e => e.id === selectedEngraving) ?? signatureEngravings[0];
  
  const activePiece = {
    ...basePiece,
    image: isSignatureActive ? currentEngraving.image : basePiece.image,
    detail: isSignatureActive ? `${currentEngraving.material} with ${currentEngraving.accentColor.toLowerCase()}` : basePiece.detail,
    accent: isSignatureActive ? currentEngraving.description : basePiece.accent,
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });

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
      className="relative bg-deep-walnut text-champagne-gold px-4 sm:px-8 py-8 md:py-28 lg:py-36 overflow-hidden min-h-[100vh] md:min-h-0 flex flex-col justify-center"
    >
      {/* Animated light sweep */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent,rgba(207,197,178,0.16),transparent)] animate-light-sweep" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-4 md:gap-16 lg:gap-24 items-center w-full">

        {/* LEFT COLUMN — text + selectors with scroll reveal */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(1)}
            className="font-header text-2xl sm:text-5xl lg:text-7xl leading-none mb-4 md:mb-8 text-warm-cream text-center md:text-left"
          >
            Choose the center<br className="hidden sm:inline" /> of attention.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(2)}
            className="font-french italic text-base sm:text-2xl lg:text-3xl text-champagne-gold max-w-xl text-center md:text-left mx-auto md:mx-0"
          >
            Every bow tie keeps the same sculpted silhouette. The emotion changes with the emblem.
          </motion.p>

          {/* Selection buttons — horizontal/wrap on mobile, vertical grid on desktop */}
          <div className="mt-6 md:mt-12 flex flex-col sm:flex-row sm:flex-wrap md:grid gap-3 max-w-xl justify-center md:justify-start">
            {pieces.map((piece, i) => {
              const isActive = activeId === piece.id;
              
              if (piece.id === 'signature' && isActive) {
                return (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={staggerDelay(3 + i)}
                    className="text-left border px-5 py-4 border-champagne-gold bg-champagne-gold text-deep-walnut scale-[1.02] transition-all duration-300 rounded w-full"
                  >
                    <span className="block font-header text-xl sm:text-2xl">{piece.name}</span>
                    <span className="block font-body text-sm mt-1 text-deep-walnut/70">
                      {activePiece.detail}
                    </span>
                    
                    {/* Exquisite bespoke engraving options */}
                    <div className="mt-4 pt-4 border-t border-deep-walnut/15">
                      <p className="font-accent text-[9px] uppercase tracking-wider mb-2 text-deep-walnut/60 font-semibold">
                        Bespoke Engravings:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {signatureEngravings.map((engr) => (
                          <button
                            key={engr.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEngraving(engr.id);
                            }}
                            className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${
                              selectedEngraving === engr.id
                                ? 'bg-deep-walnut text-champagne-gold border-deep-walnut font-bold'
                                : 'bg-transparent text-deep-walnut/80 border-deep-walnut/20 hover:border-deep-walnut/40'
                            }`}
                          >
                            {engr.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.button
                  key={piece.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={staggerDelay(3 + i)}
                  onClick={() => setActiveId(piece.id)}
                  className={`group text-left border px-5 py-4 transition-all duration-300 rounded flex-1 sm:flex-initial ${
                    isActive
                      ? 'border-champagne-gold bg-champagne-gold text-deep-walnut scale-[1.02]'
                      : 'border-champagne-gold/20 text-champagne-gold hover:border-champagne-gold/50 hover:bg-champagne-gold/5'
                  }`}
                >
                  <span className="block font-header text-xl sm:text-2xl">{piece.name}</span>
                  <span
                    className={`block font-body text-sm mt-1 transition-colors ${
                      isActive ? 'text-deep-walnut/70' : 'text-champagne-gold/50'
                    }`}
                  >
                    {piece.detail}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN — product showcase with orbit rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[220px] md:min-h-[420px] lg:min-h-[580px] flex items-center justify-center mt-4 md:mt-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.18),transparent_58%)]" />

          <motion.div style={{ y: bgShift }} className="relative w-full max-w-[280px] md:max-w-2xl aspect-square flex items-center justify-center mx-auto">
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
                key={activePiece.id + (activeId === 'signature' ? '-' + selectedEngraving : '')}
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
                  className="mt-3 md:mt-6 font-french italic text-sm md:text-lg text-champagne-gold/80 text-center"
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
