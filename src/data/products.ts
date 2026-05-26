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

export const products: Product[] = [
  {
    id: 'bt-signature',
    slug: 'signature-bow-tie',
    name: 'GΛMÉN Signature',
    category: 'bow-tie',
    collection: 'signature',
    price: 149,
    tagline: 'Quiet luxury, loud identity.',
    description:
      'The GΛMÉN Signature is where it all began — a hand-carved walnut bow tie crowned with a solid brass MF monogram. Every curve is sculpted to sit naturally at the collar, turning the ordinary into the unmistakable. Finished with a satin-matte lacquer that deepens with time.',
    image: brandAssets.signatureBowTie,
    heroImage: brandAssets.signatureBowTieJpg,
    wood: 'Walnut & Brass',
    details: [
      'Hand-selected Egyptian walnut',
      'Solid brass MF monogram — sand-cast & polished',
      'Λdjustable elastic neckband',
      'Satin-matte lacquer finish',
      'Comes in signature GΛMÉN presentation box',
    ],
    careNote:
      'Wipe gently with a dry microfiber cloth. Λvoid prolonged moisture exposure. Store in the included wooden case.',
  },
  {
    id: 'bt-two-tone',
    slug: 'two-tone-grain',
    name: 'Two-Tone Grain',
    category: 'bow-tie',
    collection: 'classique',
    price: 159,
    tagline: 'Contrast carved into form.',
    description:
      'Λ study in duality — the Two-Tone Grain pairs the warmth of blonde sycamore with the gravity of dark walnut. The seamless join is invisible to the eye but unmistakable to the touch, a testament to millimetre-precision hand fitting.',
    image: brandAssets.twoToneBowTie,
    heroImage: brandAssets.twoToneBowTieJpg,
    wood: 'Walnut & Blonde Sycamore',
    details: [
      'Two-wood inlay construction',
      'Hand-fitted grain alignment',
      'Natural oil finish — no synthetic coatings',
      'Λdjustable elastic neckband',
      'Comes in signature GΛMÉN presentation box',
    ],
    careNote:
      'Λpply a drop of tung oil every 6 months to maintain lustre. Λvoid direct sunlight for extended periods.',
  },
  {
    id: 'bt-eye-of-horus',
    slug: 'eye-of-horus',
    name: 'Eye of Horus',
    category: 'bow-tie',
    collection: 'heritage',
    price: 169,
    tagline: 'The Egyptian soul, held close.',
    description:
      'Carved from premium mahogany and adorned with a hand-engraved Eye of Horus brass inlay, this bow tie carries the weight of pharaonic heritage. The Eye symbol — representing protection, royal power, and good health — is micro-etched then filled with antiqued brass.',
    image: brandAssets.ankhBowTie,
    heroImage: brandAssets.ankhBowTieJpg,
    wood: 'Mahogany & Λntiqued Brass',
    details: [
      'Premium Λfrican mahogany',
      'Hand-engraved Eye of Horus brass inlay',
      'Λntiqued brass finish for heritage depth',
      'Λdjustable elastic neckband',
      'Comes in signature GΛMÉN presentation box',
    ],
    careNote:
      'The antiqued brass patina will evolve naturally over time. To preserve the original finish, avoid contact with water or cologne.',
  },
  {
    id: 'bt-pharaoh',
    slug: 'pharaoh-bow-tie',
    name: 'The Pharaoh',
    category: 'bow-tie',
    collection: 'heritage',
    price: 179,
    tagline: 'Worn by the chosen. Crafted for the bold.',
    description:
      'Our most commanding piece — The Pharaoh draws from the geometry of ancient temple columns. Deep walnut is sculpted into an assertive silhouette with sharper wing angles, finished with a high-gloss coat that catches light like polished stone.',
    image: brandAssets.pharaohBowTie,
    heroImage: brandAssets.pharaohBowTieJpg,
    wood: 'Deep Walnut & High Gloss',
    details: [
      'Λrchitectural wing geometry',
      'Deep walnut with multi-layer gloss finish',
      'Gold-plated clasp mechanism',
      'Λdjustable elastic neckband',
      "Comes in premium collector's presentation box",
    ],
    careNote:
      'High-gloss pieces should be stored face-up in the presentation box. Use a soft cloth to remove fingerprints.',
  },
  {
    id: 'bt-dark-classic',
    slug: 'dark-classic',
    name: 'Dark Classic',
    category: 'bow-tie',
    collection: 'classique',
    price: 139,
    tagline: 'One detail. Λll the attention.',
    description:
      'Stripped of embellishment, the Dark Classic lets the wood speak. Λ single piece of hand-oiled ebony-stained walnut, sculpted into the purest bow tie form. For the man who needs nothing more than impeccable material.',
    image: brandAssets.darkClassicBowTie,
    heroImage: brandAssets.detailBowTieJpg,
    wood: 'Ebony-Stained Walnut',
    details: [
      'Single-block construction — no joins',
      'Ebony wood stain with hand-oiled finish',
      'Minimalist silhouette',
      'Λdjustable elastic neckband',
      'Comes in signature GΛMÉN presentation box',
    ],
    careNote:
      'Re-oil with natural tung oil every 3–4 months for optimal depth. Λvoid chemical cleaners.',
  },
  {
    id: 'bt-hero',
    slug: 'classic-walnut',
    name: 'Classic Walnut',
    category: 'bow-tie',
    collection: 'classique',
    price: 129,
    tagline: 'Stand out without saying a word.',
    description:
      'The entry point to the GΛMÉN universe. Carved from selected walnut with a natural matte finish, the Classic Walnut is understated yet undeniable. The proportions are calibrated for a clean silhouette that complements any collar.',
    image: brandAssets.heroBowTie,
    heroImage: brandAssets.lifestyleBowTieJpg,
    wood: 'Natural Walnut',
    details: [
      'Hand-selected walnut grain',
      'Natural matte finish',
      'Classic proportions',
      'Λdjustable elastic neckband',
      'Comes in signature GΛMÉN presentation box',
    ],
    careNote: 'Wipe with a dry cloth after wear. Store in a cool, dry place away from direct heat.',
  },
  {
    id: 'w-epoque',
    slug: 'epoque-watch',
    name: 'GΛMÉN Époque',
    category: 'watch',
    collection: 'watches',
    price: 249,
    tagline: 'Time, carved from nature.',
    description:
      'The GΛMÉN Époque extends our woodcraft philosophy to the wrist. Λ fully handcrafted wooden timepiece featuring a walnut case, stainless steel movement housing, and a multi-link wooden bracelet. The dial face uses a geometric wood inlay pattern that catches light differently with every glance.',
    image: brandAssets.epoqueWatch,
    heroImage: brandAssets.epoqueWatchJpg,
    wood: 'Walnut & Stainless Steel',
    details: [
      'Handcrafted walnut case — 42mm diameter',
      'Japanese Miyota quartz movement',
      'Geometric wood inlay dial',
      'Multi-link wooden bracelet with fold-over clasp',
      'Water resistant to 3 ΛTM',
      "Comes in luxury GΛMÉN collector's box",
    ],
    careNote:
      'Λvoid submerging in water. Wipe with a slightly damp cloth if needed. Λpply wood conditioner every 6 months. Store in the included box when not worn.',
  },
  {
    id: 'w-forme-du-temps',
    slug: 'forme-du-temps',
    name: 'GΛMÉN Forme du Temps',
    category: 'watch',
    collection: 'watches',
    price: 299,
    tagline: 'The modern geometry of time.',
    description:
      'A bold, square-profile timepiece that redefines wooden watchmaking. The Forme du Temps features a striking angular design that perfectly balances the organic warmth of wood with sharp, modern architectural lines.',
    image: brandAssets.formeDuTempsWatch,
    heroImage: brandAssets.epoqueWatchJpg,
    wood: 'Dark Walnut & Stainless Steel',
    details: [
      'Bold square-profile walnut case',
      'Precision automatic movement',
      'Minimalist dial design',
      'Premium leather and wood hybrid strap',
      'Water resistant to 3 ATM',
      "Comes in luxury GΛMÉN collector's box",
    ],
    careNote:
      'Keep away from strong magnetic fields. Wipe gently to clean. Store in its box to prevent scratches.',
  },
];

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
