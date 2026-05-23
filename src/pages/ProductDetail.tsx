import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Shield, Truck, Leaf } from 'lucide-react';
import { useProductsContext } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import UnboxingExperience from '../components/UnboxingExperience';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, products, loading } = useProductsContext();
  const product = getProductBySlug(slug || '');
  const { addItem } = useCart();

  if (loading) {
    return (
      <main className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center bg-deep-walnut">
        <div className="w-16 h-16 border-t-2 border-champagne-gold border-solid rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center">
        <h1 className="font-header text-4xl text-champagne-gold mb-4">Product Not Found</h1>
        <Link to="/shop" className="font-accent text-sm text-champagne-gold/60 underline">Back to Shop</Link>
      </main>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": typeof window !== 'undefined' ? window.location.origin + product.image : product.image,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "EGP",
      "price": product.price,
      "availability": product.isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31"
    },
    "brand": {
      "@type": "Brand",
      "name": "GAMÉN"
    }
  };

  return (
    <main className="min-h-screen bg-deep-walnut">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Image Side */}
        <div className="w-full lg:w-1/2 min-h-[60vh] lg:min-h-screen relative bg-gradient-to-br from-warm-cream/5 to-warm-cream/10 flex items-center justify-center p-8 lg:p-16">
          <Link
            to="/shop"
            className="absolute top-28 left-6 lg:left-12 z-10 flex items-center gap-2 font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 hover:text-champagne-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <UnboxingExperience productImage={product.image} productName={product.name} />
        </div>

        {/* Info Side */}
        <div className="w-full lg:w-1/2 flex items-center px-6 sm:px-10 lg:px-16 py-16 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-lg"
          >
            <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">
              {product.category === 'bow-tie' ? 'Bow Tie Collection' : 'Timepiece Collection'} <span className="mx-2 text-champagne-gold/20">|</span> {product.wood}
            </span>

            <h1 className="font-header text-4xl sm:text-5xl lg:text-6xl text-champagne-gold leading-[0.95] mb-4">
              {product.name}
            </h1>

            <p className="font-french italic text-xl lg:text-2xl text-champagne-gold/70 mb-8">
              {product.tagline}
            </p>

            <p className="font-body text-sm leading-relaxed text-warm-cream/70 mb-10">
              {product.description}
            </p>

            {/* Price + Add to Bag */}
            <div className="flex items-end gap-8 mb-12">
              <span className="font-header text-4xl text-champagne-gold">LE {product.price.toLocaleString()}</span>
              <button
                onClick={() => addItem(product)}
                className="flex-1 max-w-xs flex items-center justify-center gap-3 py-4 bg-champagne-gold text-deep-walnut font-accent text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-warm-cream transition-colors"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                Add to Bag
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 border-t border-champagne-gold/10 pt-8">
              {[
                { icon: Shield, label: 'Handcrafted Guarantee' },
                { icon: Truck, label: 'Worldwide Shipping' },
                { icon: Leaf, label: 'Sustainably Sourced' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon size={18} strokeWidth={1} className="mx-auto text-champagne-gold/40 mb-2" />
                  <span className="font-accent text-[8px] uppercase tracking-[0.15em] text-warm-cream/40">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-6 sm:px-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-6 font-semibold">Details</h2>
            <ul className="space-y-3">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-champagne-gold/40 mt-2 flex-shrink-0" />
                  <span className="font-body text-sm text-warm-cream/70">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-6 font-semibold">Care</h2>
            <p className="font-body text-sm leading-relaxed text-warm-cream/70">{product.careNote}</p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-24 px-6 sm:px-10 border-t border-champagne-gold/10">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-12 text-center">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="group">
                  <div className="aspect-square bg-warm-cream/5 rounded-xl flex items-center justify-center p-8 mb-4 overflow-hidden border border-champagne-gold/10">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-header text-lg text-champagne-gold">{p.name}</h4>
                  <p className="font-body text-xs text-warm-cream/50 mt-1">{p.wood}</p>
                  <p className="font-accent text-sm text-champagne-gold/70 mt-2">LE {p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
