import { AnimatePresence, motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { useState, useRef } from 'react';

const categories = [
  {
    id: 'classique',
    name: 'I. GΛMÉN Classiques',
    subtitle: 'Refined essentials',
    products: [
      {
        id: 'classic-walnut',
        name: 'Classic Walnut',
        image: '/Images/NEW/gamen classic.png',
        detail: 'Hand-selected walnut grain',
        accent: 'Refined essentials for distinguished style.',
      },
      {
        id: 'leclat',
        name: "L'Éclat",
        image: '/Images/NEW/l\'eclat.png',
        detail: 'Ebony wood stain with hand-oiled finish',
        accent: 'A dark, polished masterpiece with premium minimalist silhouette.',
      },
      {
        id: 'eclipse-du-bois',
        name: 'Éclipse du Bois',
        image: '/Images/NEW/eclipse du bois.png',
        detail: 'Walnut & Blonde Sycamore',
        accent: 'A study in duality — contrast carved into modern form.',
      },
    ],
  },
  {
    id: 'pharaoh',
    name: 'II. GΛMÉN Héritage',
    subtitle: 'Ceremonial brass centerpiece',
    products: [
      {
        id: 'lor-royal',
        name: "L'Or Royal",
        image: '/Images/NEW/l\'or royal.png',
        detail: 'Deep walnut & high-gloss gold centerpiece',
        accent: 'Where royal Egyptian legacy meets contemporary artistry.',
      },
      {
        id: 'ankh-eternel',
        name: 'Ankh Éternel',
        image: '/Images/NEW/ankh eternel.png',
        detail: 'Mahogany & hand-engraved brass inlay',
        accent: 'The Egyptian soul, held close with antiqued pharaonic symbols.',
      },
      {
        id: 'ra-en',
        name: "RA'EN",
        image: '/Images/NEW/ra\'en.png',
        detail: 'Antiqued brass over premium textured mahogany',
        accent: "Carved with the sun god's blessing for the bold.",
      },
    ],
  },
  {
    id: 'signature',
    name: 'III. GΛMÉN Signature',
    subtitle: 'Bespoke engravings over walnut',
    products: [
      {
        id: 'walnut-gold',
        name: 'Walnut & Gold',
        image: '/Images/NEW/gamen signature.png',
        detail: 'Walnut Wood with gold monogram',
        accent: 'Rich dark walnut base paired with a brilliant 24k gold monogram engraving.',
      },
      {
        id: 'ebony-silver',
        name: 'Ebony & Silver',
        image: '/Images/NEW/gamen signature 2.png',
        detail: 'Ebony Wood with silver monogram',
        accent: 'Deep, charcoal-toned ebony wood accented with a pristine sterling silver monogram.',
      },
      {
        id: 'sycamore-bronze',
        name: 'Sycamore & Bronze',
        image: '/Images/NEW/gamen signature 3.png',
        detail: 'Sycamore Wood with bronze monogram',
        accent: 'Golden sycamore wood adorned with a rustic, hand-polished bronze monogram.',
      },
    ],
  },
];

export default function AtelierExperience() {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [activeProductId, setActiveProductId] = useState(categories[0].products[0].id);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const activeProduct = activeCategory.products.find((p) => p.id === activeProductId) ?? activeCategory.products[0];
  const otherProducts = activeCategory.products.filter((p) => p.id !== activeProduct.id);

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

  // Stagger reveal delay
  const staggerDelay = (i: number) => ({ delay: 0.15 + i * 0.1, duration: 0.6 });

  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    const cat = categories.find((c) => c.id === catId) ?? categories[0];
    setActiveProductId(cat.products[0].id);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-deep-walnut text-champagne-gold px-4 sm:px-8 py-6 md:py-24 lg:py-32 overflow-hidden min-h-svh md:min-h-0 flex flex-col justify-center"
    >
      {/* Animated light sweep */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent,rgba(207,197,178,0.16),transparent)] animate-light-sweep pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-12 lg:gap-16 items-center w-full">
        
        {/* LEFT COLUMN — text + category selectors (Renders first at the top on mobile) */}
        <div className="flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(1)}
            className="font-header text-xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight mb-2 md:mb-6 text-warm-cream text-center lg:text-left"
          >
            Choose the center<br className="hidden lg:inline" /> of attention.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={staggerDelay(2)}
            className="font-french italic text-sm sm:text-lg lg:text-2xl text-champagne-gold/80 max-w-xl text-center lg:text-left mx-auto lg:mx-0 mb-4 md:mb-8"
          >
            Every bow tie keeps the same sculpted silhouette. The emotion changes with the emblem.
          </motion.p>

          {/* Category Tabs */}
          <div className="flex flex-col gap-2 max-w-xl mx-auto lg:mx-0 w-full">
            {categories.map((cat, i) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={staggerDelay(3 + i)}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group text-left border px-3 py-2 sm:px-4 sm:py-4 transition-all duration-300 rounded-sm relative overflow-hidden w-full ${
                    isActive
                      ? 'border-champagne-gold bg-champagne-gold text-deep-walnut scale-[1.01]'
                      : 'border-champagne-gold/15 text-champagne-gold hover:border-champagne-gold/45 hover:bg-champagne-gold/5'
                  }`}
                >
                  <span className="block font-header text-sm sm:text-xl lg:text-2xl">{cat.name}</span>
                  <span
                    className={`block font-body text-[10px] sm:text-xs mt-0.5 sm:mt-1 transition-colors ${
                      isActive ? 'text-deep-walnut/70' : 'text-champagne-gold/50'
                    }`}
                  >
                    {isActive ? activeProduct.detail : cat.subtitle}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN — active product showcase with orbital layout and responsive thumbnails */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[400px] lg:min-h-[500px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.12),transparent_60%)] pointer-events-none" />

          {/* 1. Aspect-square container for Bow Tie and Orbit Rings ONLY */}
          <div className="relative w-full max-w-[150px] sm:max-w-[280px] md:max-w-[340px] aspect-square flex items-center justify-center mx-auto">
            {/* Decorative orbit rings */}
            <motion.div
              style={{ rotate: ringRotate, willChange: 'transform' }}
              className="absolute inset-[6%] rounded-full border border-champagne-gold/10 pointer-events-none"
            />
            <motion.div
              style={{ rotate: useTransform(ringRotate, v => -v * 1.2), willChange: 'transform' }}
              className="absolute inset-[15%] rounded-full border border-champagne-gold/8 border-dashed pointer-events-none"
            />

            {/* Product image crossfade */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.85, rotateY: -15, z: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateY: 15, z: -30 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="relative z-10 flex items-center justify-center will-change-transform w-full h-full"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-[105%] max-w-none h-auto object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. Product name in natural flex flow (below the image) */}
          <div className="mt-3 md:mt-6 text-center max-w-xs px-4">
            <h3 className="text-base sm:text-xl font-header text-warm-cream tracking-wide">
              {activeProduct.name}
            </h3>
          </div>

          {/* 3. Interactive Sub-Product Thumbnails (No box frames, no text, just clean floating bow ties) */}
          <div className="relative mt-4 sm:mt-6 flex justify-center gap-6 sm:gap-8 z-20">
            {otherProducts.map((prod) => (
              <motion.button
                layout
                key={prod.id}
                onClick={() => setActiveProductId(prod.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center p-1 transition-all duration-300 w-16 sm:w-24 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold/60 rounded-md focus-visible:bg-champagne-gold/5"
                aria-label={`Switch main display to ${prod.name}`}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)] group-focus-visible:drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition-all duration-300"
                />
              </motion.button>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
