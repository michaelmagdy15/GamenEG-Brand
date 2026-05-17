import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-deep-walnut z-50 flex flex-col border-l border-champagne-gold/15"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-champagne-gold/15">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1} className="text-champagne-gold" />
                <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold">
                  Your Bag ({totalItems})
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-champagne-gold/60 hover:text-champagne-gold transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} strokeWidth={0.5} className="text-champagne-gold/30" />
                  <p className="font-body text-sm text-warm-cream/50">Your bag is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-warm-cream/5 flex-shrink-0 flex items-center justify-center p-2">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-header text-sm text-champagne-gold truncate">{item.product.name}</h4>
                      <p className="font-body text-xs text-warm-cream/50 mt-1">{item.product.wood}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-11 h-11 flex items-center justify-center border border-champagne-gold/20 text-champagne-gold/60 hover:text-champagne-gold transition-colors touch-manipulation"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-body text-xs text-warm-cream w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-11 h-11 flex items-center justify-center border border-champagne-gold/20 text-champagne-gold/60 hover:text-champagne-gold transition-colors touch-manipulation"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-accent text-xs text-champagne-gold">LE {item.product.price * item.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-warm-cream/30 hover:text-warm-cream/60 transition-colors self-start"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-champagne-gold/15 mt-auto">
              {items.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/60">Total</span>
                    <span className="font-header text-2xl text-champagne-gold">LE {totalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                    className="w-full mb-3 py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 border border-champagne-gold/20 text-champagne-gold font-accent text-[10px] uppercase tracking-[0.2em] hover:bg-champagne-gold/10 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
