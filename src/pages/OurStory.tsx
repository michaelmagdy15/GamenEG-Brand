import { motion } from 'motion/react';
import { Landmark, PenTool, Fingerprint } from 'lucide-react';
import { PresentationControls } from '@react-three/drei';
import { BowTieModel } from '../components/canvas/BowTieModel';
import OptimizedCanvas from '../components/canvas/OptimizedCanvas';
import { brandAssets } from '../brandAssets';

const story = [
  {
    year: '2023',
    title: 'The First Cut',
    text: 'In the beating heart of Cairo, Egypt, the first GΛMÉN bow tie was carved from a single piece of walnut in a small workshop. What began as a personal project became an obsession with the intersection of Egyptian heritage and modern luxury.',
  },
  {
    year: '2024',
    title: 'The Craft Deepens',
    text: 'The collection expanded with Egyptian motifs -- the Eye of Horus, pharaonic geometry -- hand-engraved into brass and inlaid into exotic woods. Each piece became a story told through material.',
  },
  {
    year: '2025',
    title: 'Beyond the Bow Tie',
    text: 'The GΛMÉN Epoque timepiece launched, extending our woodcraft philosophy to the wrist. The vision crystallised: not a brand, but a movement -- where ancient craft meets contemporary identity.',
  },
];

export default function OurStory() {
  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24">
      {/* Hero */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-50px' }} transition={{ duration: 0.8 }}>
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">Our Origin</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Carved from <span className="italic font-light">Heritage</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-8" />
          <p className="font-body text-warm-cream/60 text-sm max-w-xl mx-auto leading-relaxed">
            Born and raised in Cairo, Egypt -- GΛMÉN grew from a simple belief: that accessories should carry the weight of identity, not just aesthetics. 
            Rooted in the heart of one of the world's oldest civilisations, every piece we create bridges thousands of years of Egyptian craftsmanship with the quiet confidence of modern luxury.
          </p>
        </motion.div>
      </section>

      {/* 3D Model Display */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto mb-24 h-[50vh] sm:h-[70vh]">
        <div className="w-full h-full rounded-xl overflow-hidden border border-champagne-gold/10 bg-warm-cream/5 relative">
          <OptimizedCanvas
            frameloop="always"
            camera={{ position: [0, 0, 4], fov: 45 }}
            className="absolute inset-0"
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.4} />
            <directionalLight position={[-5, -3, -2]} intensity={0.3} />
            <PresentationControls
              global
              rotation={[0.1, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              snap={true}
            >
              <BowTieModel autoRotate />
            </PresentationControls>
          </OptimizedCanvas>
          <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
            <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-champagne-gold/50">Interactive 3D View</span>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 sm:px-10 max-w-4xl mx-auto">
        <div className="space-y-20">
          {story.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-8 md:gap-16"
            >
              <div className="md:w-32 flex-shrink-0">
                <span className="font-header text-5xl text-champagne-gold/20">{item.year}</span>
              </div>
              <div className="flex-1 border-l border-champagne-gold/15 pl-8">
                <h2 className="font-header text-2xl text-champagne-gold mb-3 font-semibold">{item.title}</h2>
                <p className="font-body text-sm leading-relaxed text-warm-cream/60">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values with Wood Grain Feel */}
      <section className="relative mt-32 py-24 px-6 sm:px-10 overflow-hidden">
        {/* Wood grain background and overlays */}
        <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-walnut via-transparent to-deep-walnut pointer-events-none" />
        <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 text-center mb-16">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              { 
                title: 'Heritage', 
                icon: Landmark,
                text: 'Every motif we use carries millennia of meaning. We do not borrow aesthetics -- we honour lineage.' 
              },
              { 
                title: 'Craft', 
                icon: PenTool,
                text: 'No machines decide our curves. Every piece is hand-carved, hand-sanded, and hand-finished by artisans.' 
              },
              { 
                title: 'Identity', 
                icon: Fingerprint,
                text: 'A GΛMÉN piece is not decoration. It is a declaration -- a quiet signal of taste that cannot be replicated.' 
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full border border-champagne-gold/20 flex items-center justify-center mb-6 text-champagne-gold/60 group-hover:text-champagne-gold group-hover:border-champagne-gold/40 transition-colors duration-500">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-header text-xl text-champagne-gold mb-4 font-semibold">{v.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-warm-cream/60 max-w-xs">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
