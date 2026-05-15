// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';
import type { Product } from '../data/products';
import { getAdminProducts, getProductOverrides } from '../lib/firestore';
import type { AdminProduct, ProductOverride } from '../lib/firestore';

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [adminProds, overrides] = await Promise.all([
          getAdminProducts(),
          getProductOverrides(),
        ]);

        if (cancelled) return;

        const overrideMap = new Map<string, ProductOverride>();
        overrides.forEach((o) => overrideMap.set(o.id, o));

        // Apply overrides to static products
        const updatedStatic = staticProducts.map((p) => {
          const override = overrideMap.get(p.id);
          if (!override) return p;
          return {
            ...p,
            isSoldOut: override.isSoldOut ?? p.isSoldOut,
            price: override.price ?? p.price,
          };
        });

        // Filter out hidden static products
        const visibleStatic = updatedStatic.filter((p) => {
          const override = overrideMap.get(p.id);
          return !override?.hidden;
        });

        // Map admin products to Product shape
        const adminFormatted: Product[] = adminProds
          .filter((p): p is AdminProduct & Required<Pick<AdminProduct, 'name' | 'price' | 'collection' | 'category'>> =>
            !p.hidden && Boolean(p.name && p.price && p.collection && p.category)
          )
          .map((p) => ({
            id: p.id,
            slug: p.slug || p.id,
            name: p.name!,
            category: p.category!,
            collection: p.collection!,
            price: p.price!,
            tagline: p.tagline || '',
            description: p.description || '',
            image: p.image || '/placeholder.jpg',
            heroImage: p.heroImage || p.image || '/placeholder.jpg',
            wood: p.wood || '',
            details: p.details || [],
            careNote: p.careNote || '',
            isSoldOut: p.isSoldOut,
          }));

        setAllProducts([...visibleStatic, ...adminFormatted]);
      } catch (err) {
        console.error('Failed to load Firestore products:', err);
        // Gracefully fall back to static products
        setAllProducts(staticProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { products: allProducts, loading };
}
