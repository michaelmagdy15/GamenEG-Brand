import { useState, useEffect } from 'react';
import { useScroll } from 'motion/react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import BrandWordmark from './BrandWordmark';
import { useCart } from '../context/CartContext';
import MagneticWrapper from './MagneticWrapper';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/#how-to-use', label: 'How to Use' },
  { to: '/craftsmanship', label: 'Craftsmanship' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20); // Solidify background earlier on scroll to ensure visual contrast
    });
  }, [scrollY]);

  // Capture ESC key event to close mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Trap focus inside mobile drawer when open (WCAG 2.4.3 Focus Order)
  useEffect(() => {
    if (!mobileOpen) return;
    const focusableElements = 'button, [href], input, select, textarea, [tabindex="0"]';
    
    const focusTimeout = setTimeout(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return;
      const focusableContent = modal.querySelectorAll(focusableElements);
      if (focusableContent.length === 0) return;
      const firstFocusableElement = focusableContent[0] as HTMLElement;
      const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      firstFocusableElement.focus();

      return () => window.removeEventListener('keydown', handleTabKey);
    }, 50);

    return () => clearTimeout(focusTimeout);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 pt-[max(env(safe-area-inset-top),1.5rem)] pb-6 transition-colors duration-500 ${
          isScrolled ? 'bg-deep-walnut/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full z-20">
          <button
            className="lg:hidden text-champagne-gold -ml-2 p-2 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} strokeWidth={1} />
          </button>

          <Link to="/" className="flex-shrink-0 text-center mr-auto lg:mr-0 pl-4 lg:pl-0 min-h-[48px] flex items-center" aria-label="Gamen brand logo">
            <BrandWordmark className="block text-2xl tracking-[0.3em] text-champagne-gold" />
          </Link>

          <div className="hidden lg:flex items-center gap-10 font-accent text-[10px] tracking-[0.2em] font-medium uppercase text-champagne-gold">
            {navLinks.map((link) => (
              <MagneticWrapper key={link.to} strength={0.25}>
                <Link
                  to={link.to}
                  className={`nav-link hover:text-warm-cream transition-colors ${
                    location.pathname === link.to ? 'nav-link active text-warm-cream' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </MagneticWrapper>
            ))}
          </div>

          <div className="hidden lg:block bg-gold-gradient w-12 h-[1px]" />

          <button
            className="text-champagne-gold flex items-center gap-2 relative p-2 min-w-[48px] min-h-[48px] justify-center"
            aria-label="Open cart"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag size={20} strokeWidth={1} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-champagne-gold text-deep-walnut text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {isScrolled && <div className="absolute inset-x-0 bottom-0 h-px bg-champagne-gold/20" />}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              className="fixed left-0 top-0 bottom-0 w-[80vw] max-w-sm bg-deep-walnut z-50 flex flex-col border-r border-champagne-gold/15"
            >
              <div className="flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-6 border-b border-champagne-gold/15">
                <BrandWordmark className="text-lg tracking-[0.2em] text-champagne-gold" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-champagne-gold/60 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1} />
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2 px-6 py-8 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-header text-2xl py-4 min-h-[52px] flex items-center transition-colors ${
                      location.pathname === link.to ? 'text-champagne-gold' : 'text-warm-cream/60 hover:text-champagne-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-auto pt-8 border-t border-champagne-gold/10 space-y-3 safe-bottom">
                  <Link to="/care" className="block font-body text-sm text-warm-cream/40 hover:text-champagne-gold transition-colors min-h-[48px] flex items-center py-2">Care Instructions</Link>
                  <Link to="/shipping" className="block font-body text-sm text-warm-cream/40 hover:text-champagne-gold transition-colors min-h-[48px] flex items-center py-2">Shipping &amp; Returns</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
