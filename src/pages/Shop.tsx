import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState, memo } from 'react';
import { preload } from 'react-dom';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const pinnedImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);

          // Dynamic cache-pinning: Instantiate Images in memory and pin them to prevent garbage collection
          const imagesToPin = [product.image, '/unboxing/gamenbox_000000_0000_gamenbox_000015.png'];
          pinnedImagesRef.current = imagesToPin.map(src => {
            const img = new Image();
            img.setAttribute('fetchpriority', 'high');
            img.src = src;
            return img;
          });

          // Priority Preloading (React 19 preload)
          try {
            preload(product.image, { as: 'image', fetchPriority: 'high' });
            preload('/unboxing/gamenbox_000000_0000_gamenbox_000015.png', { as: 'image', fetchPriority: 'high' });
          } catch (e) {
            // fallback
          }

          // Once intersected/near viewport, we can stop observing to optimize performance
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // Preload when within 300px (upcoming/adjacent in grid)
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [product.image]);

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
      <div ref={cardRef} className="block opacity-80 cursor-not-allowed">
        <div className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden group/box bg-transparent`} style={{ perspective: '1200px' }}>
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
                loading={isNearViewport ? "eager" : "lazy"}
                fetchPriority={isNearViewport ? "high" : "low"}
              />
            </div>

            {/* The Product Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
              <motion.img
                src={product.image}
                alt={`GAMÉN ${product.name} - Handcrafted ${product.wood}`}
                className="w-full h-full max-w-[85%] max-h-[85%] object-contain grayscale contrast-125 opacity-40"
                decoding="async"
                loading={isNearViewport ? "eager" : "lazy"}
                fetchPriority={isNearViewport ? "high" : "low"}
              />
            </div>

          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col min-[380px]:flex-row items-start justify-between gap-2 px-2">
          <div>
            <h3 className={`font-header text-lg sm:text-xl transition-colors ${
              isHeritage ? 'text-espresso' : 'text-champagne-gold'
            }`}>
              {product.name}
            </h3>
          </div>
          <div className="text-left min-[380px]:text-right flex-shrink-0">
            <span className={`block font-accent text-sm sm:text-base ${
              isHeritage ? 'text-espresso' : 'text-champagne-gold'
            }`}>LE {product.price.toLocaleString()}</span>
            <span className="text-[10px] text-espresso uppercase tracking-tighter line-through opacity-45">Archived</span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="mt-6 px-2">
          <button
            disabled
            className="w-full min-h-[48px] flex items-center justify-center py-4 rounded-xl font-accent text-[10px] uppercase tracking-[0.3em] transition-all duration-300 border border-espresso/10 text-espresso/20 cursor-not-allowed bg-transparent"
          >
            Nul Part Ailleurs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      className="block transition-all duration-500 cursor-pointer hover:-translate-y-2"
    >
      <div 
        className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden group/box transition-all duration-500 bg-transparent`}
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
              loading={isNearViewport ? "eager" : "lazy"}
              fetchPriority={isNearViewport ? "high" : "low"}
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
              loading={isNearViewport ? "eager" : "lazy"}
              fetchPriority={isNearViewport ? "high" : "low"}
            />
          </div>
          
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col min-[380px]:flex-row items-start justify-between gap-2 px-2">
        <div>
          <h3 className={`font-header text-lg sm:text-xl transition-colors ${
            isHeritage
              ? 'text-espresso group-hover:text-deep-walnut'
              : 'text-champagne-gold group-hover:text-warm-cream'
          }`}>
            {product.name}
          </h3>
        </div>
        <div className="text-left min-[380px]:text-right flex-shrink-0">
          <span className={`block font-accent text-sm sm:text-base ${
            isHeritage ? 'text-espresso' : 'text-champagne-gold'
          }`}>LE {product.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 px-2 flex flex-col min-[480px]:flex-row gap-2 min-[480px]:gap-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product);
          }}
          className={`flex-1 py-4 min-h-[48px] flex items-center justify-center rounded-xl font-accent text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
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
          className={`flex-1 py-4 min-h-[48px] flex items-center justify-center rounded-xl font-accent text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border text-center ${
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
        className={`aspect-[4/5] rounded-2xl mb-6 relative overflow-hidden bg-transparent`}
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
      <div className="flex flex-col min-[380px]:flex-row items-start justify-between gap-2 px-2">
        <div className="flex-1 space-y-2.5 w-full">
          {/* Title */}
          <div className={`h-5 rounded-md w-2/3 relative overflow-hidden ${
            isHeritage ? 'bg-[#d2c7b5]' : 'bg-[#180b06]'
          }`}>
            <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-40`} />
          </div>
        </div>
        {/* Price */}
        <div className={`h-4 rounded-md w-1/5 relative overflow-hidden flex-shrink-0 ${
          isHeritage ? 'bg-[#d2c7b5]' : 'bg-[#180b06]'
        }`}>
          <div className={`absolute inset-0 ${isHeritage ? 'bg-shimmer-cream' : 'bg-shimmer-espresso'} opacity-40`} />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 px-2 flex flex-col min-[480px]:flex-row gap-2 min-[480px]:gap-4">
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

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-6 min-[360px]:gap-4 sm:gap-8 lg:gap-10">
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

          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-6 min-[360px]:gap-4 sm:gap-8 lg:gap-10">
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

const collectionsFilter: { key: 'all' | ProductCollection; label: string }[] = [
  { key: 'all', label: 'All Creations' },
  { key: 'signature', label: 'Signature' },
  { key: 'classique', label: 'Classique' },
  { key: 'heritage', label: 'Héritage' },
  { key: 'watches', label: 'Horlogerie' }
];

export default function Shop() {
  const { addItem } = useCart();
  const { products, loading } = useProductsContext();
  
  // States for filtering & sorting
  const [selectedCollection, setSelectedCollection] = useState<'all' | ProductCollection>('all');
  const [selectedWood, setSelectedWood] = useState<'all' | 'walnut' | 'mahogany' | 'sycamore' | 'ebony'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Signature first — client requirement: bespoke tier shown prominently at top
  const collectionsList: ProductCollection[] = ['signature', 'classique', 'heritage', 'watches'];
  const heritageSectionRef = useRef<HTMLElement>(null);

  const pinnedBoxRef = useRef<HTMLImageElement | null>(null);
  // Preload unboxing frames on mount and hold them in a ref to prevent garbage collection
  useEffect(() => {
    const img = new Image();
    img.src = '/unboxing/gamenbox_000000_0000_gamenbox_000015.png';
    pinnedBoxRef.current = img;
  }, []);

  // Filter products based on selected parameters
  const filteredProducts = products.filter(product => {
    // 1. Collection filter
    const matchesCollection = selectedCollection === 'all' || product.collection === selectedCollection;
    
    // 2. Wood filter
    const matchesWood = selectedWood === 'all' || 
      product.wood.toLowerCase().includes(selectedWood.toLowerCase());
      
    return matchesCollection && matchesWood;
  });

  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] text-champagne-gold tracking-tighter mb-4">
            The <span className="italic font-light">Collection</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-6" />
          <p className="font-body text-warm-cream/60 text-sm max-w-md mx-auto uppercase tracking-widest">
            Hand-carved excellence. Egyptian soul.
          </p>
        </motion.div>

        {/* Filters and Sorting controls */}
        <div className="mb-16 flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-champagne-gold/10 py-6">
          {/* Main Filters (Chips) */}
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start w-full lg:w-auto">
            {collectionsFilter.map((opt) => {
              const isActive = selectedCollection === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSelectedCollection(opt.key)}
                  className={`px-5 py-3 min-h-[48px] rounded-full font-accent text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border flex items-center justify-center ${
                    isActive
                      ? 'bg-champagne-gold text-deep-walnut border-champagne-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold'
                      : 'bg-transparent text-warm-cream/60 border-champagne-gold/15 hover:text-champagne-gold hover:border-champagne-gold/30'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-col min-[380px]:flex-row gap-3 items-center justify-center w-full lg:w-auto">
            {/* Wood Dropdown */}
            <div className="relative w-full min-[380px]:w-[180px] h-12">
              <select
                value={selectedWood}
                onChange={(e) => setSelectedWood(e.target.value as any)}
                className="w-full h-full px-4 rounded-xl bg-espresso border border-champagne-gold/15 text-champagne-gold font-accent text-[10px] uppercase tracking-[0.2em] appearance-none cursor-pointer focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 pr-10"
              >
                <option value="all">All Woods</option>
                <option value="walnut">Walnut</option>
                <option value="mahogany">Mahogany</option>
                <option value="sycamore">Sycamore</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-champagne-gold/60">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.219-0.57 0.219-0.788 0l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z"/>
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full min-[380px]:w-[180px] h-12">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-full px-4 rounded-xl bg-espresso border border-champagne-gold/15 text-champagne-gold font-accent text-[10px] uppercase tracking-[0.2em] appearance-none cursor-pointer focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 pr-10"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-champagne-gold/60">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.219-0.57 0.219-0.788 0l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Collections */}
        {loading ? (
          <ShopSkeleton />
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 border border-dashed border-champagne-gold/15 rounded-2xl bg-espresso/20 px-6"
          >
            <p className="font-display text-2xl text-champagne-gold mb-2">No matching creations found</p>
            <p className="font-body text-warm-cream/40 text-xs uppercase tracking-widest mb-6">
              Try adjusting your filter selection or wood type
            </p>
            <button
              onClick={() => {
                setSelectedCollection('all');
                setSelectedWood('all');
                setSortBy('default');
              }}
              className="px-6 py-3 min-h-[48px] rounded-full bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-warm-cream inline-flex items-center justify-center"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : collectionsList.map((colKey) => {
          // Verify if collection matches selectedCollection
          if (selectedCollection !== 'all' && colKey !== selectedCollection) return null;

          const collectionProducts = filteredProducts.filter(p => p.collection === colKey);
          if (collectionProducts.length === 0) return null;

          // Apply sorting within the collection
          let sortedProducts = [...collectionProducts];
          if (sortBy === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
          }

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

                <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-6 min-[360px]:gap-4 sm:gap-8 lg:gap-10">
                  {sortedProducts.map((product) => (
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
