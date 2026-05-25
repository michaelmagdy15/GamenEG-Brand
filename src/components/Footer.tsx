import { useState, type FormEvent } from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import BrandWordmark from './BrandWordmark';
import { subscribeToNewsletter } from '../lib/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await subscribeToNewsletter(email, 'footer');
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-deep-walnut text-warm-cream py-24 px-4 sm:px-8 border-t border-champagne-gold/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="col-span-1 lg:col-span-2">
          <BrandWordmark className="block text-4xl tracking-[0.2em] mb-6 text-champagne-gold" />
          <p className="font-french italic text-champagne-gold text-2xl mb-12">L'elegance taillee en bois.</p>

          <div className="max-w-md">
            <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-4">THE GΛMÉN CIRCLE</h3>
            <p className="font-body text-sm text-warm-cream/70 mb-6">
              Invitations to private viewings, new wood drops, and artisan meetups.
            </p>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-body text-sm text-champagne-gold"
                >
                  Welcome to the circle.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleNewsletter}
                  className="flex border-b border-warm-cream/30 focus-within:border-champagne-gold transition-colors pb-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="bg-transparent border-none outline-none text-warm-cream placeholder-warm-cream/30 flex-grow font-body text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold hover:text-warm-cream transition-colors disabled:opacity-50 min-w-[40px] text-right"
                  >
                    {loading ? '...' : 'JOIN'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-6">ΛTELIER</h3>
          <ul className="space-y-4 font-body text-sm text-warm-cream/80">
            <li><Link to="/shop" className="hover:text-champagne-gold transition-colors">Collections</Link></li>
            <li><Link to="/craftsmanship" className="hover:text-champagne-gold transition-colors">Craftsmanship</Link></li>
            <li><Link to="/contact" className="hover:text-champagne-gold transition-colors">Custom Orders</Link></li>
            <li><Link to="/our-story" className="hover:text-champagne-gold transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-6">ΛSSISTΛNCE</h3>
          <ul className="space-y-4 font-body text-sm text-warm-cream/80 mb-12">
            <li><Link to="/shipping" className="hover:text-champagne-gold transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/care" className="hover:text-champagne-gold transition-colors">Care Instructions</Link></li>
            <li><Link to="/contact" className="hover:text-champagne-gold transition-colors">Contact</Link></li>
          </ul>

          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-warm-cream/50 hover:text-champagne-gold transition-colors p-3 -m-3 min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Instagram"><Instagram size={20} strokeWidth={1.5} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-warm-cream/50 hover:text-champagne-gold transition-colors p-3 -m-3 min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Facebook"><Facebook size={20} strokeWidth={1.5} /></a>
            <a href="mailto:gamen.eg@gmail.com" className="text-warm-cream/50 hover:text-champagne-gold transition-colors p-3 -m-3 min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Email"><Mail size={20} strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-warm-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 font-body text-xs text-warm-cream/40">
        <p>&copy; {new Date().getFullYear()} GΛMÉN. Λll rights reserved.</p>
        <div className="flex gap-4">
          <span>Cairo, Egypt.</span>
          <span>Wherever you are.</span>
        </div>
      </div>
    </footer>
  );
}
