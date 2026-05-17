import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../context/ProductsContext';

export default function AcquisitionSection() {
  const [activeFilter, setActiveFilter] = useState('All Pieces');
  const { products } = useProductsContext();

  // Filter for bow-ties only for this section
  const bowTies = products.filter(p => p.category === 'bow-tie');

  const filteredProducts = bowTies.filter(p => {
    if (activeFilter === 'Walnut') return p.wood.toLowerCase().includes('walnut');
    if (activeFilter === 'Brass Detail') return p.wood.toLowerCase().includes('brass');
    return true;
  });

  return (
    <section className="bg-warm-cream py-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-espresso/10 pb-8 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="font-header text-5xl lg:text-7xl text-espresso mb-4">The Collection</h2>
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-deep-walnut">Select your signature</p>
          </div>
          <div className="flex gap-6 font-accent text-[10px] uppercase tracking-[0.2em] font-medium transition-colors">
            <button 
              onClick={() => setActiveFilter('All Pieces')}
              className={activeFilter === 'All Pieces' ? 'border-b border-espresso pb-1 text-espresso' : 'text-taupe hover:text-espresso pb-1'}
            >
              All Pieces
            </button>
            <button 
              onClick={() => setActiveFilter('Walnut')}
              className={activeFilter === 'Walnut' ? 'border-b border-espresso pb-1 text-espresso' : 'text-taupe hover:text-espresso pb-1'}
            >
              Walnut
            </button>
            <button 
              onClick={() => setActiveFilter('Brass Detail')}
              className={activeFilter === 'Brass Detail' ? 'border-b border-espresso pb-1 text-espresso' : 'text-taupe hover:text-espresso pb-1'}
            >
              Brass Detail
            </button>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/5] bg-void-end mb-6 overflow-hidden relative rounded-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-espresso/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-void-end/80">
                    <Link 
                      to={`/product/${product.slug}`}
                      className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-espresso border border-espresso px-6 py-3 hover:bg-espresso hover:text-warm-cream transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="font-header text-2xl text-espresso mb-1">{product.name}</h3>
                  <p className="font-body text-taupe text-sm mb-4">{product.wood}</p>
                </div>

                <div className="flex items-center justify-between mt-auto gap-4">
                  <span className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-deep-walnut">
                    LE {product.price.toLocaleString()}
                  </span>
                  <button className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-espresso border-b border-transparent group-hover:border-espresso transition-colors pb-0.5">
                    Add to Collection
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
