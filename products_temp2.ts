import { brandAssets } from './src/brandAssets';

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
  // CATEGORY I: La Maison Classique
  {
    id: 'gamen-classique',
    slug: 'gamen-classique',
    name: 'G╬¢M├ëN Classique',
    category: 'bow-tie',
    collection: 'classique',
    price: 1500,
    tagline: 'The timeless modern classic.',
    description: 'The entry point to the G╬¢M├ëN universe. Carved from selected walnut with a natural matte finish, the Classique is understated yet undeniable. The proportions are calibrated for a clean silhouette that complements any collar.',
    image: brandAssets.heroBowTie,
    heroImage: brandAssets.lifestyleBowTieJpg,
    wood: 'Natural Walnut',
    details: [
      'Hand-selected walnut grain',
      'Natural matte finish',
      'Classic proportions',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'Wipe with a dry cloth after wear. Store in a cool, dry place away from direct heat.',
  },
  {
    id: 'l-eclat',
    slug: 'l-eclat',
    name: 'LΓÇÖ├ëclat',
    category: 'bow-tie',
    collection: 'classique',
    price: 2000,
    tagline: 'Contrast carved into form.',
    description: 'A study in duality ΓÇö LΓÇÖ├ëclat features a stunning gradient effect, pairing the warmth of blonde sycamore with the gravity of dark walnut. The seamless join is invisible to the eye but unmistakable to the touch.',
    image: brandAssets.twoToneBowTie,
    heroImage: brandAssets.twoToneBowTieJpg,
    wood: 'Walnut & Blonde Sycamore (Gradient)',
    details: [
      'Two-wood inlay gradient construction',
      'Hand-fitted grain alignment',
      'Natural oil finish ΓÇö no synthetic coatings',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'Apply a drop of tung oil every 6 months to maintain lustre. Avoid direct sunlight for extended periods.',
  },
  {
    id: 'eclipse-du-bois',
    slug: 'eclipse-du-bois',
    name: '├ëclipse Du Bois',
    category: 'bow-tie',
    collection: 'classique',
    price: 2000,
    tagline: 'One detail. All the attention.',
    description: 'Stripped of embellishment, the ├ëclipse Du Bois lets the wood speak. A single piece of hand-oiled ebony-stained walnut, sculpted into the purest bow tie form with a subtle gradient effect.',
    image: brandAssets.darkClassicBowTie,
    heroImage: brandAssets.detailBowTieJpg,
    wood: 'Ebony-Stained Walnut (Gradient)',
    details: [
      'Single-block gradient construction',
      'Ebony wood stain with hand-oiled finish',
      'Minimalist silhouette',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'Re-oil with natural tung oil every 3ΓÇô4 months for optimal depth. Avoid chemical cleaners.',
    isSoldOut: true,
  },

  // CATEGORY II: Les H├⌐ritiers du Nil
  {
    id: 'l-or-royal',
    slug: 'l-or-royal',
    name: 'LΓÇÖOr Royal',
    category: 'bow-tie',
    collection: 'heritage',
    price: 2500,
    tagline: 'Worn by the chosen. Crafted for the bold.',
    description: 'Inspired by the majesty of King Tutankhamun. The LΓÇÖOr Royal draws from the geometry of ancient temple columns. Deep walnut is sculpted into an assertive silhouette with sharper wing angles, finished with a high-gloss coat that catches light like polished stone.',
    image: brandAssets.pharaohBowTie,
    heroImage: brandAssets.pharaohBowTieJpg,
    wood: 'Deep Walnut & High Gloss',
    details: [
      'Architectural wing geometry (King Tut inspired)',
      'Deep walnut with multi-layer gloss finish',
      'Gold-plated clasp mechanism',
      'Adjustable elastic neckband',
      'Comes in premium collector\'s presentation box',
    ],
    careNote: 'High-gloss pieces should be stored face-up in the presentation box. Use a soft cloth to remove fingerprints.',
  },
  {
    id: 'ankh-eternel',
    slug: 'ankh-eternel',
    name: 'Ankh ├ëternel',
    category: 'bow-tie',
    collection: 'heritage',
    price: 2500,
    tagline: 'The key of life, held close.',
    description: 'Carved from premium mahogany and adorned with a hand-engraved Ankh (Moftah El Hayah) brass inlay, this bow tie carries the weight of pharaonic heritage. The symbol of eternal life is micro-etched then filled with antiqued brass.',
    image: brandAssets.ankhBowTie,
    heroImage: brandAssets.ankhBowTieJpg,
    wood: 'Mahogany & Antiqued Brass',
    details: [
      'Premium African mahogany',
      'Hand-engraved Ankh (Key of Life) brass inlay',
      'Antiqued brass finish for heritage depth',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'The antiqued brass patina will evolve naturally over time. To preserve the original finish, avoid contact with water or cologne.',
  },
  {
    id: 'ra-en',
    slug: 'ra-en',
    name: 'RAΓÇÖEN',
    category: 'bow-tie',
    collection: 'heritage',
    price: 2500,
    tagline: 'The visionary eye of Ra.',
    description: 'A tribute to the Eye of Ra, representing divine power and protection. Crafted with precision, featuring striking wood contrasts that emulate the eternal gaze of the sun god.',
    image: brandAssets.heroBowTie,
    heroImage: brandAssets.lifestyleBowTieJpg,
    wood: 'Ebony & Gold Inlay',
    details: [
      'Eye of Ra geometric precision carving',
      'Symbol of protection and royal power',
      'Hand-polished surface',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'Store in its box to protect the intricate carving. Clean with a dry microfiber cloth.',
  },

  // CATEGORY III: La Signature Priv├⌐e
  {
    id: 'gamen-signature',
    slug: 'gamen-signature',
    name: 'G╬¢M├ëN Signature',
    category: 'bow-tie',
    collection: 'signature',
    price: 2500,
    tagline: 'Quiet luxury, your personal identity.',
    description: 'The G╬¢M├ëN Signature is personalized bespoke luxury ΓÇö a hand-carved walnut bow tie crowned with a customized initial monogram. Every curve is sculpted to sit naturally at the collar, turning the ordinary into the unmistakably yours.',
    image: brandAssets.signatureBowTie,
    heroImage: brandAssets.signatureBowTieJpg,
    wood: 'Walnut & Brass',
    details: [
      'Personalized custom initial monogram',
      'Hand-selected Egyptian walnut',
      'Solid brass inlay ΓÇö sand-cast & polished',
      'Adjustable elastic neckband',
      'Comes in signature G╬¢M├ëN presentation box',
    ],
    careNote: 'Wipe gently with a dry microfiber cloth. Avoid prolonged moisture exposure. Store in the included wooden case.',
  },

  // Watches
  {
    id: 'w-epoque',
    slug: 'gamen-epoque',
    name: 'G╬¢M├ëN ├ëpoque',
    category: 'watch',
    collection: 'watches',
    price: 3500,
    tagline: 'Time, carved from nature.',
    description: 'The G╬¢M├ëN ├ëpoque extends our woodcraft philosophy to the wrist with a classic circular profile. A fully handcrafted wooden timepiece featuring a walnut case, stainless steel movement housing, and a multi-link wooden bracelet.',
    image: brandAssets.epoqueWatch,
    heroImage: brandAssets.epoqueWatchJpg,
    wood: 'Walnut & Stainless Steel',
    details: [
      'Handcrafted walnut case ΓÇö 42mm circular diameter',
      'Japanese Miyota quartz movement',
      'Geometric wood inlay dial',
      'Multi-link wooden bracelet with fold-over clasp',
      'Water resistant to 3 ATM',
      'Comes in luxury G╬¢M├ëN collector\'s box',
    ],
    careNote: 'Avoid submerging in water. Wipe with a slightly damp cloth if needed. Apply wood conditioner every 6 months. Store in the included box when not worn.',
  },
  {
    id: 'w-forme-du-temps',
    slug: 'gamen-forme-du-temps',
    name: 'G╬¢M├ëN Forme du Temps',
    category: 'watch',
    collection: 'watches',
    price: 4000,
    tagline: 'The modern geometry of time.',
    description: 'A bold, square-profile timepiece that redefines wooden watchmaking. The Forme du Temps features a striking angular design that perfectly balances the organic warmth of wood with sharp, modern architectural lines.',
    image: brandAssets.epoqueWatch,
    heroImage: brandAssets.epoqueWatchJpg,
    wood: 'Dark Walnut & Stainless Steel',
    details: [
      'Bold square-profile walnut case',
      'Precision automatic movement',
      'Minimalist dial design',
      'Premium leather and wood hybrid strap',
      'Water resistant to 3 ATM',
      'Comes in luxury G╬¢M├ëN collector\'s box',
    ],
    careNote: 'Keep away from strong magnetic fields. Wipe gently to clean. Store in its box to prevent scratches.',
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
