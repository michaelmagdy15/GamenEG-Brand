import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { collections } from '../data/products';

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
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
        <div className="absolute top-28 left-6 right-6 md:left-12 md:right-12 z-20 h-px bg-deep-walnut/15">
          <motion.div className="h-full bg-deep-walnut origin-left" style={{ width: progressWidth }} />
        </div>

        <motion.div
          style={{ x }}
          className="flex h-full"
          // Dynamic width based on actual item count
          // Each item is 100vw, so total = count * 100vw
        >
          {collections.map((item) => (
            <div
              key={item.id}
              className="relative h-full flex items-center justify-center p-8 lg:p-24 flex-shrink-0"
              style={{ width: '100vw' }}
            >
              <div className="absolute left-4 bottom-12 font-header text-[80px] md:text-[220px] leading-none text-deep-walnut/[0.08] pointer-events-none">
                0{item.id}
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto">
                <div className="w-full sm:w-4/5 lg:w-1/2 relative group" style={{ perspective: '1000px' }}>
                  <div className="relative aspect-[4/5] rounded-xl border border-deep-walnut/20 bg-gradient-to-br from-void-start to-void-end transform-style-3d">
                    {/* The Product Inside */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-8 lg:p-12"
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
                      initial={{ rotateY: 0 }}
                      whileInView={{ rotateY: -105 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left center' }}
                      className="absolute inset-0 bg-deep-walnut border border-champagne-gold/20 rounded-xl z-10 shadow-2xl flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[url('/wood-grain.jpg')] opacity-20 mix-blend-overlay" />
                      <div className="w-16 h-16 rounded-full border border-champagne-gold/30 flex items-center justify-center">
                        <span className="font-display text-2xl text-champagne-gold">G</span>
                      </div>
                    </motion.div>
                    
                    <div className="absolute inset-0 bg-espresso/10 transition-opacity group-hover:opacity-0 pointer-events-none" />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-start gap-6">
                  <span className="font-accent text-[10px] tracking-[0.2em] font-medium text-deep-walnut uppercase">
                    Collection // {item.wood}
                  </span>
                  <h3 className="font-header text-5xl lg:text-7xl text-espresso text-balance leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-french italic text-xl lg:text-3xl leading-tight text-espresso opacity-80">
                    {item.tagline}
                  </p>

                  <Link to={`/product/${item.slug}`} className="mt-8 group flex items-center gap-4 text-espresso font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-6 py-4 border border-espresso/20 hover:border-espresso transition-colors">
                    <span className="relative z-10">Explore</span>
                    <span className="relative z-10 h-px w-10 bg-espresso" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
