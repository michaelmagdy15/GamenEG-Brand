import { useState, useEffect } from 'react';
import { useScroll } from 'motion/react';
import { Menu, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandWordmark from './BrandWordmark';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 py-8 transition-colors duration-500 ${
        isScrolled ? 'bg-deep-walnut/90' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full z-20">
        <button className="lg:hidden text-champagne-gold" aria-label="Open navigation">
          <Menu size={24} strokeWidth={1} />
        </button>

        <Link to="/" className="flex-shrink-0 text-center mr-auto lg:mr-0 pl-4 lg:pl-0">
          <BrandWordmark className="block text-2xl tracking-[0.3em] text-champagne-gold" />
        </Link>

        <div className="hidden lg:flex items-center gap-12 font-accent text-[10px] tracking-[0.2em] font-medium uppercase text-champagne-gold">
          <Link to="/" className="hover:text-warm-cream transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-warm-cream transition-colors">Shop</Link>
          <Link to="/services" className="hover:text-warm-cream transition-colors">Services</Link>
          <Link to="/about" className="hover:text-warm-cream transition-colors">About Us</Link>
        </div>

        <div className="hidden lg:block bg-gold-gradient w-12 h-[1px]" />

        <button className="text-champagne-gold flex items-center gap-2 lg:hidden" aria-label="Open cart">
          <ShoppingBag size={20} strokeWidth={1} />
        </button>
      </div>

      {isScrolled && <div className="absolute inset-x-0 bottom-0 h-px bg-champagne-gold/20" />}
    </nav>
  );
}
