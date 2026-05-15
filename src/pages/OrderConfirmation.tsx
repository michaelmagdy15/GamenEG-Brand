// src/pages/OrderConfirmation.tsx
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderRef, customerName } = (location.state as { orderRef: string; customerName: string }) || {};

  useEffect(() => {
    if (!orderRef) navigate('/shop', { replace: true });
  }, [orderRef, navigate]);

  if (!orderRef) return null;

  return (
    <div className="min-h-screen bg-deep-walnut flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full border border-champagne-gold/30 bg-champagne-gold/5 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={36} strokeWidth={0.8} className="text-champagne-gold" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3">
            Order Received
          </p>
          <h1 className="font-header text-4xl md:text-5xl text-champagne-gold mb-4">
            Merci, {customerName?.split(' ')[0]}.
          </h1>
          <p className="font-body text-warm-cream/60 text-sm leading-relaxed mb-8">
            Your order has been received and is being reviewed. We'll reach out within 24 hours to
            confirm the details and arrange delivery.
          </p>
        </motion.div>

        {/* Order Ref */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-warm-cream/3 border border-champagne-gold/15 px-8 py-5 mb-10"
        >
          <p className="font-accent text-[9px] uppercase tracking-[0.2em] text-warm-cream/40 mb-2">
            Order Reference
          </p>
          <p className="font-header text-xl text-champagne-gold tracking-wider">{orderRef}</p>
          <p className="font-body text-[11px] text-warm-cream/30 mt-2">
            Keep this reference for your records.
          </p>
        </motion.div>

        {/* Hieroglyph divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="flex-1 h-px bg-champagne-gold/10" />
          <span className="text-champagne-gold/20 text-lg">𓂀</span>
          <div className="flex-1 h-px bg-champagne-gold/10" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors"
          >
            <ShoppingBag size={14} />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 border border-champagne-gold/20 text-champagne-gold/60 font-accent text-[10px] uppercase tracking-[0.2em] hover:border-champagne-gold/40 hover:text-champagne-gold transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
