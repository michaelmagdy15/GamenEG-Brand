import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { brandAssets } from '../brandAssets';

const pieces = [
  {
    id: 'signature',
    name: 'GAMÉN Signature',
    detail: 'Brass monogram over dark walnut',
    image: brandAssets.heroBowTie,
  },
  {
    id: 'pharaoh',
    name: 'Pharaoh Seal',
    detail: 'A ceremonial brass centerpiece',
    image: brandAssets.pharaohBowTie,
  },
  {
    id: 'horus',
    name: 'Eye of Horus',
    detail: 'Ancient symbolism in polished brass',
    image: brandAssets.ankhBowTie,
  },
];

export default function AtelierExperience() {
  const [activeId, setActiveId] = useState(pieces[0].id);
  const activePiece = pieces.find((piece) => piece.id === activeId) ?? pieces[0];

  return (
    <section className="relative bg-deep-walnut text-champagne-gold px-4 sm:px-8 py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent,rgba(207,197,178,0.16),transparent)] animate-light-sweep" />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-24 items-center">
        <div>
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] mb-6">Interactive Atelier</p>
          <h2 className="font-header text-5xl lg:text-8xl leading-none mb-8 text-warm-cream">
            Choose the center of attention.
          </h2>
          <p className="font-french italic text-2xl lg:text-3xl text-champagne-gold/80 max-w-xl">
            Every bow tie keeps the same sculpted silhouette. The emotion changes with the emblem.
          </p>

          <div className="mt-12 grid gap-3 max-w-xl">
            {pieces.map((piece) => (
              <button
                key={piece.id}
                onClick={() => setActiveId(piece.id)}
                className={`group text-left border px-5 py-4 transition-colors ${
                  activeId === piece.id
                    ? 'border-champagne-gold bg-champagne-gold text-deep-walnut'
                    : 'border-champagne-gold/25 text-champagne-gold hover:border-champagne-gold'
                }`}
              >
                <span className="block font-header text-2xl">{piece.name}</span>
                <span className={`block font-body text-sm mt-1 ${activeId === piece.id ? 'text-deep-walnut/70' : 'text-champagne-gold/60'}`}>
                  {piece.detail}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Image showcase — no mouse-tracking transforms */}
        <div className="relative min-h-[460px] lg:min-h-[620px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.22),transparent_62%)]" />
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            <div className="absolute inset-[8%] rounded-full border border-champagne-gold/25 bg-espresso/55" />
            <div
              className="absolute inset-[18%] rounded-full border border-champagne-gold/20 animate-slow-spin"
            />
            <div
              className="absolute inset-[27%] rounded-full border border-champagne-gold/15 border-dashed animate-slow-spin-reverse"
            />

            <AnimatePresence mode="wait">
              <motion.img
                key={activePiece.id}
                src={activePiece.image}
                alt={activePiece.name}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-[115%] max-w-none h-auto object-contain"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
