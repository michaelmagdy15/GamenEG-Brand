import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 1, 0]);
  const taglineOpacity = useTransform(scrollYProgress, [0.6, 0.8, 0.9], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.3, 0.9], [30, -30]);
  const taglineY = useTransform(scrollYProgress, [0.6, 0.9], [20, -20]);
  
  const productScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const productRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-gradient-to-b from-void-start to-void-end">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <motion.h1 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
            className="font-display text-[96px] md:text-[180px] text-espresso font-light leading-none opacity-5"
          >
            ÉLEGANCE
          </motion.h1>
          <motion.h1 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="font-display text-[96px] md:text-[180px] text-espresso font-light leading-none opacity-5"
          >
            TAILLÉE
          </motion.h1>
        </div>

        {/* Product Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            scale: productScale,
            opacity: productOpacity,
            rotateZ: productRotate,
          }}
        >
          {/* Wood grain background container matching Natural Tones theme */}
          <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full bg-void-end shadow-inner flex items-center justify-center border border-white/20">
            <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full bg-wood-grain shadow-2xl flex items-center justify-center border-[6px] border-champagne-gold overflow-hidden">
              <div className="absolute inset-0 bg-espresso/40 mix-blend-overlay"></div>
              {/* Wooden Watch Proxy using Unsplash */}
              <img 
                src="https://images.unsplash.com/photo-1596766442654-2c06adbbcdbf?q=80&w=2670&auto=format&fit=crop" 
                alt="GAMÉN Wooden Watch" 
                className="w-[120%] max-w-none h-auto object-cover opacity-90 drop-shadow-2xl mix-blend-multiply"
                style={{ filter: 'contrast(1.1) sepia(0.2) hue-rotate(-5deg)' }}
              />
            </div>
            
            <div className="absolute -left-20 md:-left-40 top-10 text-right space-y-4 hidden sm:block">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">Walnut Origin</p>
                <p className="font-french italic text-lg leading-tight text-espresso">Cairo Hand-Selected<br/>Ancient Timber</p>
              </div>
              <div className="h-[1px] w-24 bg-champagne-gold/30 ml-auto"></div>
            </div>

            <div className="absolute -right-20 md:-right-40 bottom-10 text-left space-y-4 hidden sm:block">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">Precision</p>
                <p className="font-french italic text-lg leading-tight text-espresso">Brass Mechanics<br/>Poli à la Main</p>
              </div>
              <div className="h-[1px] w-24 bg-champagne-gold/30 mr-auto"></div>
            </div>
          </div>
        </motion.div>

        {/* Text Fade In */}
        <div className="absolute z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-espresso font-display text-[112px] font-light mb-2 uppercase leading-none drop-shadow-md"
          >
            Gamén
          </motion.h1>
          <motion.p 
            style={{ opacity: taglineOpacity, y: taglineY }}
            className="text-espresso font-french italic text-3xl font-light drop-shadow-sm"
          >
            L'élégance taillée en bois.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-espresso/20 overflow-hidden"
        >
          <motion.div 
            className="w-full h-1/2 bg-champagne-gold"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
