import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Clock, Send, Check } from 'lucide-react';

const FORMSPREE_ID = 'xpwdgejq'; // User's Formspree endpoint

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-deep-walnut pt-36 pb-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">Get In Touch</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Let's <span className="italic font-light">Talk</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-10">
            {[
              { icon: Mail, label: 'Email', value: 'hello@gamen.eg', href: 'mailto:hello@gamen.eg' },
              { icon: MapPin, label: 'Atelier', value: 'Cairo, Egypt', href: undefined },
              { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} strokeWidth={1} className="text-champagne-gold/60" />
                </div>
                <div>
                  <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/40 block mb-1">{label}</span>
                  {href ? (
                    <a href={href} className="font-body text-sm text-champagne-gold hover:text-warm-cream transition-colors">{value}</a>
                  ) : (
                    <span className="font-body text-sm text-champagne-gold">{value}</span>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-champagne-gold/10 pt-10">
              <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/40 mb-4">Custom Orders</h3>
              <p className="font-body text-sm text-warm-cream/60 leading-relaxed">
                Looking for a bespoke piece? Whether it's a unique wood selection, personalised engraving, or a custom motif, 
                we'd love to bring your vision to life. Reach out with your idea and we'll craft something extraordinary.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-champagne-gold/10 flex items-center justify-center mb-4">
                  <Check size={24} className="text-champagne-gold" />
                </div>
                <h3 className="font-header text-2xl text-champagne-gold">Message Sent</h3>
                <p className="font-body text-sm text-warm-cream/50">We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { name: 'name', label: 'Your Name', type: 'text' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/40 block mb-3">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required
                      className="w-full bg-transparent border-b border-champagne-gold/20 focus:border-champagne-gold outline-none text-warm-cream font-body text-sm py-3 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/40 block mb-3">Subject</label>
                  <select
                    name="subject"
                    required
                    className="w-full bg-transparent border-b border-champagne-gold/20 focus:border-champagne-gold outline-none text-warm-cream font-body text-sm py-3 transition-colors"
                  >
                    <option value="" className="bg-deep-walnut">Select a topic</option>
                    <option value="General Inquiry" className="bg-deep-walnut">General Inquiry</option>
                    <option value="Custom Order" className="bg-deep-walnut">Custom Order</option>
                    <option value="Wholesale" className="bg-deep-walnut">Wholesale</option>
                    <option value="Press" className="bg-deep-walnut">Press</option>
                    <option value="Other" className="bg-deep-walnut">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-accent text-[10px] uppercase tracking-[0.2em] text-warm-cream/40 block mb-3">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-champagne-gold/20 focus:border-champagne-gold outline-none text-warm-cream font-body text-sm py-3 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-3 px-8 py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors disabled:opacity-50"
                >
                  <Send size={14} strokeWidth={1.5} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
