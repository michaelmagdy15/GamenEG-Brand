import { motion } from 'motion/react';

export default function HeritageSection() {
  return (
    <section className="relative bg-warm-cream text-espresso py-32 lg:py-64 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-32">
          <h2 className="font-header text-5xl lg:text-8xl mb-8">The Egyptian Soul</h2>
          <p className="font-french italic text-2xl lg:text-4xl text-taupe">One symbol. Infinite presence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="space-y-12"
          >
            <div className="aspect-[3/4] overflow-hidden bg-void-end">
              <img 
                src="https://images.unsplash.com/photo-1542247657-61fb2788e04e?q=80&w=2574&auto=format&fit=crop" 
                alt="Carving the Scarab" 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <div>
              <h3 className="font-header text-4xl mb-4">Ra'en Scarab</h3>
              <p className="font-body text-lg text-espresso/70 leading-relaxed max-w-md">
                A tribute to the sun and rebirth. Intricately carved into dark ebony, the Ra'en series grounds you in thousands of years of royal legacy, reinterpreted for the modern lapel.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="space-y-12 lg:pt-64"
          >
            <div>
              <h3 className="font-header text-4xl mb-4 text-right">Ankh Éternel</h3>
              <p className="font-body text-lg text-espresso/70 leading-relaxed max-w-md ml-auto text-right">
                The breath of life. Our signature Ankh collection marries the warmth of walnut with the eternal weight of brass. A quiet statement of endurance.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-void-start shadow-2xl relative">
               <img 
                src="https://images.unsplash.com/photo-1627448332159-25fdb5b81682?q=80&w=2670&auto=format&fit=crop" 
                alt="The Ankh" 
                className="w-full h-full object-cover saturate-50 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-walnut/40 to-transparent" />
            </div>
          </motion.div>

        </div>

        <div className="mt-48 text-center">
           <h2 className="font-display text-4xl lg:text-6xl text-taupe max-w-4xl mx-auto leading-normal">
            "Not just an accessory.<br/>Your <span className="text-espresso italic">signature</span>."
           </h2>
        </div>

      </div>
    </section>
  );
}
