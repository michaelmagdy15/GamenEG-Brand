import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'motion/react';
import { useState, useRef } from 'react';
import { useMedia } from 'react-use';
import { Printer } from 'lucide-react';

/* ─── Illustration Components ─────────────────────────────────────── */

function CollarIllustration({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Shirt body */}
      <motion.path
        d="M40 200 L40 80 Q100 60 160 80 L160 200"
        stroke="#cfc5b2" strokeWidth="2" fill="#462718"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      />
      {/* Left collar */}
      <motion.path
        d="M40 80 L100 120 L100 95 Q70 60 40 55 Z"
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
      />
      {/* Right collar */}
      <motion.path
        d="M160 80 L100 120 L100 95 Q130 60 160 55 Z"
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
      />
      {/* Button */}
      <motion.circle
        cx={100} cy={110} r={6}
        fill="none" stroke="#cfc5b2" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={isActive ? { scale: [0, 1.3, 1], stroke: ['#cfc5b2', '#f2eee6', '#cfc5b2'] } : { scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5, times: [0, 0.6, 1] }}
      />
      {/* Button thread lines */}
      <motion.line x1="98" y1="108" x2="102" y2="108" stroke="#cfc5b2" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      <motion.line x1="100" y1="106" x2="100" y2="114" stroke="#cfc5b2" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      {/* Finger / pointer hint */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isActive ? { opacity: [0, 1, 0], y: [-10, 0, -10] } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <path d="M92 90 Q100 84 108 90 L108 107 Q104 110 100 110 Q96 110 92 107 Z" fill="#cfc5b2" opacity="0.7" />
      </motion.g>
    </svg>
  );
}

function PositionIllustration({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Shirt */}
      <path d="M40 200 L40 80 Q100 60 160 80 L160 200" stroke="#cfc5b2" strokeWidth="2" fill="#462718" />
      <path d="M40 80 L100 120 L100 95 Q70 60 40 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      <path d="M160 80 L100 120 L100 95 Q130 60 160 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      {/* Bow tie body floating in */}
      <motion.g
        initial={{ y: -30, opacity: 0 }}
        animate={isActive ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left wing */}
        <path d="M72 108 Q82 100 92 108 Q82 116 72 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
        {/* Right wing */}
        <path d="M128 108 Q118 100 108 108 Q118 116 128 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
        {/* Knot centre */}
        <ellipse cx="100" cy="108" rx="8" ry="7" fill="#6b4226" stroke="#cfc5b2" strokeWidth="1.5" />
        {/* Wood grain lines */}
        <line x1="76" y1="106" x2="89" y2="108" stroke="#cfc5b2" strokeWidth="0.5" opacity="0.4" />
        <line x1="76" y1="110" x2="89" y2="109" stroke="#cfc5b2" strokeWidth="0.5" opacity="0.4" />
      </motion.g>
      {/* Alignment guide lines */}
      <motion.line x1="100" y1="85" x2="100" y2="130" stroke="#cfc5b2" strokeWidth="0.5" strokeDasharray="3 3"
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 0.3 } : { opacity: 0 }} transition={{ delay: 0.8 }} />
    </svg>
  );
}

function ClipIllustration({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Shirt */}
      <path d="M40 200 L40 80 Q100 60 160 80 L160 200" stroke="#cfc5b2" strokeWidth="2" fill="#462718" />
      <path d="M40 80 L100 120 L100 95 Q70 60 40 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      <path d="M160 80 L100 120 L100 95 Q130 60 160 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      {/* Bow tie seated */}
      <path d="M72 108 Q82 100 92 108 Q82 116 72 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
      <path d="M128 108 Q118 100 108 108 Q118 116 128 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
      <ellipse cx="100" cy="108" rx="8" ry="7" fill="#6b4226" stroke="#cfc5b2" strokeWidth="1.5" />
      {/* Clip mechanism */}
      <motion.g
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ transformOrigin: '100px 116px' }}
      >
        <rect x="95" y="114" width="10" height="6" rx="2" fill="#9d9d9d" stroke="#cfc5b2" strokeWidth="1" />
        {/* Clip loop */}
        <path d="M97 120 Q97 126 100 126 Q103 126 103 120" stroke="#c0c0c0" strokeWidth="1.5" fill="none" />
      </motion.g>
      {/* Click flash */}
      <motion.circle
        cx={100}
        cy={120}
        fill="none"
        stroke="#f2eee6"
        strokeWidth="2"
        initial={{ r: 0, opacity: 0 }}
        animate={isActive ? {
          r: [0, 20, 40],
          opacity: [0.8, 0.4, 0],
        } : { r: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.9, repeat: Infinity, repeatDelay: 2 }}
      />
    </svg>
  );
}

function AdjustIllustration({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Shirt */}
      <path d="M40 200 L40 80 Q100 60 160 80 L160 200" stroke="#cfc5b2" strokeWidth="2" fill="#462718" />
      <path d="M40 80 L100 120 L100 95 Q70 60 40 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      <path d="M160 80 L100 120 L100 95 Q130 60 160 55 Z" fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5" />
      {/* Bow tie */}
      <path d="M72 108 Q82 100 92 108 Q82 116 72 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
      <path d="M128 108 Q118 100 108 108 Q118 116 128 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
      <ellipse cx="100" cy="108" rx="8" ry="7" fill="#6b4226" stroke="#cfc5b2" strokeWidth="1.5" />
      {/* Elastic band */}
      <motion.path
        d="M40 80 Q100 135 160 80"
        stroke="#cfc5b2" strokeWidth="1.5" strokeDasharray="4 3" fill="none"
        initial={{ pathLength: 0 }}
        animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      {/* Slider indicator */}
      <motion.g
        initial={{ x: 0, opacity: 0 }}
        animate={isActive ? { x: [0, 10, -5, 0], opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 1 }}
      >
        <rect x="88" y="126" width="24" height="8" rx="4" fill="#9d9d9d" stroke="#cfc5b2" strokeWidth="1" />
        <line x1="94" y1="126" x2="94" y2="134" stroke="#6b6b6b" strokeWidth="0.8" />
        <line x1="100" y1="126" x2="100" y2="134" stroke="#6b6b6b" strokeWidth="0.8" />
        <line x1="106" y1="126" x2="106" y2="134" stroke="#6b6b6b" strokeWidth="0.8" />
      </motion.g>
    </svg>
  );
}

function FinishIllustration({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Shirt */}
      <path d="M40 200 L40 80 Q100 60 160 80 L160 200" stroke="#cfc5b2" strokeWidth="2" fill="#462718" />
      {/* Collars folded down */}
      <motion.path
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
        initial={{ d: "M40 80 L100 120 L100 95 Q70 60 40 55 Z" }}
        animate={{ d: isActive ? "M40 80 L100 115 L100 90 Q70 55 40 50 Z" : "M40 80 L100 120 L100 95 Q70 60 40 55 Z" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.path
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
        initial={{ d: "M160 80 L100 120 L100 95 Q130 60 160 55 Z" }}
        animate={{ d: isActive ? "M160 80 L100 115 L100 90 Q130 55 160 50 Z" : "M160 80 L100 120 L100 95 Q130 60 160 55 Z" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Bow tie — final position */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '100px 108px' }}
      >
        <path d="M68 108 Q82 97 92 108 Q82 119 68 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
        <path d="M132 108 Q118 97 108 108 Q118 119 132 108 Z" fill="#8B5E3C" stroke="#cfc5b2" strokeWidth="1.5" />
        <ellipse cx="100" cy="108" rx="9" ry="8" fill="#6b4226" stroke="#cfc5b2" strokeWidth="1.5" />
        <line x1="72" y1="104" x2="88" y2="106" stroke="#cfc5b2" strokeWidth="0.6" opacity="0.5" />
        <line x1="72" y1="108" x2="88" y2="109" stroke="#cfc5b2" strokeWidth="0.6" opacity="0.5" />
        <line x1="72" y1="112" x2="88" y2="111" stroke="#cfc5b2" strokeWidth="0.6" opacity="0.5" />
      </motion.g>
      {/* Sparkle stars */}
      {isActive && [
        { cx: 55, cy: 75, delay: 1.0 },
        { cx: 148, cy: 72, delay: 1.2 },
        { cx: 100, cy: 55, delay: 1.4 },
      ].map((star, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 1, delay: star.delay, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: `${star.cx}px ${star.cy}px` }}
        >
          <line x1={star.cx - 6} y1={star.cy} x2={star.cx + 6} y2={star.cy} stroke="#cfc5b2" strokeWidth="1.5" />
          <line x1={star.cx} y1={star.cy - 6} x2={star.cx} y2={star.cy + 6} stroke="#cfc5b2" strokeWidth="1.5" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── Steps data — defined AFTER illustration functions so refs resolve ─── */

const steps = [
  {
    num: '01',
    title: 'Prepare the Collar',
    subtitle: 'Undo the top button',
    description: 'Before anything else, unbutton the top button of your dress shirt. The clip mechanism needs direct access to the button stud.',
    illustration: CollarIllustration,
    accent: 'The foundation of a clean result.',
  },
  {
    num: '02',
    title: 'Position the Piece',
    subtitle: 'Rest it at the centre',
    description: 'Place the GΛMÉN bow tie at the centre of your collar. Ensure it sits flat — the clip faces inward, the wood face outward.',
    illustration: PositionIllustration,
    accent: 'Flat and centred — not tilted.',
  },
  {
    num: '03',
    title: 'Attach the Clip',
    subtitle: 'Hook onto the button',
    description: 'Slide the stainless steel clip loop over the top button stud. You will feel a firm, satisfying click when it is seated correctly.',
    illustration: ClipIllustration,
    accent: 'Secure. Precise. Effortless.',
  },
  {
    num: '04',
    title: 'Adjust the Band',
    subtitle: 'Set your fit',
    description: 'The elastic neckband rests under the collar. Adjust the slider for a snug but comfortable fit — not tight enough to pull the collar forward.',
    illustration: AdjustIllustration,
    accent: 'Comfort meets precision.',
  },
  {
    num: '05',
    title: 'Fold & Finish',
    subtitle: 'Drop the collar down',
    description: "Fold your collar points back down. The bow tie should now rest perfectly centred at the base of your throat. You're dressed.",
    illustration: FinishIllustration,
    accent: 'The room just noticed you.',
  },
];

/* ─── Main Component ──────────────────────────────────────────────── */

export default function HowToWear() {
  return (
    <section id="how-to-use" className="relative bg-deep-walnut text-warm-cream py-24 sm:py-32 px-6 sm:px-10 print:bg-white print:text-black">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.06),transparent_65%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-champagne-gold mb-6 print:text-gray-500">The Ritual</p>
          <h2 className="font-header text-4xl sm:text-5xl lg:text-6xl mb-6 text-champagne-gold leading-tight">How to Wear</h2>
          <p className="font-french italic text-xl text-champagne-gold/80 print:text-gray-700">A seamless connection between craft and collar.</p>
        </div>

        {/* List of Steps */}
        <div className="space-y-24 md:space-y-32">
          {steps.map((step, i) => {
            const StepIllustration = step.illustration;
            const isEven = i % 2 === 0;
            return (
              <div 
                key={step.num} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16 border-b border-champagne-gold/10 pb-16 last:border-b-0 last:pb-0`}
              >
                {/* Illustration Card */}
                <div className="w-full max-w-sm aspect-square rounded-2xl border border-champagne-gold/20 bg-warm-cream/5 flex items-center justify-center p-8 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full max-w-[280px] max-h-[280px]">
                    <StepIllustration isActive={true} />
                  </div>
                </div>

                {/* Instruction Text */}
                <div className="flex-1 text-center lg:text-left px-2">
                  <span className="font-header text-5xl text-champagne-gold/25 block mb-2">{step.num}</span>
                  <span className="font-accent text-[9px] uppercase tracking-[0.3em] text-champagne-gold/40 block mb-2">{step.subtitle}</span>
                  <h3 className="font-header text-2xl sm:text-3xl text-champagne-gold mb-4 font-semibold">{step.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-warm-cream/70 mb-4 max-w-xl mx-auto lg:mx-0">{step.description}</p>
                  <p className="font-french italic text-lg text-champagne-gold/60">{step.accent}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Print Button */}
        <div className="mt-24 text-center print:hidden">
          <p className="font-french italic text-lg text-champagne-gold/80 mb-8">Prefer a physical guide? Print your instruction card.</p>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-4 text-champagne-gold font-accent text-[10px] tracking-[0.2em] uppercase px-8 py-4 border border-champagne-gold/30 hover:border-champagne-gold transition-colors"
          >
            <span>Print Instruction Card</span>
            <span className="h-px w-8 bg-champagne-gold transition-all group-hover:w-12" />
          </button>
        </div>
      </div>
    </section>
  );
}
