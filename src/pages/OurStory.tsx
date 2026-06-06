import { motion } from 'motion/react';
import { Landmark, PenTool, Fingerprint } from 'lucide-react';

export default function OurStory() {
  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24">
      {/* Hero */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto text-center mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
        >
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">Our Origin</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Our <span className="italic font-light">Story</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-8" />
          <p className="font-body text-warm-cream/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Born and raised in Cairo, Egypt, GΛMÉN began in May 2025 from a simple yet powerful belief: accessories should carry identity, not just aesthetics.
          </p>
        </motion.div>
      </section>

      {/* Signature Spin GIF Showcase */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto mb-24 h-[50vh] sm:h-[70vh]">
        <div className="w-full h-full rounded-xl overflow-hidden border border-champagne-gold/10 bg-warm-cream/5 relative flex items-center justify-center p-8 group">
          {/* Ambient lighting / luxury gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.11),transparent_70%)] blur-3xl pointer-events-none" />
          
          <motion.div 
            whileHover={{ scale: 1.04, rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="w-full h-full max-w-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <img
              src="/Images/bowtie 3d spin/BOWSPIN.gif"
              alt="GΛMÉN Signature Bow Tie Rotation"
              className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] filter contrast-125 saturate-105"
              style={{ clipPath: 'inset(0% 3% 0% 3%)' }}
            />
          </motion.div>

        </div>
      </section>

      {/* Narrative Section */}
      <section className="px-6 sm:px-10 max-w-4xl mx-auto mb-32">
        <div className="space-y-16 text-warm-cream/70 font-body text-sm sm:text-base leading-relaxed">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-start"
          >
            <div className="md:col-span-4 font-display text-lg sm:text-xl text-champagne-gold font-light tracking-wide md:text-right pt-0.5">
              Inspired Heritage
            </div>
            <div className="md:col-span-8">
              <p>
                Inspired by the richness of Egyptian heritage and the elegance of contemporary luxury, the brand was created to transform timeless craftsmanship into modern statement pieces. What started as a personal vision in a small Cairo workshop soon evolved into an obsession with detail, material, and design.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-start"
          >
            <div className="md:col-span-4 font-display text-lg sm:text-xl text-champagne-gold font-light tracking-wide md:text-right pt-0.5">
              The Woodcraft Philosophy
            </div>
            <div className="md:col-span-8">
              <p>
                The first GΛMÉN bow tie was carved from a single piece of Beech wood, a moment that defined the philosophy of the brand. Every curve, texture, and finish was designed to express individuality, confidence, and sophistication.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-start"
          >
            <div className="md:col-span-4 font-display text-lg sm:text-xl text-champagne-gold font-light tracking-wide md:text-right pt-0.5">
              Bridging Centuries
            </div>
            <div className="md:col-span-8">
              <p>
                Rooted in one of the world’s oldest civilizations, GΛMÉN bridges centuries of artistry with modern refinement. Our creations blend sculptural design, natural materials, and understated luxury to create pieces that feel both timeless and distinctive.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-start"
          >
            <div className="md:col-span-4 font-display text-lg sm:text-xl text-champagne-gold font-light tracking-wide md:text-right pt-0.5">
              Wearable Expressions
            </div>
            <div className="md:col-span-8">
              <p>
                More than accessories, GΛMÉN pieces are wearable expressions of character, crafted for individuals who understand that true luxury lives in the details.
              </p>
            </div>
          </motion.div>
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
