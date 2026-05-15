import { motion } from 'motion/react';
import { Package, Globe, RotateCcw, Clock, Shield } from 'lucide-react';

export default function ShippingReturns() {
  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">Logistics</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Shipping & <span className="italic font-light">Returns</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto" />
        </motion.div>

        {/* Shipping */}
        <section className="mb-20">
          <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-8">Shipping</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Packaging', text: 'Every order ships in our signature presentation box, wrapped in tissue and sealed with the GΛMÉN wax stamp.' },
              { icon: Globe, title: 'Worldwide', text: 'We ship to over 50 countries. International orders are dispatched via tracked express courier.' },
              { icon: Clock, title: 'Timing', text: 'Domestic (Egypt): 2-4 business days. International: 5-10 business days. Custom orders: 2-3 weeks.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-xl border border-champagne-gold/10">
                <Icon size={20} strokeWidth={1} className="text-champagne-gold/50 mb-4" />
                <h3 className="font-header text-lg text-champagne-gold mb-2">{title}</h3>
                <p className="font-body text-xs text-warm-cream/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rates */}
        <section className="mb-20">
          <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-8">Rates</h2>
          <div className="border border-champagne-gold/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-champagne-gold/10">
                  <th className="text-left py-4 px-6 font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/40">Destination</th>
                  <th className="text-left py-4 px-6 font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/40">Standard</th>
                  <th className="text-left py-4 px-6 font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/40">Express</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm text-warm-cream/70">
                <tr className="border-b border-champagne-gold/5">
                  <td className="py-4 px-6">Egypt</td>
                  <td className="py-4 px-6">Free</td>
                  <td className="py-4 px-6">$5</td>
                </tr>
                <tr className="border-b border-champagne-gold/5">
                  <td className="py-4 px-6">Middle East</td>
                  <td className="py-4 px-6">$10</td>
                  <td className="py-4 px-6">$20</td>
                </tr>
                <tr className="border-b border-champagne-gold/5">
                  <td className="py-4 px-6">Europe</td>
                  <td className="py-4 px-6">$15</td>
                  <td className="py-4 px-6">$30</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Rest of World</td>
                  <td className="py-4 px-6">$20</td>
                  <td className="py-4 px-6">$40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Returns */}
        <section>
          <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-8">Returns & Exchanges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-champagne-gold/10">
              <RotateCcw size={20} strokeWidth={1} className="text-champagne-gold/50 mb-4" />
              <h3 className="font-header text-lg text-champagne-gold mb-2">14-Day Returns</h3>
              <p className="font-body text-xs text-warm-cream/60 leading-relaxed">
                We accept returns within 14 days of delivery for non-custom items. Pieces must be unworn and in original packaging. 
                Contact us to initiate a return and we will provide a prepaid shipping label.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-champagne-gold/10">
              <Shield size={20} strokeWidth={1} className="text-champagne-gold/50 mb-4" />
              <h3 className="font-header text-lg text-champagne-gold mb-2">Quality Guarantee</h3>
              <p className="font-body text-xs text-warm-cream/60 leading-relaxed">
                Every GΛMÉN piece is backed by a 1-year craftsmanship guarantee. If you discover a defect in materials 
                or workmanship, we will repair or replace the piece at no cost.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
