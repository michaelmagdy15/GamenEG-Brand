import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products, type ProductCategory } from '../data/products';

const filters: { label: string; value: 'all' | ProductCategory }[] = [
  { label: 'All Pieces', value: 'all' },
  { label: 'Bow Ties', value: 'bow-tie' },
  { label: 'Timepieces', value: 'watch' },
];

export default function Shop() {
  const [active, setActive] = useState<'all' | ProductCategory>('all');
  const filtered = active === 'all' ? products : products.filter(p => p.category === active);

  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] text-champagne-gold tracking-tighter mb-4">
            The <span className="italic font-light">Collection</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-6" />
          <p className="font-body text-warm-cream/60 text-sm max-w-md mx-auto">
            Every piece hand-carved from nature. Every detail considered.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-8 mb-16">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`font-accent text-[10px] uppercase tracking-[0.2em] transition-colors pb-2 border-b ${
                active === f.value
                  ? 'text-champagne-gold border-champagne-gold'
                  : 'text-warm-cream/40 border-transparent hover:text-warm-cream/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={`/product/${product.slug}`} className="group block">
                <div className="aspect-square rounded-xl mb-5 relative group" style={{ perspective: '1000px' }}>
                  <div className="relative w-full h-full rounded-xl border border-champagne-gold/10 bg-gradient-to-br from-warm-cream/5 to-warm-cream/10 transform-style-3d">
                    {/* The Product Inside */}
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* The Box Lid */}
                    <div
                      style={{ transformOrigin: 'left center' }}
                      className="absolute inset-0 bg-deep-walnut border border-champagne-gold/20 rounded-xl z-10 shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(-105deg)]"
                    >
                      <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-20 mix-blend-overlay pointer-events-none" />
                      <div className="w-12 h-12 rounded-full border border-champagne-gold/30 flex items-center justify-center transition-transform duration-700 group-hover:scale-90">
                        <span className="font-display text-lg text-champagne-gold">G</span>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-espresso/10 transition-opacity group-hover:opacity-0 pointer-events-none rounded-xl" />
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-header text-lg text-champagne-gold group-hover:text-warm-cream transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs text-warm-cream/40 mt-1">{product.wood}</p>
                  </div>
                  <span className="font-accent text-sm text-champagne-gold/70">${product.price}</span>
                </div>

                <p className="font-french italic text-sm text-champagne-gold/50 mt-2">{product.tagline}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
