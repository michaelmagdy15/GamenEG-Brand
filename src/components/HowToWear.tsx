import { motion } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    title: 'Preparation',
    description: 'Ensure your top collar button is securely fastened. The GΛMÉN bow tie is designed to sit perfectly against standard dress shirt collars.',
    videoPlaceholder: 'Animation: Collar button close-up',
  },
  {
    title: 'Placement',
    description: 'Hold the bow tie by its wooden wings. Align the stainless steel back clip with the thread of your top button.',
    videoPlaceholder: 'Animation: Aligning the back clip',
  },
  {
    title: 'Attachment',
    description: 'Slide the clip gently downward over the button. It will lock into place with a subtle, secure click.',
    videoPlaceholder: 'Animation: Sliding down to lock',
  },
];

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

        {/* Step-by-Step Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-full aspect-[4/5] bg-deep-walnut/40 border border-champagne-gold/20 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden print:border-gray-300 print:bg-gray-50">
                {/* Placeholder for Video/3D Animation */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-champagne-gold/50 font-accent text-xs tracking-widest uppercase text-center print:text-gray-400">
                  [{step.videoPlaceholder}]
                </div>
                {/* Overlay gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-void-start/80 to-transparent opacity-60 print:hidden" />
                
                {/* Step Number Badge */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full border border-champagne-gold/30 flex items-center justify-center bg-void-start/50 backdrop-blur-md print:bg-white print:border-gray-400">
                  <span className="font-display text-champagne-gold text-sm print:text-black">{index + 1}</span>
                </div>
              </div>

              <h3 className="font-header text-3xl mb-4 text-champagne-gold print:text-black">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-taupe print:text-gray-700">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

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
