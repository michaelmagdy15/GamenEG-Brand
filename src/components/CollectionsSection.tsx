import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const collections = [
  {
    id: 1,
    name: 'GAMÉN Forme du Temps',
    tagline: 'Time, shaped with intention.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2588&auto=format&fit=crop',
    wood: 'Walnut',
  },
  {
    id: 2,
    name: 'Éclipse Du Bois',
    tagline: 'Crafted in contrast.',
    image: 'https://images.unsplash.com/photo-1620002093354-15206f0e21a8?q=80&w=2670&auto=format&fit=crop',
    wood: 'Ebony & Olive',
  },
  {
    id: 3,
    name: 'Ankh Éternel',
    tagline: 'The Egyptian soul.',
    image: 'https://images.unsplash.com/photo-1596766442654-2c06adbbcdbf?q=80&w=2670&auto=format&fit=crop',
    wood: 'Mahogany',
  },
];

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // We have 3 items. As we scroll vertically 300vh, we translate the items horizontally.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%']);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-warm-cream">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          {collections.map((item) => (
            <div key={item.id} className="relative w-screen h-full flex items-center justify-center p-8 lg:p-24">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl mx-auto">
                <div className="w-full lg:w-1/2 relative group">
                  <div className="overflow-hidden bg-void-end aspect-[4/5] rounded-xl shadow-2xl relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-espresso/10 transition-opacity group-hover:opacity-0" />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-6">
                  <span className="font-accent text-[10px] tracking-[0.2em] font-medium text-champagne-gold uppercase">
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
                    <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
