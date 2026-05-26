import { motion } from 'motion/react';
import { Droplets, Sun, ThermometerSun, Hand, SprayCan } from 'lucide-react';

const tips = [
  {
    icon: Hand,
    title: 'Daily Handling',
    text: 'Hold your bow tie by the edges when putting it on. Avoid touching the surface with oily or wet fingers, as natural wood absorbs oils over time.',
  },
  {
    icon: Droplets,
    title: 'Moisture',
    text: 'Wood is a living material. Avoid prolonged exposure to water, humidity, or steam. If your piece gets wet, pat it dry immediately with a soft cloth and let it air-dry naturally.',
  },
  {
    icon: Sun,
    title: 'Sunlight',
    text: 'Extended exposure to direct sunlight can cause the wood to fade or crack. Store your pieces away from windows and heat sources when not in use.',
  },
  {
    icon: ThermometerSun,
    title: 'Temperature',
    text: 'Extreme temperature changes can cause the wood to expand and contract. Avoid leaving your pieces in hot cars or near radiators.',
  },
  {
    icon: SprayCan,
    title: 'Cleaning & Conditioning',
    text: 'Wipe gently with a dry microfiber cloth after each wear. For oiled finishes, apply a small drop of natural tung oil every 3-6 months using a lint-free cloth.',
  },
];

export default function CareInstructions() {
  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">Preservation</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Care <span className="italic font-light">Guide</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-8" />
          <p className="font-body text-warm-cream/60 text-sm max-w-xl mx-auto leading-relaxed">
            Your GΛMÉN piece is crafted from natural materials that will age beautifully with proper care. 
            Follow these guidelines to preserve its character for years to come.
          </p>
        </motion.div>

        <div className="space-y-12">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl border border-champagne-gold/10"
            >
              <div className="w-12 h-12 rounded-full bg-champagne-gold/5 flex items-center justify-center flex-shrink-0">
                <tip.icon size={20} strokeWidth={1} className="text-champagne-gold/60" />
              </div>
              <div>
                <h2 className="font-header text-lg text-champagne-gold mb-2 font-semibold">{tip.title}</h2>
                <p className="font-body text-sm text-warm-cream/60 leading-relaxed">{tip.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Storage */}
        <div className="mt-20 p-8 rounded-xl bg-champagne-gold/5 border border-champagne-gold/10 text-center">
          <h2 className="font-header text-xl text-champagne-gold mb-4 font-semibold">Storage</h2>
          <p className="font-body text-sm text-warm-cream/60 leading-relaxed max-w-lg mx-auto">
            Always store your GΛMÉN piece in the included presentation box when not in use. 
            The box maintains a stable microclimate that protects the wood from humidity fluctuations and dust.
          </p>
        </div>
      </div>
    </main>
  );
}
