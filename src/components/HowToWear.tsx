import { motion } from 'motion/react';
import { useRef } from 'react';



export default function HowToWear() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section 
      ref={containerRef} 
      className="relative bg-void-start text-warm-cream py-32 lg:py-48 overflow-hidden print:bg-white print:text-black print:py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 print:mb-12">
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-champagne-gold mb-6 print:text-gray-500">
            The Ritual
          </p>
          <h2 className="font-header text-5xl lg:text-7xl mb-8 print:text-4xl">
            How to Wear
          </h2>
          <p className="font-french italic text-xl lg:text-3xl text-taupe print:text-gray-700">
            A seamless connection between craft and collar.
          </p>
        </div>

        {/* Visual Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center max-w-4xl mx-auto"
        >
          <div className="w-full bg-deep-walnut/20 border border-champagne-gold/20 p-4 lg:p-12 rounded-xl print:border-none print:p-0 print:bg-transparent">
            <img 
              src="/how_to_wear_guide.png" 
              alt="How to wear guide" 
              className="w-full h-auto rounded-lg shadow-2xl print:shadow-none"
            />
          </div>
        </motion.div>

        {/* Print / Download Card Button (Hidden on print) */}
        <div className="mt-32 text-center print:hidden flex flex-col items-center justify-center">
          <p className="font-french italic text-lg text-taupe mb-8">
            Prefer a physical guide? Print your instruction card.
          </p>
          <button 
            onClick={handlePrint}
            className="group flex items-center gap-4 text-champagne-gold font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-8 py-4 border border-champagne-gold/30 hover:border-champagne-gold transition-colors"
          >
            <span className="relative z-10">Print Instruction Card</span>
            <span className="relative z-10 h-px w-8 bg-champagne-gold transition-all group-hover:w-12" />
          </button>
        </div>

      </div>

      {/* Decorative Print-only Footer */}
      <div className="hidden print:block text-center mt-16 pt-8 border-t border-gray-200">
        <p className="font-display text-2xl">GΛMÉN</p>
        <p className="font-accent text-[10px] uppercase tracking-widest text-gray-500 mt-2">
          Cairo, Egypt
        </p>
      </div>

    </section>
  );
}
