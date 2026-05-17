// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { getProducts } from '../lib/firestore';

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const products = await getProducts();
        
        if (cancelled) return;
        
        // Filter out hidden products
        // Notice getProducts currently fetches everything. We can filter hidden out.
        // Assuming we add 'hidden' to the Product type or just check it dynamically
        const visibleProducts = products.filter((p: any) => !p.hidden);

        setAllProducts(visibleProducts);
      } catch (err) {
        console.error('Failed to load Firestore products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { products: allProducts, loading };
}
