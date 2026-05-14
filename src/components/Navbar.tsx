import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Menu, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(247, 243, 237, 0)', 'rgba(247, 243, 237, 0.85)']
  );
  
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(20px)']
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav 
      style={{ backgroundColor, backdropFilter }}
      className="fixed top-0 left-0 right-0 z-40 px-10 py-10 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full z-20">
        
        {/* Mobile Menu */}
        <button className="lg:hidden text-espresso">
          <Menu size={24} strokeWidth={1} />
        </button>

        {/* Center Logo */}
        <a href="#" className="flex-shrink-0 text-center mr-auto lg:mr-0 pl-4 lg:pl-0">
          <h1 className="font-display text-2xl font-bold tracking-[0.3em] uppercase text-espresso">
            Gamén
          </h1>
        </a>

        {/* Links Right */}
        <div className="hidden lg:flex items-center gap-12 font-accent text-[10px] tracking-[0.2em] font-medium uppercase text-espresso">
          <a href="#" className="hover:text-champagne-gold transition-colors">Collections</a>
          <a href="#" className="hover:text-champagne-gold transition-colors">The Atelier</a>
          <a href="#" className="hover:text-champagne-gold transition-colors">Custom</a>
          <a href="#" className="hover:text-champagne-gold transition-colors">Bespoke</a>
        </div>

        <div className="hidden lg:block bg-gold-gradient w-12 h-[1px]"></div>

        {/* Cart */}
        <button className="text-espresso flex items-center gap-2 lg:hidden">
          <ShoppingBag size={20} strokeWidth={1} />
        </button>
      </div>
    </motion.nav>
  );
}
