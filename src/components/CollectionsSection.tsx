import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { collections } from '../data/products';

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-warm-cream">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-28 left-6 right-6 md:left-12 md:right-12 z-20 h-px bg-deep-walnut/15">
          <motion.div className="h-full bg-deep-walnut origin-left" style={{ width: progressWidth, willChange: 'width' }} />
        </div>

        <motion.div style={{ x, willChange: 'transform' }} className="flex h-full w-[300vw]">
          {collections.map((item, index) => {
            const imageRotate = index % 2 === 0 ? '-2deg' : '2deg';

            return (
              <div key={item.id} className="relative w-screen h-full flex items-center justify-center p-8 lg:p-24">
                <div className="absolute left-4 bottom-12 font-header text-[80px] md:text-[220px] leading-none text-deep-walnut/[0.08] pointer-events-none">
                  0{item.id}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto">
                  <motion.div
                    className="w-full sm:w-4/5 lg:w-1/2 relative group"
                    whileHover={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  >
                    <div className="overflow-hidden bg-gradient-to-br from-void-start to-void-end aspect-[4/5] rounded-xl shadow-2xl relative border border-deep-walnut/20">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-8 lg:p-12 drop-shadow-2xl transition-transform duration-1000 group-hover:scale-110"
                        initial={{ rotate: imageRotate, scale: 0.9 }}
                        whileInView={{ rotate: '0deg', scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-espresso/10 transition-opacity group-hover:opacity-0" />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep-walnut/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>

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

                    <button className="mt-8 group flex items-center gap-4 text-espresso font-accent text-[10px] tracking-[0.2em] font-medium uppercase relative overflow-hidden px-6 py-4 border border-espresso/20 hover:border-espresso transition-colors">
                      <span className="relative z-10 transition-transform group-hover:-translate-y-1">Explore</span>
                      <span className="relative z-10 h-px w-10 bg-espresso transition-transform group-hover:translate-x-2" />
                      <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
