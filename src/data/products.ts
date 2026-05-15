import { brandAssets } from '../brandAssets';

export interface Product {
  id: number;
  name: string;
  tagline: string;
  image: string;
  wood: string;
}

export const collections: Product[] = [
  {
    id: 1,
    name: 'GAMÉN Signature',
    tagline: 'Quiet luxury, loud identity.',
    image: brandAssets.signatureBowTie,
    wood: 'Walnut & Brass',
  },
  {
    id: 2,
    name: 'Two-Tone Grain',
    tagline: 'Contrast carved into form.',
    image: brandAssets.twoToneBowTie,
    wood: 'Walnut & Blonde Wood',
  },
  {
    id: 3,
    name: 'Eye of Horus',
    tagline: 'The Egyptian soul, held close.',
    image: brandAssets.ankhBowTie,
    wood: 'Mahogany & Brass',
  },
];
