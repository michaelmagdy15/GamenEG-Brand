import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandWordmark from './BrandWordmark';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav"
          className="fixed inset-0 z-50 bg-deep-walnut flex flex-col items-center justify-center grain-overlay"
          initial={{ clipPath: 'circle(0% at top right)' }}
          animate={{ clipPath: 'circle(150% at top right)' }}
          exit={{ clipPath: 'circle(0% at top right)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-6 sm:right-10 text-champagne-gold z-10"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            aria-label="Close navigation"
          >
            <X size={28} strokeWidth={1} />
          </motion.button>

          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-16"
          >
            <BrandWordmark className="text-4xl tracking-[0.3em] text-champagne-gold" />
          </motion.div>

          {/* Nav links — staggered reveal */}
          <nav className="flex flex-col items-center gap-8">
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: 0.3 + i * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="font-header text-4xl sm:text-5xl text-warm-cream hover:text-champagne-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute bottom-12 text-center"
          >
            <p className="font-french italic text-champagne-gold/50 text-lg">
              L'élégance taillée en bois
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
