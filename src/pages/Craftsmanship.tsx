import { motion } from 'motion/react';
import { brandAssets } from '../brandAssets';

const steps = [
  {
    num: '01',
    title: 'Selection',
    text: 'Each bow tie begins with the wood. We source sustainably from trusted suppliers across Africa and Europe, selecting pieces with the most expressive grain patterns and tonal depth.',
  },
  {
    num: '02',
    title: 'Shaping',
    text: 'Using hand chisels and rotary tools, the raw block is sculpted into the iconic bow tie silhouette. No CNC machines. No templates. Every curve is guided by the natural grain of the wood.',
  },
  {
    num: '03',
    title: 'Detailing',
    text: 'Motifs like the Eye of Horus are micro-engraved by hand, then filled with sand-cast brass. Every inlay is polished individually until it sits flush with the surrounding wood surface.',
  },
  {
    num: '04',
    title: 'Finishing',
    text: 'Multiple rounds of hand-sanding (up to 2000 grit) create a surface that feels like silk. The piece is then treated with natural oils or lacquer depending on the desired finish.',
  },
  {
    num: '05',
    title: 'Assembly',
    text: 'The adjustable neckband is hand-stitched and attached. The piece is inspected under magnification for any imperfections before being placed in its presentation box.',
  },
];

export default function Craftsmanship() {
  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24">
      {/* Hero */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">The Process</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Made by <span className="italic font-light">Hand</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-8" />
          <p className="font-body text-warm-cream/60 text-sm max-w-xl mx-auto leading-relaxed">
            From raw timber to finished masterpiece, every GAMEN piece passes through over 20 stages of handcraft 
            in our Cairo atelier. Here is how each one comes to life.
          </p>
        </motion.div>
      </section>

      {/* Detail Image */}
      <section className="px-6 sm:px-10 max-w-6xl mx-auto mb-24">
        <div className="aspect-[21/9] rounded-xl overflow-hidden border border-champagne-gold/10">
          <img src={brandAssets.detailBowTieJpg} alt="GAMEN craftsmanship detail" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 sm:px-10 max-w-4xl mx-auto">
        <div className="space-y-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="flex flex-col md:flex-row gap-8 md:gap-16"
            >
              <div className="md:w-24 flex-shrink-0">
                <span className="font-header text-6xl text-champagne-gold/15">{step.num}</span>
              </div>
              <div className="flex-1 border-l border-champagne-gold/15 pl-8">
                <h3 className="font-header text-2xl text-champagne-gold mb-3">{step.title}</h3>
                <p className="font-body text-sm leading-relaxed text-warm-cream/60">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto mt-32">
        <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 text-center mb-12">Our Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Walnut', origin: 'Egypt & Turkey', note: 'Rich, warm tones with deep grain character' },
            { name: 'Mahogany', origin: 'West Africa', note: 'Dense hardwood with a reddish-brown hue' },
            { name: 'Sycamore', origin: 'Mediterranean', note: 'Light, blonde wood for contrast inlays' },
            { name: 'Brass', origin: 'Cairo Foundries', note: 'Sand-cast and hand-polished for every inlay' },
          ].map((m) => (
            <div key={m.name} className="border border-champagne-gold/10 rounded-xl p-6">
              <h4 className="font-header text-lg text-champagne-gold mb-1">{m.name}</h4>
              <span className="font-accent text-[9px] uppercase tracking-[0.15em] text-champagne-gold/40 block mb-3">{m.origin}</span>
              <p className="font-body text-xs text-warm-cream/50 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
