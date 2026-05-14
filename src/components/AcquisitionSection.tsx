import { motion } from 'motion/react';

const products = [
  {
    id: 1,
    name: "Forme du Temps",
    type: "Walnut Watch",
    price: "EGP 4,200",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Éclipse Du Bois",
    type: "Ebony & Olive Bow Tie",
    price: "EGP 1,800",
    image: "https://images.unsplash.com/photo-1620002093354-15206f0e21a8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Ra'en Scarab",
    type: "Dark Ebony Bow Tie",
    price: "EGP 2,100",
    image: "https://images.unsplash.com/photo-1542247657-61fb2788e04e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Ankh Éternel",
    type: "Mahogany Bow Tie",
    price: "EGP 1,950",
    image: "https://images.unsplash.com/photo-1627448332159-25fdb5b81682?q=80&w=800&auto=format&fit=crop"
  }
];

export default function AcquisitionSection() {
  return (
    <section className="bg-warm-cream py-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="border-b border-espresso/10 pb-8 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="font-header text-5xl lg:text-7xl text-espresso mb-4">The Collection</h2>
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">Select your signature</p>
          </div>
          <div className="flex gap-6 font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-espresso">
            <button className="border-b border-espresso pb-1">All Pieces</button>
            <button className="text-taupe hover:text-espresso transition-colors">Watches</button>
            <button className="text-taupe hover:text-espresso transition-colors">Bow Ties</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/5] bg-void-end mb-6 overflow-hidden relative rounded-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-espresso/5 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-void-end/80 backdrop-blur-sm">
                   <button className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-espresso border border-espresso px-6 py-3 hover:bg-espresso hover:text-warm-cream transition-colors">
                     View Details
                   </button>
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-header text-2xl text-espresso mb-1">{product.name}</h3>
                <p className="font-body text-taupe text-sm mb-4">{product.type}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold">{product.price}</span>
                <button className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-espresso border-b border-transparent group-hover:border-espresso transition-colors pb-0.5">
                  Add to Collection
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
