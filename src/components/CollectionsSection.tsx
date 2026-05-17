import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useProductsContext } from '../context/ProductsContext';
import { MotionValue } from 'motion/react';

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { products } = useProductsContext();
  
  const collections = products.map((p, i) => ({
    id: i + 1,
    name: p.name,
    tagline: p.tagline,
    image: p.image,
    wood: p.wood,
    slug: p.slug,
  }));
  
  const count = collections.length;

  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // Each item is 100vw wide; translate to show the last item centered
  const endPercent = `-${((count - 1) / count) * 100}%`;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', endPercent]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Give each item 120vh of scroll runway for comfortable pacing
  const scrollHeight = `${Math.max(count * 120, 400)}vh`;

  return (
    <section ref={containerRef} className="relative bg-warm-cream" style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-28 left-6 right-6 md:left-12 md:right-12 -z-10 h-px bg-deep-walnut/15">
          <motion.div className="h-full bg-deep-walnut origin-left" style={{ width: progressWidth }} />
        </div>

        <motion.div
          style={{ x }}
          className="flex h-full"
          // Dynamic width based on actual item count
          // Each item is 100vw, so total = count * 100vw
        >
          {collections.map((item, index) => (
            <CollectionItem key={item.id} item={item} index={index} count={count} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CollectionItem({ item, index, count, scrollYProgress }: { item: any, index: number, count: number, scrollYProgress: MotionValue<number> }) {
  // Center point for this item in the scroll progress (0 to 1)
  const center = count > 1 ? index / (count - 1) : 0;
  // Define how much scroll progress constitutes entering/leaving the item's domain
  const buffer = count > 1 ? 0.8 / (count - 1) : 0.5;
  const start = Math.max(0, center - buffer);
  const end = Math.min(1, center + buffer);

  // When scroll hits start, rotation starts. At center, rotation is -105. At end, rotation is back to 0.
  const rotateY = useTransform(scrollYProgress, [start, center, end], [0, -105, 0]);
  const scale = useTransform(scrollYProgress, [start, center, end], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [start, center, end], [0, 1, 0]);

  return (
    <div
      className="relative h-full flex items-center justify-center py-6 px-6 lg:p-24 flex-shrink-0"
      style={{ width: '100vw' }}
    >
      <div className="absolute left-2 md:left-8 lg:left-12 top-24 md:top-auto md:bottom-12 font-header text-[120px] md:text-[220px] leading-none text-deep-walnut/[0.06] pointer-events-none -z-10">
        0{item.id}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 w-full max-w-7xl mx-auto z-10">
        <div className="w-4/5 sm:w-1/2 lg:w-1/2 relative group max-h-[40vh] lg:max-h-none flex justify-center shrink-0" style={{ perspective: '1000px' }}>
          <div className="relative w-full max-w-[220px] lg:max-w-[400px] aspect-[4/5] rounded-xl border border-deep-walnut/20 bg-gradient-to-br from-void-start to-void-end transform-style-3d shrink-0">
            {/* The Product Inside */}
            <motion.div
              style={{ scale, opacity }}
              className="absolute inset-0 flex items-center justify-center p-6 lg:p-12"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
            
            {/* The Box Lid (Front cover that swings open) */}
            <motion.div
              style={{ rotateY, transformOrigin: 'left center' }}
              className="absolute inset-0 bg-deep-walnut border border-champagne-gold/20 rounded-xl z-10 shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-20 mix-blend-overlay" />
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-champagne-gold/30 flex items-center justify-center">
                <span className="font-display text-xl lg:text-2xl text-champagne-gold">G</span>
              </div>
            </motion.div>
            
            <div className="absolute inset-0 bg-espresso/10 transition-opacity group-hover:opacity-0 pointer-events-none" />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center gap-4 lg:gap-6 mt-4 lg:mt-0">
          <span className="font-accent text-[10px] tracking-[0.2em] font-medium text-deep-walnut uppercase text-center block w-full">
            Collection // {item.wood}
          </span>
          <h3 className="font-header text-4xl lg:text-7xl text-espresso text-center leading-tight">
            {item.name}
          </h3>
          <p className="font-french italic text-lg lg:text-3xl leading-tight text-espresso opacity-80 max-w-[280px] lg:max-w-none text-center">
            {item.tagline}
          </p>

          <Link to={`/product/${item.slug}`} className="mt-4 lg:mt-8 group inline-flex items-center justify-center gap-4 text-espresso font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-6 py-4 border border-espresso/20 hover:border-espresso transition-colors">
            <span className="relative z-10">Explore</span>
            <span className="relative z-10 h-px w-10 bg-espresso" />
          </Link>
        </div>
      </div>
    </div>
  );
}

