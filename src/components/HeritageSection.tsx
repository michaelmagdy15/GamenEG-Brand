import { motion } from 'motion/react';
import { brandAssets } from '../brandAssets';

// Generate a random array of hieroglyphs for the background texture
// Unicode range for Egyptian Hieroglyphs is roughly 13000-1342F
// We will use a smaller subset that renders well
const HIEROGLYPHS = '𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓𓀔𓀕𓀖𓀗𓀘𓀙𓀚𓀛𓀜𓀝𓀞𓀟𓀠𓀡𓀢𓀣𓀤𓀥𓀦𓀧𓀨𓀩𓀪𓀫𓀬𓀭𓀮𓀯';

const generateHieroglyphRows = (rows: number, cols: number) => {
  const result = [];
  for (let i = 0; i < rows; i++) {
    let row = '';
    for (let j = 0; j < cols; j++) {
      row += HIEROGLYPHS.charAt(Math.floor(Math.random() * HIEROGLYPHS.length));
    }
    result.push(row);
  }
  return result;
};

export default function HeritageSection() {
  // 15 rows, 30 columns to fill the background
  const hieroglyphRows = generateHieroglyphRows(15, 30);

  return (
    <section className="relative bg-warm-cream text-espresso py-32 lg:py-48 overflow-hidden">
      {/* Animated Hieroglyphic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] overflow-hidden flex flex-col justify-between" aria-hidden="true">
        {hieroglyphRows.map((row, index) => (
          <motion.div
            key={index}
            className="whitespace-nowrap font-serif text-[4rem] tracking-[1em] text-deep-walnut leading-none select-none"
            initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0.3 }}
            animate={{ x: index % 2 === 0 ? 0 : -50, opacity: [0.3, 0.7, 0.3] }}
            transition={{
              x: { duration: 40 + index * 5, repeat: Infinity, ease: "linear", repeatType: "mirror" },
              opacity: { duration: 10 + index * 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {row}
          </motion.div>
        ))}
        {/* Gradient overlay to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-warm-cream via-transparent to-warm-cream" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-transparent to-warm-cream" />
      </div>

      <motion.div
        className="absolute left-1/2 top-24 h-[78%] w-px bg-deep-walnut/10 hidden lg:block z-10"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
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
              viewport={{ once: false, margin: '-15%' }}
              transition={{ type: 'spring', stiffness: 60, damping: 20, delay: index * 0.15 }}
              className={`group space-y-12 ${index === 1 ? 'lg:pt-64' : ''}`}
            >
              {index === 1 && (
                <div className="hidden lg:block">
                  <h3 className="font-header text-4xl mb-4 text-right">{symbol.title}</h3>
                  <p className="font-body text-lg text-espresso/70 leading-relaxed max-w-md ml-auto text-right">{symbol.copy}</p>
                </div>
              )}

              <div className="aspect-[3/4] lg:aspect-[4/3] overflow-hidden bg-espresso relative shadow-2xl">
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
          viewport={{ once: false, margin: '-10%' }}
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
