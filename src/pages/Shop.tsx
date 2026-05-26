import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useEffect, memo } from 'react';
import type { ProductCollection, Product } from '../data/products';
import { useProductsContext } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  isHeritage: boolean;
  addItem: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({ product, isHeritage, addItem }: ProductCardProps) {
  const navigate = useNavigate();

  // Navigate to details on card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent event handling if user clicked on button or link element
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    navigate(`/product/${product.slug}`);
  };

  if (product.isSoldOut) {
    return (
      <div className="block opacity-80 cursor-not-allowed">
        <div className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden group/box ${
          isHeritage ? 'bg-warm-cream/50' : 'bg-espresso/45'
        }`} style={{ perspective: '1200px' }}>
          <div className="relative w-full h-full rounded-2xl bg-transparent transform-style-3d">
            
            {/* Sold Out Badge */}
            <div className="absolute top-4 right-4 z-30 bg-espresso/90 border border-champagne-gold/30 px-3 py-1 rounded-full">
              <span className="font-accent text-[8px] uppercase tracking-[0.2em] text-champagne-gold">Sold Out</span>
            </div>

            {/* The Opened Box Background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 p-8 pointer-events-none">
              <img
                src="/unboxing/gamenbox_000000_0000_gamenbox_000015.png"
                alt={`GAMÉN ${product.name} Presentation Box`}
                className="w-full h-full object-contain opacity-40 grayscale contrast-125"
                decoding="async"
              />
            </div>

            {/* The Product Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
              <motion.img
                src={product.image}
                alt={`GAMÉN ${product.name} - Handcrafted ${product.wood}`}
                className="w-full h-full max-w-[85%] max-h-[85%] object-contain grayscale contrast-125 opacity-40"
                decoding="async"
              />
            </div>

          </div>
        </div>

        {/* Product Info */}
        <div className="flex items-start justify-between px-2">
          <div>
            <h3 className={`font-header text-xl transition-colors ${
              isHeritage ? 'text-espresso' : 'text-champagne-gold'
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
            <span className="text-[10px] text-espresso uppercase tracking-tighter line-through opacity-45">Archived</span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="mt-6 px-2">
          <button
            disabled
            className="w-full py-4 rounded-xl font-accent text-[10px] uppercase tracking-[0.3em] transition-all duration-300 border border-espresso/10 text-espresso/20 cursor-not-allowed bg-transparent"
          >
            Nul Part Ailleurs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="block transition-all duration-500 cursor-pointer hover:-translate-y-2"
    >
      <div 
        className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden group/box transition-all duration-500 border border-champagne-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] ${
          isHeritage ? 'bg-warm-cream/50' : 'bg-espresso/45'
        }`}
        style={{ perspective: '1200px' }}
      >
        <div className="relative w-full h-full rounded-2xl bg-transparent transform-style-3d">
          
          {/* Box Sequence Background (Blury Presentation Box) */}
          <div className="absolute inset-0 flex items-center justify-center z-0 p-8 pointer-events-none">
            <img
              src="/unboxing/gamenbox_000000_0000_gamenbox_000015.png"
              alt={`GAMÉN ${product.name} Presentation Box`}
              className="w-full h-full object-contain opacity-85 scale-100"
              style={{
                filter: 'blur(12px) drop-shadow(0 0 2.5px rgba(26, 16, 11, 0.95)) drop-shadow(0 12px 36px rgba(0, 0, 0, 0.6))'
              }}
              decoding="async"
            />
          </div>

          {/* Premium Ambient Radial Glow */}
          <div className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center">
            <div className="w-4/5 h-4/5 rounded-full bg-champagne-gold/15 blur-[45px] animate-pulse" />
          </div>

          {/* The Product Image - Immediately sharp, unblurred, and visible */}
          <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
            <motion.img
              src={product.image}
              alt={`GAMÉN ${product.name} - Handcrafted ${product.wood}`}
              initial={{ opacity: 1, y: -20, scale: 1.08 }}
              whileHover={{ y: -30, scale: 1.18 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full h-full max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.65)] filter saturate-[1.1] contrast-[1.05]"
              decoding="async"
            />
          </div>
          
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 px-2 flex gap-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product);
          }}
          className={`flex-1 py-4 rounded-xl font-accent text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
            isHeritage
              ? 'border-deep-walnut/30 text-espresso hover:bg-espresso hover:text-warm-cream hover:border-espresso'
              : 'border-champagne-gold/20 text-champagne-gold hover:bg-champagne-gold hover:text-deep-walnut hover:border-champagne-gold'
          }`}
        >
          Add
        </button>
        <Link
          to={`/product/${product.slug}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`flex-1 py-4 rounded-xl font-accent text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border text-center ${
            isHeritage
              ? 'bg-espresso text-warm-cream border-espresso hover:bg-transparent hover:text-espresso hover:border-deep-walnut/30'
              : 'bg-champagne-gold text-deep-walnut border-champagne-gold hover:bg-transparent hover:text-champagne-gold hover:border-champagne-gold/20'
          }`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
});

const HIEROGLYPHS = '𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓𓀔𓀕𓀖𓀗𓀘𓀙𓀚𓀛𓀜𓀝𓀞𓀟𓀠𓀡𓀢𓀣𓀤𓀥𓀦𓀧𓀨𓀩𓀪𓀫𓀬𓀭𓀮𓀯';
const hieroglyphRows = Array.from({ length: 10 }, () =>
  Array.from({ length: 28 }, () => HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]).join('')
);

const HieroglyphicBackground = memo(function HieroglyphicBackground() {
  return (
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
  );
});

function ProductCardSkeleton({ isHeritage }: { isHeritage: boolean }) {
  return (
    <div>
      <div 
        className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden border ${
          isHeritage 
            ? 'border-deep-walnut/15 bg-[#e5decf]' 
            : 'border-champagne-gold/10 bg-espresso/30'
        }`}
      >
        {/* Shimmer gradient overlay */}
        <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-85`} />
        
        {/* Premium ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className={`w-3/5 h-3/5 rounded-full blur-[35px] ${
            isHeritage ? 'bg-deep-walnut/5' : 'bg-champagne-gold/5'
          }`} />
        </div>

        {/* Outer watch/box outline placeholder */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className={`w-3/4 h-3/4 rounded-full border border-dashed ${
            isHeritage ? 'border-deep-walnut/10' : 'border-champagne-gold/10'
          } flex items-center justify-center opacity-40`}>
            <div className={`w-1/2 h-1/2 rounded-full border border-dashed ${
              isHeritage ? 'border-deep-walnut/10' : 'border-champagne-gold/10'
            }`} />
          </div>
        </div>
      </div>

      {/* Info Placeholder */}
      <div className="flex items-start justify-between px-2">
        <div className="flex-1 space-y-2.5">
          {/* Title */}
          <div className={`h-5 rounded-md w-2/3 relative overflow-hidden ${
            isHeritage ? 'bg-[#d2c7b5]' : 'bg-[#180b06]'
          }`}>
            <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-40`} />
          </div>
          {/* Subtitle / Wood */}
          <div className={`h-3 rounded-md w-1/3 relative overflow-hidden ${
            isHeritage ? 'bg-[#d2c7b5]' : 'bg-[#180b06]'
          }`}>
            <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-25`} />
          </div>
        </div>
        {/* Price */}
        <div className={`h-4 rounded-md w-1/5 relative overflow-hidden ${
          isHeritage ? 'bg-[#d2c7b5]' : 'bg-[#180b06]'
        }`}>
          <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-40`} />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 px-2 flex gap-4">
        {/* Add button placeholder */}
        <div className={`flex-1 h-12 rounded-xl border relative overflow-hidden ${
          isHeritage ? 'border-deep-walnut/10' : 'border-champagne-gold/10'
        }`}>
          <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-15`} />
        </div>
        {/* Details button placeholder */}
        <div className={`flex-1 h-12 rounded-xl relative overflow-hidden ${
          isHeritage ? 'bg-[#d2c7b5]/30' : 'bg-[#180b06]'
        }`}>
          <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-35`} />
        </div>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-32">
      {/* 1. Dark Espresso Section */}
      <section className="relative">
        <div className="mb-12 border-l pl-6 border-champagne-gold/20">
          {/* Skeleton Section Title */}
          <div className="h-9 rounded-md w-64 bg-[#180b06] relative overflow-hidden mb-3">
            <div className="absolute inset-0 bg-shimmer-espresso opacity-50" />
          </div>
          {/* Skeleton Section Subtitle */}
          <div className="h-4 rounded-md w-96 max-w-full bg-[#180b06] relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer-espresso opacity-30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProductCardSkeleton isHeritage={false} />
          <ProductCardSkeleton isHeritage={false} />
          <ProductCardSkeleton isHeritage={false} />
        </div>
      </section>

      {/* 2. Heritage Warm Cream Section */}
      <section className="rounded-none sm:rounded-2xl overflow-hidden py-16 px-6 sm:px-10 -mx-6 sm:-mx-10 bg-warm-cream relative">
        {/* Mock Hieroglyphs bg */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
          {hieroglyphRows.slice(0, 4).map((row, idx) => (
            <div
              key={idx}
              className="whitespace-nowrap font-serif text-[2.5rem] tracking-[0.8em] text-deep-walnut/[0.04] leading-none select-none"
            >
              {row}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-warm-cream via-transparent to-warm-cream" />
        </div>

        <div className="relative z-10">
          <div className="mb-12 border-l pl-6 border-deep-walnut/30">
            {/* Skeleton Section Title */}
            <div className="h-9 rounded-md w-72 bg-[#d2c7b5] relative overflow-hidden mb-3">
              <div className="absolute inset-0 bg-shimmer-cream opacity-80" />
            </div>
            {/* Skeleton Section Subtitle */}
            <div className="h-4 rounded-md w-10/12 max-w-xl bg-[#d2c7b5] relative overflow-hidden">
              <div className="absolute inset-0 bg-shimmer-cream opacity-55" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <ProductCardSkeleton isHeritage={true} />
            <ProductCardSkeleton isHeritage={true} />
            <ProductCardSkeleton isHeritage={true} />
          </div>
        </div>
      </section>
    </div>
  );
}


const collectionTitles: Record<ProductCollection, { title: string; subtitle: string }> = {
  classique: { 
    title: 'I. GΛMÉN Classiques', 
    subtitle: 'The timeless modern classics' 
  },
  heritage: { 
    title: 'II. GΛMÉN Héritage', 
    subtitle: 'The Heirs of the Nile — inspired by Egyptian royalty & mythology' 
  },
  signature: { 
    title: 'III. GΛMÉN Signature', 
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

  // Preload unboxing frames on mount and hold them in a ref to prevent garbage collection
  useEffect(() => {
    const img = new Image();
    img.src = '/unboxing/gamenbox_000000_0000_gamenbox_000015.png';
  }, []);

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
          <ShopSkeleton />
        ) : collections.map((colKey) => {
          const collectionProducts = products.filter(p => p.collection === colKey);
          if (collectionProducts.length === 0) return null;

          const isHeritage = colKey === 'heritage';

          return (
            <section
              key={colKey}
              ref={isHeritage ? heritageSectionRef : undefined}
              className={`mb-32 last:mb-0 relative ${
                isHeritage ? 'rounded-none sm:rounded-2xl overflow-hidden py-16 px-6 sm:px-10 -mx-6 sm:-mx-10 bg-warm-cream' : ''
              }`}
            >
              {/* Heritage: animated hieroglyphic background */}
              {isHeritage && <HieroglyphicBackground />}

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
                {collectionProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard
                      product={product}
                      isHeritage={isHeritage}
                      addItem={addItem}
                    />
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

