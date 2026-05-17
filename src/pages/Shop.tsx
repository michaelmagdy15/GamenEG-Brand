import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import type { ProductCollection } from '../data/products';
import { useProductsContext } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

const HIEROGLYPHS = '𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓𓀔𓀕𓀖𓀗𓀘𓀙𓀚𓀛𓀜𓀝𓀞𓀟𓀠𓀡𓀢𓀣𓀤𓀥𓀦𓀧𓀨𓀩𓀪𓀫𓀬𓀭𓀮𓀯';
const hieroglyphRows = Array.from({ length: 10 }, () =>
  Array.from({ length: 28 }, () => HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]).join('')
);

const collectionTitles: Record<ProductCollection, { title: string; subtitle: string }> = {
  classique: { 
    title: 'La Maison Classique', 
    subtitle: 'The timeless modern classics' 
  },
  heritage: { 
    title: 'Les Héritiers du Nil', 
    subtitle: 'The Heirs of the Nile — inspired by Egyptian royalty & mythology' 
  },
  signature: { 
    title: 'La Signature Privée', 
    subtitle: 'The Private Signature — personalized bespoke pieces' 
  },
  watches: { 
    title: 'GΛMÉN Horlogerie', 
    subtitle: 'Precision instruments of time and wood' 
  },
};

export default function Shop() {
  const { addItem } = useCart();
  const { products, loading } = useProductsContext();
  
  // Signature first — client requirement: bespoke tier shown prominently at top
  const collections: ProductCollection[] = ['signature', 'classique', 'heritage', 'watches'];
  const heritageSectionRef = useRef<HTMLElement>(null);

  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] text-champagne-gold tracking-tighter mb-4">
            The <span className="italic font-light">Collection</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-6" />
          <p className="font-body text-warm-cream/60 text-sm max-w-md mx-auto uppercase tracking-widest">
            Hand-carved excellence. Egyptian soul.
          </p>
        </motion.div>

        {/* Collections */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-16 h-16 border-t-2 border-champagne-gold border-solid rounded-full animate-spin"></div>
          </div>
        ) : collections.map((colKey) => {
          const collectionProducts = products.filter(p => p.collection === colKey);
          if (collectionProducts.length === 0) return null;

          const isHeritage = colKey === 'heritage';

          return (
            <section
              key={colKey}
              ref={isHeritage ? heritageSectionRef : undefined}
              className={`mb-32 last:mb-0 relative ${
                isHeritage ? 'rounded-2xl overflow-hidden py-16 px-6 sm:px-10 -mx-6 sm:-mx-10 bg-warm-cream' : ''
              }`}
            >
              {/* Heritage: animated hieroglyphic background */}
              {isHeritage && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                  {hieroglyphRows.map((row, idx) => (
                    <motion.div
                      key={idx}
                      className="whitespace-nowrap font-serif text-[2.5rem] tracking-[0.8em] text-deep-walnut/[0.04] leading-none select-none"
                      animate={{ x: idx % 2 === 0 ? [0, -60] : [-60, 0] }}
                      transition={{ duration: 35 + idx * 4, repeat: Infinity, ease: 'linear', repeatType: 'mirror' }}
                    >
                      {row}
                    </motion.div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-b from-warm-cream via-transparent to-warm-cream" />
                  <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-transparent to-warm-cream" />
                </div>
              )}

              <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`mb-12 border-l pl-6 ${
                  isHeritage ? 'border-deep-walnut/30' : 'border-champagne-gold/20'
                }`}
              >
                <h2 className={`font-display text-3xl md:text-4xl mb-2 ${
                  isHeritage ? 'text-espresso' : 'text-champagne-gold'
                }`}>
                  {collectionTitles[colKey].title}
                </h2>
                <p className={`font-body text-xs md:text-sm uppercase tracking-widest italic ${
                  isHeritage ? 'text-deep-walnut/50' : 'text-warm-cream/40'
                }`}>
                  {collectionTitles[colKey].subtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {collectionProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="group block relative">
                      {/* Product Card Container */}
                      <Link 
                        to={product.isSoldOut ? '#' : `/product/${product.slug}`} 
                        className={`block transition-all duration-500 ${product.isSoldOut ? 'cursor-not-allowed opacity-80' : 'hover:-translate-y-2'}`}
                      >
                        <div className="aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden group/box" style={{ perspective: '1200px' }}>
                          <div className="relative w-full h-full rounded-2xl border border-champagne-gold/10 bg-gradient-to-br from-warm-cream/5 to-transparent transform-style-3d">
                            
                            {/* Sold Out Badge */}
                            {product.isSoldOut && (
                              <div className="absolute top-4 right-4 z-30 bg-espresso/90 border border-champagne-gold/30 px-3 py-1 rounded-full">
                                <span className="font-accent text-[8px] uppercase tracking-[0.2em] text-champagne-gold">Sold Out</span>
                              </div>
                            )}

                            {/* The Product Image */}
                            <div className="absolute inset-0 flex items-center justify-center p-12 z-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className={`max-h-full object-contain transition-all duration-700 ${product.isSoldOut ? 'grayscale contrast-125 opacity-40' : 'group-hover:scale-110 group-hover:rotate-6'}`}
                                loading="lazy"
                              />
                            </div>
                            
                            {/* The Box Lid (Premium Interaction) */}
                            <motion.div
                              style={{ transformOrigin: 'left center' }}
                              initial={{ rotateY: 0 }}
                              whileInView={!product.isSoldOut ? { rotateY: window.innerWidth < 768 ? -110 : 0 } : {}}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                              className={`absolute inset-0 bg-deep-walnut border border-champagne-gold/20 rounded-2xl z-10 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:!transform-none md:transition-transform md:duration-[1500ms] ${!product.isSoldOut && 'md:group-hover/box:![transform:rotateY(-110deg)]'}`}
                            >
                              <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none" />
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
                              
                              <div className="relative flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border border-champagne-gold/20 flex items-center justify-center mb-4">
                                  <span className="font-display text-2xl text-champagne-gold">G</span>
                                </div>
                                <div className="h-px w-8 bg-gold-gradient" />
                              </div>
                            </motion.div>
                            
                            {/* Inner Shadow / Depth */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex items-start justify-between px-2">
                          <div>
                            <h3 className={`font-header text-xl transition-colors ${
                              isHeritage
                                ? 'text-espresso group-hover:text-deep-walnut'
                                : 'text-champagne-gold group-hover:text-warm-cream'
                            }`}>
                              {product.name}
                            </h3>
                            <p className={`font-body text-[10px] mt-1 uppercase tracking-widest ${
                              isHeritage ? 'text-espresso/40' : 'text-warm-cream/30'
                            }`}>{product.wood}</p>
                          </div>
                          <div className="text-right">
                            <span className={`block font-accent text-sm ${
                              isHeritage ? 'text-espresso' : 'text-champagne-gold'
                            }`}>LE {product.price.toLocaleString()}</span>
                            {product.isSoldOut && <span className="text-[10px] text-espresso uppercase tracking-tighter line-through opacity-40">Archived</span>}
                          </div>
                        </div>
                      </Link>

                      {/* Quick Action Button */}
                      <div className="mt-6 px-2">
                        <button
                          disabled={product.isSoldOut}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!product.isSoldOut) {
                              addItem(product);
                            }
                          }}
                          className={`w-full py-4 rounded-xl font-accent text-[10px] uppercase tracking-[0.3em] transition-all duration-300 border ${
                            product.isSoldOut
                              ? 'border-espresso/10 text-espresso/20 cursor-not-allowed bg-transparent'
                              : isHeritage
                              ? 'border-deep-walnut/30 text-espresso hover:bg-espresso hover:text-warm-cream hover:border-espresso'
                              : 'border-champagne-gold/20 text-champagne-gold hover:bg-champagne-gold hover:text-deep-walnut hover:border-champagne-gold'
                          }`}
                        >
                          {product.isSoldOut ? 'Nul Part Ailleurs' : 'Add to Collection'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>{/* end grid wrapper */}
            </section>
          );
        })}
      </div>
    </main>
  );
}

