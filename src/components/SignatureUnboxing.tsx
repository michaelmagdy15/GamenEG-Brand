import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const INITIALS = ['MW', 'AF', 'MF', 'YG'];

export default function SignatureUnboxing() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INITIALS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-warm-cream text-espresso py-32 lg:py-48 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-deep-walnut mb-6">
            La Signature Privée
          </p>
          <h2 className="font-header text-5xl lg:text-7xl mb-8">
            The Unboxing Experience
          </h2>
          <p className="font-french italic text-xl lg:text-3xl text-taupe">
            A bespoke presentation. Your initials, carved in history.
          </p>
        </div>

        {/* 3D Box Interactive Presentation */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
          
          {/* Left: 3D Box Model */}
          <div className="relative w-full max-w-md lg:max-w-lg aspect-square" style={{ perspective: '1200px' }}>
            <motion.div 
              initial={{ rotateX: 60, rotateZ: -45, y: 50, opacity: 0 }}
              whileInView={{ rotateX: 55, rotateZ: -35, y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative transform-style-3d"
            >
              {/* Box Base */}
              <div className="absolute inset-8 bg-deep-walnut shadow-2xl rounded-xl border border-champagne-gold/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-20 mix-blend-overlay" />
                
                {/* Velvet interior hint */}
                <div className="absolute inset-4 bg-void-start rounded-lg shadow-inner opacity-90" />
              </div>

              {/* Box Lid (Slightly open or hovering) */}
              <motion.div 
                animate={{ z: [20, 30, 20], rotateX: [-5, 0, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 bg-deep-walnut shadow-2xl rounded-xl border border-champagne-gold/30 flex items-center justify-center overflow-hidden"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-30 mix-blend-overlay" />
                
                {/* Dynamic Initials Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-champagne-gold/40 flex items-center justify-center mb-4">
                    <span className="font-display text-3xl lg:text-4xl text-champagne-gold">G</span>
                  </div>
                  
                  <div className="h-12 overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={INITIALS[currentIndex]}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-header text-4xl lg:text-5xl text-champagne-gold tracking-widest"
                      >
                        {INITIALS[currentIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Subtle lighting gradient on the lid */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </motion.div>

            </motion.div>
          </div>

          {/* Right: Content & Interaction */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8 text-center lg:text-left">
            <div>
              <h3 className="font-header text-3xl mb-4 text-espresso">
                Personalized Lid Engraving
              </h3>
              <p className="font-body text-taupe leading-relaxed">
                The La Signature Privée collection arrives in an exclusive solid walnut presentation case. The lid is precision-engraved with your initials, filled with a subtle gold alloy that catches the light.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4">
              {INITIALS.map((initial, idx) => (
                <button
                  key={initial}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-6 py-3 border text-sm font-accent tracking-widest transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'border-deep-walnut bg-deep-walnut text-warm-cream' 
                      : 'border-deep-walnut/20 text-espresso hover:border-deep-walnut/50'
                  }`}
                >
                  {initial}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-deep-walnut/10">
              <p className="font-french italic text-lg text-taupe">
                "Not just a box. A monument to your personal style."
              </p>
            </div>

            {/* Included in the Box */}
            <div className="mt-12 space-y-6">
              <h4 className="font-accent text-sm tracking-widest uppercase text-deep-walnut border-b border-deep-walnut/10 pb-2">
                Included in the Box
              </h4>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-2/3 rounded-lg overflow-hidden border border-champagne-gold/30 shadow-lg bg-deep-walnut/5 p-1">
                  <img src="/thank_you_note.png" alt="Thank You Note" className="w-full h-auto rounded" />
                </div>
                <div className="w-full sm:w-1/3 rounded-lg overflow-hidden border border-champagne-gold/30 shadow-lg bg-deep-walnut/5 p-1 flex items-center justify-center">
                  <img src="/instagram_qr.png" alt="Instagram QR" className="w-full h-auto rounded" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
