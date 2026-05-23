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
        cx={100} cy={120}
        r={0}
        fill="none"
        stroke="#f2eee6"
        strokeWidth="2"
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
        d="M40 80 L100 120 L100 95 Q70 60 40 55 Z"
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
        animate={{ d: isActive ? "M40 80 L100 115 L100 90 Q70 55 40 50 Z" : "M40 80 L100 120 L100 95 Q70 60 40 55 Z" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.path
        d="M160 80 L100 120 L100 95 Q130 60 160 55 Z"
        fill="#5a3220" stroke="#cfc5b2" strokeWidth="1.5"
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
  const isDesktop = useMedia('(min-width: 1024px)', true);
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // latest goes from 0 to 1
    // map 0..1 to 0..totalSteps-1
    // Add a tiny buffer so reaching exactly 1 doesn't go out of bounds
    const step = Math.min(Math.floor(latest * totalSteps), totalSteps - 1);
    if (step !== activeStep) {
      setActiveStep(step);
    }
  });

  const currentStep = steps[activeStep];
  const IllustrationComponent = currentStep.illustration;

  if (!isDesktop) {
    return (
      <section id="how-to-wear-print-section" className="bg-deep-walnut text-warm-cream py-24 px-6 sm:px-10 print:bg-white print:text-black">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="font-accent text-[10px] uppercase tracking-[0.28em] text-champagne-gold mb-6 print:text-gray-500">The Ritual</p>
            <h2 className="font-header text-4xl sm:text-5xl mb-6 text-champagne-gold print:text-4xl leading-tight">How to Wear</h2>
            <p className="font-french italic text-xl text-champagne-gold/80 print:text-gray-700">A seamless connection between craft and collar.</p>
          </div>

          {/* List of Steps */}
          <div className="space-y-16">
            {steps.map((step, i) => {
              const StepIllustration = step.illustration;
              return (
                <div key={step.num} className="border-b border-champagne-gold/10 pb-12 last:border-b-0 last:pb-0">
                  <div className="aspect-square max-w-xs mx-auto rounded-2xl border border-champagne-gold/20 bg-warm-cream/5 flex items-center justify-center p-8 mb-6 overflow-hidden">
                    <StepIllustration isActive={true} />
                  </div>
                  <div className="px-2">
                    <span className="font-header text-4xl text-champagne-gold/25 block mb-2">{step.num}</span>
                    <span className="font-accent text-[9px] uppercase tracking-[0.3em] text-champagne-gold/40 block mb-2">{step.subtitle}</span>
                    <h3 className="font-header text-2xl text-champagne-gold mb-4 font-semibold">{step.title}</h3>
                    <p className="font-body text-sm leading-relaxed text-warm-cream/70 mb-4">{step.description}</p>
                    <p className="font-french italic text-lg text-champagne-gold/60">{step.accent}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Print Button */}
          <div className="mt-20 text-center print:hidden">
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

  return (
    <section id="how-to-wear-print-section" ref={containerRef} className="relative h-[400vh] bg-deep-walnut text-warm-cream print:bg-white print:text-black print:py-8 print:h-auto">
      <div className="sticky top-0 h-svh w-full flex flex-col justify-center overflow-hidden py-12 lg:py-24 print:static print:h-auto print:overflow-visible">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(207,197,178,0.06),transparent_65%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 print:mb-12">
          <motion.p
            className="font-accent text-[10px] uppercase tracking-[0.28em] text-champagne-gold mb-6 print:text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Ritual
          </motion.p>
          <motion.h2
            className="font-header text-5xl lg:text-7xl mb-8 print:text-4xl text-champagne-gold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            How to Wear
          </motion.h2>
          <motion.p
            className="font-french italic text-xl lg:text-2xl text-champagne-gold/80 print:text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A seamless connection between craft and collar.
          </motion.p>
        </div>

        {/* Main Interactive Area */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-5xl mx-auto">

          {/* Illustration Panel */}
          <motion.div
            className="w-full max-w-[18rem] sm:max-w-xs lg:max-w-sm flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square relative min-h-[240px] sm:min-h-0">
              {/* Step number badge */}
              <div className="absolute -top-4 -left-4 z-10 w-12 h-12 bg-champagne-gold rounded-full flex items-center justify-center">
                <span className="font-header text-deep-walnut text-lg font-bold">{activeStep + 1}</span>
              </div>
              {/* Illustration container */}
              <div className="w-full h-full rounded-2xl border border-champagne-gold/20 bg-warm-cream/5 flex items-center justify-center p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <IllustrationComponent isActive={true} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Content + Controls */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Step text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-accent text-[9px] uppercase tracking-[0.3em] text-champagne-gold/40 block mb-3">
                  {currentStep.subtitle}
                </span>
                <h3 className="font-header text-4xl lg:text-5xl text-champagne-gold mb-6">
                  {currentStep.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-warm-cream/60 max-w-sm mx-auto lg:mx-0 mb-6">
                  {currentStep.description}
                </p>
                <p className="font-french italic text-lg text-champagne-gold/50">
                  {currentStep.accent}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator */}
            <div className="mt-8 flex justify-center lg:justify-start print:hidden">
              <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-champagne-gold/40 border border-champagne-gold/20 rounded-full px-4 py-2">
                Scroll to animate
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-5xl mx-auto mt-16 print:hidden">
          <div className="h-px bg-champagne-gold/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-champagne-gold"
              animate={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {steps.map((s, i) => (
              <span
                key={i}
                className={`font-accent text-[8px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                  i <= activeStep ? 'text-champagne-gold' : 'text-champagne-gold/20'
                }`}
              >
                {s.num}
              </span>
            ))}
          </div>
        </div>

        {/* Print / Download */}
        <div className="mt-24 text-center print:hidden">
          <p className="font-french italic text-lg text-champagne-gold/80 mb-8">
            Prefer a physical guide? Print your instruction card.
          </p>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-4 text-champagne-gold font-accent text-[10px] tracking-[0.2em] uppercase px-8 py-4 border border-champagne-gold/30 hover:border-champagne-gold transition-colors"
          >
            <Printer size={14} />
            <span>Print Instruction Card</span>
            <span className="h-px w-8 bg-champagne-gold transition-all group-hover:w-12" />
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
