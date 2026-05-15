// src/pages/Checkout.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../lib/firestore';

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hasSignature = items.some((i) => i.product.collection === 'signature');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateRef = () => {
    const now = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GM-${now}-${rand}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.city || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const orderRef = generateRef();
      await saveOrder({
        orderRef,
        status: 'pending',
        customer: form,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        totalPrice,
      });
      clearCart();
      navigate('/order-confirmation', { state: { orderRef, customerName: form.name } });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-deep-walnut flex flex-col items-center justify-center gap-6 text-center px-6">
        <ShoppingBag size={64} strokeWidth={0.5} className="text-champagne-gold/30" />
        <p className="font-body text-warm-cream/60">Your bag is empty.</p>
        <Link
          to="/shop"
          className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold border border-champagne-gold/30 px-8 py-3 hover:bg-champagne-gold hover:text-deep-walnut transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-walnut pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-warm-cream/40 hover:text-warm-cream/70 transition-colors mb-8 font-accent text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <h1 className="font-header text-4xl md:text-5xl text-champagne-gold">Checkout</h1>
          <p className="font-body text-warm-cream/50 mt-2 text-sm">
            Complete your order below — we'll be in touch to confirm.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Left: Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-6 pb-3 border-b border-champagne-gold/10">
                Contact Information
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Full Name *" name="name" value={form.name} onChange={handleChange} placeholder="Mohamed El Sayed" />
                <InputField label="Email *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                <InputField label="Phone *" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+20 1XX XXXX XXX" />
                <InputField label="City *" name="city" value={form.city} onChange={handleChange} placeholder="Cairo" />
              </div>
            </div>

            <div>
              <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-4">
                Delivery Address *
              </p>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address including building, floor, and apartment number…"
                rows={3}
                className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-body text-sm px-4 py-3 placeholder:text-warm-cream/25 focus:outline-none focus:border-champagne-gold/40 transition-colors resize-none"
              />
            </div>

            {hasSignature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-champagne-gold/5 border border-champagne-gold/20 p-5"
              >
                <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold mb-1">
                  Signature Monogram
                </p>
                <p className="font-body text-xs text-warm-cream/50 mb-3">
                  Your Signature piece includes a custom monogram. Enter your initials below (e.g., "M.A.E" or "MW").
                </p>
                <InputField
                  label="Your Initials"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="M.A.E"
                />
              </motion.div>
            )}

            {!hasSignature && (
              <div>
                <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2">
                  Order Notes (Optional)
                </p>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Gift wrapping, special requests, gifting occasion…"
                  rows={2}
                  className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-body text-sm px-4 py-3 placeholder:text-warm-cream/25 focus:outline-none focus:border-champagne-gold/40 transition-colors resize-none"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 font-body text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border border-deep-walnut/40 border-t-deep-walnut rounded-full animate-spin" />
                  Placing Order…
                </>
              ) : (
                <>
                  Place Order
                  <ChevronRight size={14} />
                </>
              )}
            </button>

            <p className="font-body text-xs text-warm-cream/30 text-center">
              We'll contact you within 24 hours to confirm your order and arrange delivery.
            </p>
          </motion.form>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="bg-warm-cream/3 border border-champagne-gold/10 p-6">
              <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-6 pb-3 border-b border-champagne-gold/10">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </p>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-warm-cream/5 flex-shrink-0 flex items-center justify-center p-1">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-header text-xs text-champagne-gold truncate">{item.product.name}</h4>
                      <p className="font-body text-[11px] text-warm-cream/40 mt-0.5">{item.product.wood}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-body text-[11px] text-warm-cream/40">Qty: {item.quantity}</span>
                        <span className="font-accent text-xs text-champagne-gold">
                          LE {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-champagne-gold/10 space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-xs text-warm-cream/40">Subtotal</span>
                  <span className="font-body text-xs text-warm-cream/70">LE {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs text-warm-cream/40">Shipping</span>
                  <span className="font-body text-xs text-warm-cream/40">Arranged on confirmation</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-champagne-gold/10">
                  <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/60">Total</span>
                  <span className="font-header text-xl text-champagne-gold">LE {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-accent text-[9px] uppercase tracking-[0.15em] text-warm-cream/40 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-body text-sm px-4 py-3 placeholder:text-warm-cream/25 focus:outline-none focus:border-champagne-gold/40 transition-colors"
      />
    </div>
  );
}
