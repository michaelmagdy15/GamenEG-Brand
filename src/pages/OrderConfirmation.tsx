import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ShoppingBag, Loader, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { updateOrderPaymentStatus, sendEmailNotification } from '../lib/firestore';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  
  // Local states for card payment processing
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [txnId, setTxnId] = useState<string | null>(null);
  
  // Basic order info
  const [orderInfo, setOrderInfo] = useState<{ orderRef: string; customerName: string } | null>(() => {
    if (location.state) return location.state as { orderRef: string; customerName: string };
    try {
      const backup = sessionStorage.getItem('last_order');
      return backup ? JSON.parse(backup) : null;
    } catch (err) {
      console.warn('Failed to load order receipt backup:', err);
      return null;
    }
  });

  const orderRefFromUrl = searchParams.get('order');
  const paymentSuccess = searchParams.get('success');
  const paymobTxnId = searchParams.get('id');

  useEffect(() => {
    // If redirected from Paymob
    if (paymentSuccess !== null && orderRefFromUrl) {
      setTxnId(paymobTxnId);
      
      if (paymentSuccess === 'true') {
        setPaymentState('processing');
        
        const processSuccessfulPayment = async () => {
          try {
            // 1. Update Firestore payment status
            await updateOrderPaymentStatus(orderRefFromUrl, 'paid', 'confirmed', paymobTxnId || undefined);
            
            // 2. Retrieve cached order from sessionStorage and send confirmation email
            const cachedOrderStr = sessionStorage.getItem('gamen_pending_order');
            if (cachedOrderStr) {
              const cachedOrder = JSON.parse(cachedOrderStr);
              // Send confirmation email
              await sendEmailNotification({
                ...cachedOrder,
                paymentStatus: 'paid',
                status: 'confirmed',
                paymobTxnId: paymobTxnId || undefined
              });
              // Clear cached order details
              sessionStorage.removeItem('gamen_pending_order');
            }
            
            // 3. Clear cart since payment completed
            clearCart();
            setPaymentState('success');
            
            // 4. Update the orderInfo state so we display the correct order reference and name
            setOrderInfo({
              orderRef: orderRefFromUrl,
              customerName: orderInfo?.customerName || 'GΛMÉN Guest'
            });

            // Clean query parameters from URL
            navigate('/order-confirmation', { replace: true });
          } catch (err) {
            console.error('Error processing successful order payment:', err);
            // Even if email/Firestore update fails, we display success to customer
            clearCart();
            setPaymentState('success');
          }
        };

        processSuccessfulPayment();
      } else if (paymentSuccess === 'false') {
        // Payment failed flow
        setPaymentState('failed');
        
        const processFailedPayment = async () => {
          try {
            await updateOrderPaymentStatus(orderRefFromUrl, 'failed', 'pending', paymobTxnId || undefined);
          } catch (err) {
            console.error('Error updating failed order status:', err);
          }
        };
        
        processFailedPayment();
      }
    } else {
      // Normal flow (Cash on Delivery or direct navigation)
      if (!orderInfo?.orderRef) {
        navigate('/shop', { replace: true });
      }
    }
  }, [paymentSuccess, orderRefFromUrl, paymobTxnId, navigate, clearCart]);

  if (paymentState === 'processing') {
    return (
      <div className="min-h-screen bg-deep-walnut flex flex-col items-center justify-center gap-6 text-center px-6">
        <Loader size={48} strokeWidth={1} className="text-champagne-gold animate-spin" />
        <h2 className="font-header text-2xl text-champagne-gold">Verifying Payment</h2>
        <p className="font-body text-warm-cream/50 text-xs max-w-xs leading-relaxed">
          Please do not refresh the page or close your browser window. We are confirming your transaction...
        </p>
      </div>
    );
  }

  const { orderRef, customerName } = orderInfo || {};

  return (
    <div className="min-h-screen bg-deep-walnut flex items-center justify-center px-6 py-24 grain-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full text-center relative z-10"
      >
        {paymentState === 'failed' ? (
          /* PAYMENT FAILED VIEW */
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full border border-red-500/30 bg-red-500/5 flex items-center justify-center mx-auto mb-8"
            >
              <XCircle size={36} strokeWidth={0.8} className="text-red-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-red-400 mb-3">
                Transaction Declined
              </p>
              <h1 className="font-header text-4xl text-champagne-gold mb-4">
                Payment Failed
              </h1>
              <p className="font-body text-warm-cream/60 text-sm leading-relaxed mb-8">
                Your payment transaction could not be processed. Your card was not charged, and your selection is still saved in your bag.
              </p>
            </motion.div>

            {orderRefFromUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-warm-cream/3 border border-champagne-gold/15 px-8 py-4 mb-10 text-center"
              >
                <p className="font-accent text-[9px] uppercase tracking-[0.2em] text-warm-cream/40 mb-1">
                  Order Reference
                </p>
                <p className="font-header text-base text-champagne-gold tracking-wider font-mono">{orderRefFromUrl}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/checkout"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors cursor-pointer"
              >
                <ArrowRight size={14} />
                Return & Retry
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 border border-champagne-gold/20 text-champagne-gold/60 font-accent text-[10px] uppercase tracking-[0.2em] hover:border-champagne-gold/40 hover:text-champagne-gold transition-colors"
              >
                Back to Shop
              </Link>
            </motion.div>
          </>
        ) : (
          /* SUCCESS VIEW (COD OR PAID) */
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full border border-champagne-gold/30 bg-champagne-gold/5 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle size={36} strokeWidth={0.8} className="text-champagne-gold" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3">
                {paymentState === 'success' ? 'Payment Verified' : 'Order Received'}
              </p>
              <h1 className="font-header text-4xl md:text-5xl text-champagne-gold mb-4">
                Merci, {customerName?.split(' ')[0] || 'Customer'}.
              </h1>
              <p className="font-body text-warm-cream/60 text-sm leading-relaxed mb-8">
                {paymentState === 'success' 
                  ? 'Your payment was successfully processed. We have sent a confirmation email and will be in touch shortly to coordinate delivery.' 
                  : "Your order has been received and is being reviewed. We'll reach out within 24 hours to confirm the details and arrange delivery."
                }
              </p>
            </motion.div>

            {/* Order Ref & Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-warm-cream/3 border border-champagne-gold/15 px-8 py-5 mb-10"
            >
              <p className="font-accent text-[9px] uppercase tracking-[0.2em] text-warm-cream/40 mb-2">
                Order Reference
              </p>
              <p className="font-header text-xl text-champagne-gold tracking-wider">{orderRef || orderRefFromUrl}</p>
              
              {txnId && (
                <div className="mt-4 pt-4 border-t border-champagne-gold/10">
                  <p className="font-accent text-[9px] uppercase tracking-[0.2em] text-warm-cream/40 mb-1">
                    Transaction Receipt
                  </p>
                  <p className="font-body text-[10px] text-warm-cream/50 font-mono tracking-wider">{txnId}</p>
                </div>
              )}
              
              <p className="font-body text-[11px] text-warm-cream/30 mt-3">
                Please save this reference for your records.
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
          </>
        )}
      </motion.div>
    </div>
  );
}
