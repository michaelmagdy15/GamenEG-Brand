import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

const steps = [
  {
    num: '01',
    title: 'Selection',
    /* PENDING COPY UPDATE: Selection Step Description */
    text: 'Each bow tie begins with the wood. We source sustainably from trusted suppliers across Africa and Europe, selecting pieces with the most expressive grain patterns and tonal depth.',
  },
  {
    num: '02',
    title: 'Shaping',
    /* PENDING COPY UPDATE: Shaping Step Description */
    text: 'Using hand chisels and rotary tools, the raw block is sculpted into the iconic bow tie silhouette. No CNC machines. No templates. Every curve is guided by the natural grain of the wood.',
  },
  {
    num: '03',
    title: 'Detailing',
    /* PENDING COPY UPDATE: Detailing Step Description */
    text: 'Motifs like the Eye of Horus are micro-engraved by hand, then filled with sand-cast brass. Every inlay is polished individually until it sits flush with the surrounding wood surface.',
  },
  {
    num: '04',
    title: 'Finishing',
    /* PENDING COPY UPDATE: Finishing Step Description */
    text: 'Multiple rounds of hand-sanding (up to 2000 grit) create a surface that feels like silk. The piece is then treated with natural oils or lacquer depending on the desired finish.',
  },
  {
    num: '05',
    title: 'Assembly',
    /* PENDING COPY UPDATE: Assembly Step Description */
    text: 'The adjustable neckband is hand-stitched and attached. The piece is inspected under magnification for any imperfections before being placed in its presentation box.',
  },
];

export default function Craftsmanship() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track which step is currently in focus using an IntersectionObserver
  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveStep(index);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px', // Trigger when step is in the middle 20% of viewport
      }
    );

    const stepElements = document.querySelectorAll('.craft-step');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, [isDesktop]);

  return (
    <main ref={containerRef} className="min-h-screen bg-deep-walnut pt-36 pb-24">
      {/* Hero */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">The Process</span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-champagne-gold leading-[0.9] tracking-tighter mb-6">
            Made by <span className="italic font-light">Hand</span>
          </h1>
          <div className="w-24 h-px bg-gold-gradient mx-auto mb-8" />
          {/* PENDING COPY UPDATE: Hero Description */}
          <p className="font-body text-warm-cream/60 text-sm max-w-xl mx-auto leading-relaxed">
            {/* PLACEHOLDER: Enter the new hero description below */}
            From raw timber to finished masterpiece, every GΛMÉN piece passes through over 20 stages of handcraft 
            in our Cairo atelier. Here is how each one comes to life.
          </p>
        </motion.div>
      </section>

      {/* Split Scroll Section */}
      <section className="relative px-6 sm:px-10 max-w-7xl mx-auto mb-24 lg:flex lg:gap-16">
        
        {/* Sticky Spinning Model Container */}
        <div className="hidden lg:block w-1/2 relative">
          <div className="sticky top-32 h-[60vh] w-full rounded-2xl overflow-hidden bg-warm-cream/5 border border-champagne-gold/10 relative flex items-center justify-center p-8">
            
            {/* Ambient gold glow that changes opacity/blur based on activeStep */}
            <div 
              className="absolute w-[70%] h-[70%] rounded-full transition-all duration-1000 blur-3xl pointer-events-none"
              style={{
                background: activeStep === 0 
                  ? 'radial-gradient(circle, rgba(139,94,60,0.15) 0%, transparent 70%)' // Walnut wood glow
                  : activeStep === 1
                  ? 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)'  // Golden shaping glow
                  : activeStep === 2
                  ? 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)'  // Strong detailing highlight
                  : activeStep === 3
                  ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' // Soft finishing polish
                  : 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' // Full assembly shine
              }}
            />

            {/* Glowing borders/accents */}
            <div className="absolute inset-0 border border-champagne-gold/5 pointer-events-none" />
            
            {isDesktop && (
              <motion.div
                key={activeStep}
                initial={{ scale: 0.96, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src="/Images/bowtie 3d spin/BOWSPIN.gif"
                  alt="GΛMÉN Bow Tie Craftsmanship Showcase"
                  className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter contrast-125 saturate-105"
                  style={{ clipPath: 'inset(0% 3% 0% 3%)' }}
                />
              </motion.div>
            )}
            
            {/* Step HUD indicator at the top right of the sticky window */}
            <div className="absolute top-6 right-6 pointer-events-none select-none">
              <span className="font-accent text-[9px] tracking-[0.25em] text-champagne-gold/25 uppercase">
                STAGE {steps[activeStep].num} // {steps[activeStep].title}
              </span>
            </div>

          </div>
        </div>

        {/* Process Steps List */}
        <div className="lg:w-1/2 space-y-16 lg:space-y-32 py-10 lg:py-32">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              data-index={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="craft-step flex flex-col md:flex-row gap-6 md:gap-12"
            >
              <div className="flex-shrink-0">
                <span className="font-header text-5xl md:text-7xl text-champagne-gold/15">{step.num}</span>
              </div>
              <div className="flex-1 border-l border-champagne-gold/15 pl-6 md:pl-8 pt-2">
                <h2 className="font-header text-2xl md:text-3xl text-champagne-gold mb-4 font-semibold">{step.title}</h2>
                <p className="font-body text-sm leading-relaxed text-warm-cream/60">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="px-6 sm:px-10 max-w-5xl mx-auto mt-32">
        <h2 className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 text-center mb-12">Our Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'Walnut', 
              origin: 'Egypt & Turkey', 
              /* PENDING COPY UPDATE: Walnut Note */
              note: 'Rich, warm tones with deep grain character' 
            },
            { 
              name: 'Mahogany', 
              origin: 'West Africa', 
              /* PENDING COPY UPDATE: Mahogany Note */
              note: 'Dense hardwood with a reddish-brown hue' 
            },
            { 
              name: 'Sycamore', 
              origin: 'Mediterranean', 
              /* PENDING COPY UPDATE: Sycamore Note */
              note: 'Light, blonde wood for contrast inlays' 
            },
            { 
              name: 'Brass', 
              origin: 'Cairo Foundries', 
              /* PENDING COPY UPDATE: Brass Note */
              note: 'Sand-cast and hand-polished for every inlay' 
            },
          ].map((m) => (
            <div key={m.name} className="border border-champagne-gold/10 rounded-xl p-6">
              <h3 className="font-header text-lg text-champagne-gold mb-1 font-semibold">{m.name}</h3>
              <span className="font-accent text-[9px] uppercase tracking-[0.15em] text-champagne-gold/40 block mb-3">{m.origin}</span>
              <p className="font-body text-xs text-warm-cream/50 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
