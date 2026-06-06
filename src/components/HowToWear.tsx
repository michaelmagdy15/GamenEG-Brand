import { motion } from 'motion/react';

export default function HowToWear() {
  return (
    <section id="how-to-use" className="relative bg-deep-walnut text-warm-cream py-24 sm:py-32 px-6 sm:px-10 print:bg-white print:text-black">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.06),transparent_65%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-champagne-gold mb-6 print:text-gray-500">The Ritual</p>
          <h2 className="font-header text-4xl sm:text-5xl lg:text-6xl mb-6 text-champagne-gold leading-tight">How to Wear</h2>
          <p className="font-french italic text-xl text-champagne-gold/80 print:text-gray-700">A seamless connection between craft and collar.</p>
        </div>

        {/* Guide Image Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full rounded-2xl border border-champagne-gold/25 bg-warm-cream/5 p-4 sm:p-8 overflow-hidden flex justify-center items-center shadow-2xl backdrop-blur-sm"
        >
          <img 
            src="/how_to_wear_guide.png" 
            alt="How to Wear Guide" 
            className="w-full h-auto max-w-4xl rounded-xl object-contain shadow-lg border border-champagne-gold/10"
          />
        </motion.div>

        {/* Print Button */}
        <div className="mt-16 text-center print:hidden">
          <p className="font-french italic text-lg text-champagne-gold/80 mb-8">Prefer a physical guide? Print your instruction card.</p>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-4 text-champagne-gold font-accent text-[10px] tracking-[0.2em] uppercase px-8 py-4 border border-champagne-gold/30 hover:border-champagne-gold transition-colors"
          >
            <span>Print Instruction Card</span>
            <span className="h-px w-8 bg-champagne-gold transition-all group-hover:w-12" />
          </button>
        </div>
      </div>
    </section>
  );
}
