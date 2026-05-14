import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function DetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Layer explosion
  const layer1Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -150, -150]);
  const layer2Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 0, 0]);
  const layer3Y = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 150, 150]);

  const layer1Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const layer2Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const layer3Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [1, 0, 0, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-espresso text-warm-cream">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div style={{ opacity: titleOpacity }} className="absolute z-50 pointer-events-none text-center">
          <h2 className="font-header text-5xl md:text-7xl mb-4">Precision Deconstructed</h2>
          <p className="font-french italic text-champagne-gold text-2xl md:text-3xl">Not just an accessory. An architecture.</p>
        </motion.div>

        <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
          
          {/* Top Layer: Wood Shell */}
          <motion.div 
            style={{ y: layer1Y, opacity: layer1Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute right-0 translate-x-32 w-64 text-left">
              <div className="w-12 h-[1px] bg-champagne-gold mb-4" />
              <h4 className="font-accent tracking-widest text-champagne-gold mb-2 text-sm">THE SHELL</h4>
              <p className="font-body text-sm text-warm-cream/70">Aged walnut, precisely milled down to 0.2mm tolerance for a seamless grain wrap.</p>
            </div>
            {/* Visual proxy for wood shell */}
            <div className="w-64 h-64 border-[3px] border-champagne-gold/30 rounded-full bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=600&auto=format&fit=crop')] bg-cover mix-blend-screen opacity-50" />
          </motion.div>

          {/* Middle Layer: Mechanism */}
          <motion.div 
            style={{ y: layer2Y, opacity: layer2Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute left-0 -translate-x-32 w-64 text-right">
              <div className="w-12 h-[1px] bg-warm-cream ml-auto mb-4" />
              <h4 className="font-accent tracking-widest text-warm-cream mb-2 text-sm">THE HEART</h4>
              <p className="font-body text-sm text-warm-cream/70">Exposed mechanical movement or structural spine, engineered to distribute tension evenly.</p>
            </div>
            {/* Visual proxy for mechanism */}
            <div className="w-56 h-56 rounded-full border border-warm-cream/20 bg-deep-walnut/80 flex items-center justify-center backdrop-blur-sm shadow-2xl">
              <div className="w-48 h-48 border border-champagne-gold/10 rounded-full border-dashed animate-spin-slow" />
            </div>
          </motion.div>

          {/* Bottom Layer: Clasp/Metal */}
          <motion.div 
            style={{ y: layer3Y, opacity: layer3Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute right-0 translate-x-32 w-64 text-left translate-y-24">
              <div className="w-12 h-[1px] bg-champagne-gold mb-4" />
              <h4 className="font-accent tracking-widest text-champagne-gold mb-2 text-sm">THE CLASP</h4>
              <p className="font-body text-sm text-warm-cream/70">Solid brass hardware, custom cast to secure the piece with a definitive click.</p>
            </div>
            {/* Visual proxy for clasp */}
            <div className="w-64 h-64 border border-champagne-gold rounded-full bg-champagne-gold/10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
