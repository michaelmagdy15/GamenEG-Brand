// src/pages/PaymentMock.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ShieldCheck, ArrowLeft, Loader, HelpCircle } from 'lucide-react';

export default function PaymentMock() {
  const [searchParams] = useSearchParams();
  
  // Extract parameters passed from the Checkout process
  const orderRef = searchParams.get('orderRef') || 'GM-UNKNOWN';
  const amount = searchParams.get('amount') || '0';
  const customerName = searchParams.get('customerName') || 'GΛMÉN Customer';
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState(customerName);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-clear error when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [cardNumber, expiry, cvv, cardName]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Format with spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const fillTestDetails = () => {
    setCardNumber('4123 4567 8901 2345');
    setExpiry('12/29');
    setCvv('123');
    setCardName(customerName);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      setError('Please enter expiry date in MM/YY format.');
      return;
    }

    if (cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV code.');
      return;
    }

    if (!cardName.trim()) {
      setError('Cardholder name is required.');
      return;
    }

    setSubmitting(true);

    // Simulate Paymob gateway connection delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);

      // Wait a moment for success checkmark animation, then redirect to order-confirmation
      setTimeout(() => {
        const txnId = `TXN-MOCK-${Math.floor(10000000 + Math.random() * 90000000)}`;
        window.location.href = `/order-confirmation?success=true&id=${txnId}&order=${orderRef}&amount=${amount}`;
      }, 1500);
    }, 2500);
  };

  const handleCancel = () => {
    const txnId = `TXN-MOCK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    window.location.href = `/order-confirmation?success=false&id=${txnId}&order=${orderRef}&amount=${amount}`;
  };

  return (
    <div className="min-h-screen bg-deep-walnut flex items-center justify-center pt-24 pb-12 px-6 grain-overlay">
      <div className="max-w-md w-full relative z-10">
        
        {/* Paymob Mock Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-champagne-gold/20 bg-warm-cream/3 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-accent text-[9px] uppercase tracking-wider text-warm-cream/60">Paymob Sandbox Simulator</span>
          </div>
          <h1 className="font-header text-3xl text-champagne-gold tracking-wide">Secure Payment</h1>
          <p className="font-body text-warm-cream/50 text-xs mt-1">
            Order: <span className="font-mono text-champagne-gold">{orderRef}</span> • Amount: <span className="text-warm-cream">LE {parseFloat(amount).toLocaleString()}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-warm-cream/3 border border-champagne-gold/15 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-emerald-400" size={32} />
              </div>
              <h2 className="font-header text-xl text-champagne-gold mb-2">Payment Authorized</h2>
              <p className="font-body text-warm-cream/60 text-xs leading-relaxed">
                Your transaction has been approved. Redirecting you back to GΛMÉN to complete your order...
              </p>
              <div className="flex justify-center mt-6">
                <Loader className="text-champagne-gold animate-spin" size={20} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Interactive Card Preview */}
              <div className="w-full h-48 relative rounded-xl overflow-hidden [perspective:1000px] mb-6 select-none shadow-2xl">
                <div 
                  className={`w-full h-full duration-700 [transform-style:preserve-3d] relative ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  {/* Front of Card */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#2b140c] via-[#462718] to-[#180b06] border border-champagne-gold/25 rounded-xl p-6 flex flex-col justify-between [backface-visibility:hidden]">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-accent text-[8px] uppercase tracking-widest text-champagne-gold/60">Premium Card</span>
                        <span className="font-header text-lg text-champagne-gold tracking-widest mt-1">GΛMÉN</span>
                      </div>
                      <CreditCard className="text-champagne-gold/60" size={28} strokeWidth={1.2} />
                    </div>
                    
                    <div>
                      <div className="font-mono text-sm md:text-base text-warm-cream tracking-[0.2em] mb-4 min-h-[24px]">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="font-accent text-[7px] uppercase tracking-widest text-warm-cream/40">Cardholder</span>
                          <span className="font-body text-[10px] uppercase text-warm-cream tracking-wider truncate max-w-[180px] min-h-[15px]">
                            {cardName || 'YOUR FULL NAME'}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-accent text-[7px] uppercase tracking-widest text-warm-cream/40">Expires</span>
                          <span className="font-mono text-[10px] text-warm-cream tracking-widest min-h-[15px]">
                            {expiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#180b06] to-[#2b140c] border border-champagne-gold/25 rounded-xl flex flex-col justify-between py-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="w-full h-10 bg-black/60 mt-2" />
                    
                    <div className="px-6 flex justify-end items-center gap-3">
                      <span className="font-accent text-[7px] uppercase tracking-widest text-warm-cream/40">CVV</span>
                      <div className="bg-warm-cream/90 text-espresso font-mono text-xs px-3 py-1 font-bold rounded-sm tracking-widest">
                        {cvv || '•••'}
                      </div>
                    </div>

                    <div className="px-6 flex justify-between items-center text-[7px] font-body text-warm-cream/30">
                      <span>SECURE MOCK TRANSACTION</span>
                      <span>100% SECURED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <form onSubmit={handlePayment} className="bg-warm-cream/3 border border-champagne-gold/15 p-6 space-y-4 shadow-xl">
                
                {/* Auto fill helper */}
                <button
                  type="button"
                  onClick={fillTestDetails}
                  className="w-full min-h-[36px] bg-champagne-gold/10 hover:bg-champagne-gold/20 text-champagne-gold font-accent text-[9px] uppercase tracking-widest border border-champagne-gold/25 py-2 transition-all flex items-center justify-center gap-2"
                >
                  <HelpCircle size={12} />
                  Auto-Fill Test Card Credentials
                </button>

                <div>
                  <label htmlFor="mock-card-name" className="block font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/60 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    id="mock-card-name"
                    type="text"
                    required
                    value={cardName}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Mohamed El Sayed"
                    className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-body text-sm px-4 py-2.5 placeholder:text-warm-cream/20 focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="mock-card-number" className="block font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/60 mb-1.5">
                    Card Number
                  </label>
                  <input
                    id="mock-card-number"
                    type="text"
                    required
                    value={cardNumber}
                    onFocus={() => setIsFlipped(false)}
                    onChange={handleCardNumberChange}
                    placeholder="4123 4567 8901 2345"
                    className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-mono text-sm px-4 py-2.5 placeholder:text-warm-cream/20 focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mock-card-expiry" className="block font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/60 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      id="mock-card-expiry"
                      type="text"
                      required
                      value={expiry}
                      onFocus={() => setIsFlipped(false)}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-mono text-sm px-4 py-2.5 placeholder:text-warm-cream/20 focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 transition-colors text-center"
                    />
                  </div>
                  <div>
                    <label htmlFor="mock-card-cvv" className="block font-accent text-[10px] uppercase tracking-[0.15em] text-warm-cream/60 mb-1.5">
                      CVV / CV2
                    </label>
                    <input
                      id="mock-card-cvv"
                      type="password"
                      required
                      value={cvv}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="w-full bg-warm-cream/5 border border-champagne-gold/15 text-warm-cream font-mono text-sm px-4 py-2.5 placeholder:text-warm-cream/20 focus:outline-none focus:border-champagne-gold/40 focus:ring-1 focus:ring-champagne-gold/40 transition-colors text-center"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 font-body text-xs text-center">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[48px] py-3.5 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader className="animate-spin" size={14} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Authorize LE {parseFloat(amount).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                className="w-full min-h-[44px] border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-red-400 font-accent text-[9px] uppercase tracking-[0.2em] py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={12} />
                Cancel & Return to Merchant
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
