import { motion } from 'motion/react';
import { brandAssets } from '../brandAssets';

export default function HeritageSection() {
  return (
    <section className="relative bg-warm-cream text-espresso py-32 lg:py-48 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-24 h-[78%] w-px bg-deep-walnut/10 hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-32">
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-deep-walnut mb-6">Heritage Marks</p>
          <h2 className="font-header text-5xl lg:text-8xl mb-8">The Egyptian Soul</h2>
          <p className="font-french italic text-2xl lg:text-4xl text-taupe">One symbol. Infinite presence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          {[
            {
              title: 'Pharaoh Seal',
              copy: 'A tribute to kingship and ceremony. Polished brass sits over dark walnut, giving a formal accessory the gravity of an heirloom.',
              image: brandAssets.pharaohBowTie,
            },
            {
              title: 'Eye of Horus',
              copy: 'Protection and precision meet in a carved wooden silhouette. The brass centerpiece catches light without raising its voice.',
              image: brandAssets.ankhBowTie,
            },
          ].map((symbol, index) => (
            <motion.div
              key={symbol.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group space-y-12 ${index === 1 ? 'lg:pt-64' : ''}`}
            >
              {index === 1 && (
                <div className="hidden lg:block">
                  <h3 className="font-header text-4xl mb-4 text-right">{symbol.title}</h3>
                  <p className="font-body text-lg text-espresso/70 leading-relaxed max-w-md ml-auto text-right">{symbol.copy}</p>
                </div>
              )}

              <div className="aspect-[3/4] lg:aspect-[4/3] overflow-hidden bg-espresso relative">
                <img
                  src={symbol.image}
                  alt={`${symbol.title} bow tie`}
                  className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className={index === 1 ? 'lg:hidden' : ''}>
                <h3 className="font-header text-4xl mb-4">{symbol.title}</h3>
                <p className="font-body text-lg text-espresso/70 leading-relaxed max-w-md">{symbol.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-48 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl lg:text-6xl text-taupe max-w-4xl mx-auto leading-normal">
            "Not just an accessory.<br />Your <span className="text-espresso italic">signature</span>."
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
