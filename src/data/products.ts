import { brandAssets } from '../brandAssets';

export type ProductCategory = 'bow-tie' | 'watch';
export type ProductCollection = 'classique' | 'heritage' | 'signature' | 'watches';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: ProductCollection;
  price: number;
  tagline: string;
  description: string;
  image: string;
  heroImage: string;
  wood: string;
  details: string[];
  careNote: string;
  isSoldOut?: boolean;
}

export const products: Product[] = [];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  products.filter((p) => p.category === category);

export const getProductsByCollection = (collection: ProductCollection): Product[] =>
  products.filter((p) => p.collection === collection);

// Derived collections for the horizontal-scroll carousel (CollectionsSection)
export const collections = products.map((p, i) => ({
  id: i + 1,
  name: p.name,
  tagline: p.tagline,
  image: p.image,
  wood: p.wood,
  slug: p.slug,
}));
