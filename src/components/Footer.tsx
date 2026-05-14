import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deep-walnut text-warm-cream py-24 px-4 sm:px-8 border-t border-champagne-gold/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        <div className="col-span-1 lg:col-span-2">
          <h2 className="font-display text-4xl tracking-[0.2em] uppercase mb-6 text-warm-cream">Gamén</h2>
          <p className="font-french italic text-champagne-gold text-2xl mb-12">L'élégance taillée en bois.</p>
          
          <div className="max-w-md">
            <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-4">THE GAMÉN CIRCLE</h3>
            <p className="font-body text-sm text-warm-cream/70 mb-6">
              Invitations to private viewings, new wood drops, and artisan meetups.
            </p>
            <div className="flex border-b border-warm-cream/30 focus-within:border-champagne-gold transition-colors pb-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-none outline-none text-warm-cream placeholder-warm-cream/30 flex-grow font-body text-sm"
              />
              <button className="font-accent text-[10px] uppercase tracking-[0.2em] font-medium text-champagne-gold hover:text-warm-cream transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-6">ATELIER</h3>
          <ul className="space-y-4 font-body text-sm text-warm-cream/80">
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Craftsmanship</a></li>
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Custom Orders</a></li>
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Our Story</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/50 mb-6">ASSISTANCE</h3>
          <ul className="space-y-4 font-body text-sm text-warm-cream/80 mb-12">
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Care Instructions</a></li>
            <li><a href="#" className="hover:text-champagne-gold transition-colors">Contact</a></li>
          </ul>
          
          <div className="flex gap-6">
            <a href="#" className="text-warm-cream/50 hover:text-champagne-gold transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-warm-cream/50 hover:text-champagne-gold transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-warm-cream/50 hover:text-champagne-gold transition-colors"><Mail size={20} strokeWidth={1.5} /></a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-warm-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 font-body text-xs text-warm-cream/40">
        <p>&copy; {new Date().getFullYear()} GAMÉN. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Cairo.</span>
          <span>Paris.</span>
          <span>Wherever you are.</span>
        </div>
      </div>
    </footer>
  );
}
