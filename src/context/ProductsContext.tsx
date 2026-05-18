import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, ProductCategory, ProductCollection } from '../data/products';
import { products as staticProducts } from '../data/products';
import { getProducts } from '../lib/firestore';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refreshProducts: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  getProductsByCollection: (collection: ProductCollection) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  // Initialize with empty products array
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      // Fall back to static products if Firestore has none
      setProducts(data && data.length > 0 ? data : staticProducts);
    } catch (err) {
      console.error('Failed to load products from Firebase:', err);
      setError(err instanceof Error ? err : new Error('Failed to load products'));
      // Always show static products on error so the site is never blank
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter((p) => p.category === category);
  };

  const getProductsByCollection = (collection: ProductCollection) => {
    return products.filter((p) => p.collection === collection);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
        getProductBySlug,
        getProductsByCategory,
        getProductsByCollection,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
