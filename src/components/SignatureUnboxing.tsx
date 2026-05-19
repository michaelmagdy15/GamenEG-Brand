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
            <span className="font-lambda">Λ</span> bespoke presentation. Your initials, carved in history.
          </p>
        </div>

        {/* 3D Box Interactive Presentation */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
          
          {/* Left: 3D Box Model */}
          <div className="relative w-full max-w-md lg:max-w-lg aspect-square flex items-center justify-center">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative"
            >
              {/* Opened Box Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/unboxing/gamenbox_000000_0000_gamenbox_000015.png"
                  alt="Signature Engraved Box"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Dynamic Initials Overlay */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mix-blend-screen" 
                style={{ transform: 'translateY(-25%) scale(0.85)' }}
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-champagne-gold/30 flex items-center justify-center mb-4">
                  <span className="font-display text-3xl lg:text-4xl text-champagne-gold opacity-80">G</span>
                </div>
                
                <div className="h-16 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={INITIALS[currentIndex]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="font-header text-5xl lg:text-6xl text-champagne-gold tracking-widest drop-shadow-2xl"
                    >
                      {INITIALS[currentIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

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
                "Not just a box. <span className="font-lambda">Λ</span> monument to your personal style."
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
