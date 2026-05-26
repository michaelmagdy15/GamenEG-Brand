import { motion, useTransform, useMotionValue, useMotionValueEvent, useMotionTemplate } from 'motion/react';
import { useRef, useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { preload } from 'react-dom';
import type { Product } from '../data/products';
import { useProductsContext } from '../context/ProductsContext';
import { MotionValue } from 'motion/react';
import { useCart } from '../context/CartContext';

const FRAMES = [
  'gamenbox_000000_0015_Layer-1.png',
  'gamenbox_000000_0014_gamenbox_000001.png',
  'gamenbox_000000_0013_gamenbox_000002.png',
  'gamenbox_000000_0012_gamenbox_000003.png',
  'gamenbox_000000_0011_gamenbox_000004.png',
  'gamenbox_000000_0010_gamenbox_000005.png',
  'gamenbox_000000_0009_gamenbox_000006.png',
  'gamenbox_000000_0008_gamenbox_000007.png',
  'gamenbox_000000_0007_gamenbox_000008.png',
  'gamenbox_000000_0006_gamenbox_000009.png',
  'gamenbox_000000_0005_gamenbox_000010.png',
  'gamenbox_000000_0004_gamenbox_000011.png',
  'gamenbox_000000_0003_gamenbox_000012.png',
  'gamenbox_000000_0002_gamenbox_000013.png',
  'gamenbox_000000_0001_gamenbox_000014.png',
  'gamenbox_000000_0000_gamenbox_000015.png'
];

function CollectionsSkeleton() {
  return (
    <div className="relative h-full flex items-center justify-center py-6 px-6 lg:p-24 w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 w-full z-10 pointer-events-none">
        
        {/* Left Column: Product Box Skeleton */}
        <div className="w-4/5 sm:w-1/2 lg:w-1/2 relative group max-h-[40vh] lg:max-h-none flex justify-center shrink-0">
          <div className="relative w-full max-w-[280px] lg:max-w-[500px] aspect-square flex items-center justify-center shrink-0 bg-espresso/35 rounded-3xl border border-champagne-gold/10 overflow-hidden">
            {/* Shimmer gradient overlay */}
            <div className="absolute inset-0 bg-shimmer-espresso opacity-90" />
            
            {/* Ambient radial glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-champagne-gold/5 blur-[40px]" />
            </div>

            {/* Faint presentation box placeholder outline */}
            <div className="w-[85%] h-[85%] border border-dashed border-champagne-gold/10 rounded-2xl flex items-center justify-center opacity-30">
              <div className="w-3/4 h-3/4 border border-dashed border-champagne-gold/10 rounded-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 border border-dashed border-champagne-gold/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title & Buttons Skeleton */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center gap-5 lg:gap-7 mt-4 lg:mt-0">
          {/* Subtitle / Collection */}
          <div className="h-4 rounded-md w-36 bg-[#180b06] relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer-espresso opacity-40" />
          </div>

          {/* Title */}
          <div className="h-12 lg:h-16 rounded-lg w-3/4 bg-[#180b06] relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer-espresso opacity-60" />
          </div>

          {/* Description / Tagline */}
          <div className="h-6 rounded-md w-1/2 bg-[#180b06] relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer-espresso opacity-40" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-4 lg:mt-8 w-full max-w-sm">
            {/* Explore button placeholder */}
            <div className="flex-1 h-14 rounded-md border border-champagne-gold/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-shimmer-espresso opacity-15" />
            </div>
            {/* Add to collection button placeholder */}
            <div className="flex-1 h-14 rounded-md bg-[#180b06] relative overflow-hidden">
              <div className="absolute inset-0 bg-shimmer-espresso opacity-35" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const { products, loading } = useProductsContext();
  
  const collections = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      image: p.image,
      wood: p.wood,
      slug: p.slug,
      isSoldOut: p.isSoldOut,
      product: p,
    }));
  }, [products]);
  
  const count = collections.length;
  const x = useMotionValue(0);

  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const [hasDragged, setHasDragged] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dynamicPinnedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Track active slide index based on drag/swipe progress
  useMotionValueEvent(x, 'change', (latest) => {
    const currentIdx = Math.min(count > 0 ? count - 1 : 0, Math.max(0, Math.round(-latest / vw)));
    if (currentIdx !== activeIndex) {
      setActiveIndex(currentIdx);
    }
  });

  // Dynamic image cache-pinning & priority preloading for active/adjacent carousel items
  useEffect(() => {
    const adjacentIndices = [activeIndex - 1, activeIndex, activeIndex + 1].filter(
      i => i >= 0 && i < count
    );
    
    adjacentIndices.forEach(idx => {
      const item = collections[idx];
      if (item && item.image) {
        // Dynamic cache-pinning: instantiate Image in memory and store in persistent map to avoid GC
        if (!dynamicPinnedImagesRef.current.has(item.image)) {
          const img = new Image();
          img.setAttribute('fetchpriority', 'high');
          img.src = item.image;
          dynamicPinnedImagesRef.current.set(item.image, img);
        }
        
        // Priority preloading
        try {
          preload(item.image, { as: 'image', fetchPriority: 'high' });
        } catch (e) {
          // fallback
        }
      }
    });
  }, [activeIndex, collections, count]);
  
  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Preload unboxing frames and pin to ref to prevent JavaScript garbage collection
    const unboxingImages = FRAMES.map(frame => {
      const img = new Image();
      img.src = `/unboxing/${frame}`;
      return img;
    });

    // Preload all product images inside the collections (including the GΛMÉN Époque watch)
    const productImages = collections.map(c => {
      const img = new Image();
      img.src = c.image;
      return img;
    });

    preloadedImagesRef.current = [...unboxingImages, ...productImages];

    return () => window.removeEventListener('resize', handleResize);
  }, [collections]);

  const progressWidth = useTransform(
    x,
    [0, -((count > 1 ? count - 1 : 1) * vw)],
    ['0%', '100%']
  );

  return (
    <section className="relative bg-espresso py-12 md:py-24 overflow-hidden min-h-[100svh] flex flex-col justify-center">
      {loading ? (
        <CollectionsSkeleton />
      ) : (
        <>
          <div className="absolute top-28 left-6 right-6 md:left-12 md:right-12 -z-10 h-px bg-champagne-gold/20">
            <motion.div className="h-full bg-champagne-gold origin-left" style={{ width: progressWidth }} />
          </div>

          {/* Drag Hint Indicator */}
          <motion.div 
            animate={{ opacity: hasDragged ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-20 opacity-60"
          >
            <motion.div
              animate={{ x: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex items-center gap-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-champagne-gold opacity-70 rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="font-accent text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-champagne-gold font-bold">
                DR<span className="font-lambda">Λ</span>G OR SWIPE
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-champagne-gold opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div 
            ref={containerRef} 
            className="w-full flex-1 flex items-center"
          >
            <motion.div
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0.1}
              style={{ x }}
              onDragStart={() => setHasDragged(true)}
              className="flex items-center h-full cursor-grab active:cursor-grabbing"
            >
              {collections.map((item, index) => {
                const isActive = index === activeIndex;
                const isAdjacent = Math.abs(index - activeIndex) <= 1;
                return (
                  <CollectionItem 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    count={count} 
                    x={x} 
                    vw={vw} 
                    isActive={isActive}
                    isAdjacent={isAdjacent}
                  />
                );
              })}
            </motion.div>
          </motion.div>

          {/* Hidden container to absolute pre-render unboxing & product images to avoid white flash */}
          <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {FRAMES.map((frame) => (
              <img key={frame} src={`/unboxing/${frame}`} alt="preload" />
            ))}
            {collections.map((item) => (
              <img key={item.id} src={item.image} alt="preload product" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

const CollectionItem = memo(function CollectionItem({ 
  item, 
  index, 
  count, 
  x, 
  vw,
  isActive,
  isAdjacent
}: { 
  item: { id: string; name: string; tagline: string; image: string; wood: string; slug: string; isSoldOut?: boolean; product: Product }, 
  index: number, 
  count: number, 
  x: MotionValue<number>, 
  vw: number,
  isActive: boolean,
  isAdjacent: boolean
}) {
  const { addItem } = useCart();
  const centerPosition = -index * vw;
  const startPosition = centerPosition + vw * 0.8;
  const endPosition = centerPosition - vw * 0.8;

  // Map horizontal position to a frame index (0 to 15)
  const frameFloat = useTransform(x, [startPosition, centerPosition, endPosition], [0, 15, 0]);
  const [frameIndex, setFrameIndex] = useState(0);

  useMotionValueEvent(frameFloat, 'change', (latest) => {
    setFrameIndex(Math.min(15, Math.max(0, Math.round(latest))));
  });

  // Product animation values
  const productScale = useTransform(frameFloat, [10, 15], [0.5, 1.1]);
  const productY = useTransform(frameFloat, [10, 15], [100, -20]);
  const productOpacity = useTransform(frameFloat, [10, 14], [0, 1]);

  // Box blur and opacity values
  const boxBlur = useTransform(frameFloat, [13, 15], [0, 6]);
  const filter = useMotionTemplate`blur(${boxBlur}px) drop-shadow(0 0 2px rgba(26, 16, 11, 0.95)) drop-shadow(0 12px 36px rgba(0, 0, 0, 0.6))`;
  const boxOpacity = useTransform(frameFloat, [13, 15], [1, 0.6]);
  const boxScale = useTransform(frameFloat, [13, 15], [1, 0.95]);

  return (
    <div
      className="relative h-full flex items-center justify-center py-6 px-6 lg:p-24 flex-shrink-0"
      style={{ width: '100vw' }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 w-full max-w-7xl mx-auto z-10 pointer-events-none">
        

        <div className="w-4/5 sm:w-1/2 lg:w-1/2 relative group max-h-[40vh] lg:max-h-none flex justify-center shrink-0 pointer-events-auto" style={{ perspective: '1000px' }}>
          <div className="relative w-full max-w-[280px] lg:max-w-[500px] aspect-square flex items-center justify-center shrink-0 bg-espresso/30 rounded-2xl">
            {/* The Box Sequence (Pre-rendered and toggled by opacity to avoid dynamic src-swapping white flash) */}
            {FRAMES.map((frame, idx) => (
              <motion.img
                key={frame}
                src={`/unboxing/${frame}`}
                alt="Box sequence"
                style={{ 
                  filter, 
                  opacity: idx === frameIndex ? boxOpacity : 0, 
                  scale: boxScale 
                }}
                className="absolute w-full h-full object-contain pointer-events-none transition-opacity duration-75"
                draggable={false}
              />
            ))}

            {/* Sold Out Badge */}
            {item.isSoldOut && (
              <div className="absolute top-4 right-4 z-20 bg-espresso/90 border border-champagne-gold/30 px-3 py-1 rounded-full select-none">
                <span className="font-accent text-[8px] uppercase tracking-[0.2em] text-champagne-gold">Sold Out</span>
              </div>
            )}

            {/* The Product Inside */}
            <motion.div
              style={{ scale: productScale, y: productY, opacity: productOpacity }}
              className="absolute z-10 w-full h-full flex items-center justify-center p-6 lg:p-12 pointer-events-none"
            >
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl transition-all duration-300 ${
                  item.isSoldOut ? 'grayscale opacity-40 contrast-125' : ''
                }`}
                decoding="async"
                loading={isAdjacent ? "eager" : "lazy"}
                fetchPriority={isActive ? "high" : isAdjacent ? "high" : "low"}
                draggable={false}
              />
            </motion.div>

          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center gap-4 lg:gap-6 mt-4 lg:mt-0 pointer-events-auto">
          <span className="font-accent text-[10px] tracking-[0.2em] font-medium text-champagne-gold/60 uppercase text-center block w-full select-none">
            Collection // {item.wood}
          </span>
          <h3 className="font-header text-4xl lg:text-7xl text-warm-cream text-center leading-tight select-none">
            {item.name}
          </h3>
          <p className="font-french italic text-lg lg:text-3xl leading-tight text-warm-cream/80 max-w-[280px] lg:max-w-none text-center select-none">
            {item.tagline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 lg:mt-8">
            <Link to={`/product/${item.slug}`} className="group inline-flex items-center justify-center gap-4 text-warm-cream font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-6 py-4 border border-warm-cream/20 hover:border-warm-cream hover:bg-warm-cream/5 transition-colors">
              <span className="relative z-10">Explore</span>
              <span className="relative z-10 h-px w-10 bg-warm-cream" />
            </Link>

            <button
              disabled={item.isSoldOut}
              onClick={() => {
                if (!item.isSoldOut) {
                  addItem(item.product);
                }
              }}
              className={`group inline-flex items-center justify-center gap-4 font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-6 py-4 border transition-all duration-300 ${
                item.isSoldOut
                  ? 'border-warm-cream/10 text-warm-cream/35 cursor-not-allowed bg-transparent'
                  : 'border-champagne-gold text-deep-walnut bg-champagne-gold hover:bg-warm-cream hover:border-warm-cream'
              }`}
            >
              <span className="relative z-10">{item.isSoldOut ? 'Sold Out' : 'Add to Collection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

