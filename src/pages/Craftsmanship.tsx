import { useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { brandAssets } from '../brandAssets';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Group } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BowTieModel } from '../components/canvas/BowTieModel';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Selection',
    text: 'Each bow tie begins with the wood. We source sustainably from trusted suppliers across Africa and Europe, selecting pieces with the most expressive grain patterns and tonal depth.',
  },
  {
    num: '02',
    title: 'Shaping',
    text: 'Using hand chisels and rotary tools, the raw block is sculpted into the iconic bow tie silhouette. No CNC machines. No templates. Every curve is guided by the natural grain of the wood.',
  },
  {
    num: '03',
    title: 'Detailing',
    text: 'Motifs like the Eye of Horus are micro-engraved by hand, then filled with sand-cast brass. Every inlay is polished individually until it sits flush with the surrounding wood surface.',
  },
  {
    num: '04',
    title: 'Finishing',
    text: 'Multiple rounds of hand-sanding (up to 2000 grit) create a surface that feels like silk. The piece is then treated with natural oils or lacquer depending on the desired finish.',
  },
  {
    num: '05',
    title: 'Assembly',
    text: 'The adjustable neckband is hand-stitched and attached. The piece is inspected under magnification for any imperfections before being placed in its presentation box.',
  },
];

export default function Craftsmanship() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bowtieRef = useRef<Group>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const stepElements = gsap.utils.toArray<HTMLElement>('.craft-step');
      
      const rotations = [
        [0, 0, 0],                     // 01: Selection (Front View)
        [0, Math.PI / 2.5, 0],         // 02: Shaping (Angled Side View)
        [-Math.PI / 6, 0, 0],          // 03: Detailing (Tilted up)
        [0, 0, Math.PI / 6],           // 04: Finishing (Rotated slightly)
        [0, Math.PI, 0],               // 05: Assembly (Back View)
      ];

      stepElements.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => animateToStep(i),
          onEnterBack: () => animateToStep(i)
        });
      });

      function animateToStep(index: number) {
        if (!bowtieRef.current) return;
        gsap.to(bowtieRef.current.rotation, {
          x: rotations[index][0],
          y: rotations[index][1],
          z: rotations[index][2],
          duration: 1.2,
          ease: 'power3.out'
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
          <p className="font-body text-warm-cream/60 text-sm max-w-xl mx-auto leading-relaxed">
            From raw timber to finished masterpiece, every GΛMÉN piece passes through over 20 stages of handcraft 
            in our Cairo atelier. Here is how each one comes to life.
          </p>
        </motion.div>
      </section>

      {/* Split Scroll Section */}
      <section className="relative px-6 sm:px-10 max-w-7xl mx-auto mb-24 lg:flex lg:gap-16">
        
        {/* Sticky 3D Model Container */}
        <div className="hidden lg:block w-1/2 relative">
          <div className="sticky top-32 h-[60vh] w-full rounded-2xl overflow-hidden bg-warm-cream/5 border border-champagne-gold/10">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <BowTieModel ref={bowtieRef} />
            </Canvas>
          </div>
        </div>

        {/* Process Steps List */}
        <div className="lg:w-1/2 space-y-32 py-10 lg:py-32">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
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
                <h3 className="font-header text-2xl md:text-3xl text-champagne-gold mb-4">{step.title}</h3>
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
            { name: 'Walnut', origin: 'Egypt & Turkey', note: 'Rich, warm tones with deep grain character' },
            { name: 'Mahogany', origin: 'West Africa', note: 'Dense hardwood with a reddish-brown hue' },
            { name: 'Sycamore', origin: 'Mediterranean', note: 'Light, blonde wood for contrast inlays' },
            { name: 'Brass', origin: 'Cairo Foundries', note: 'Sand-cast and hand-polished for every inlay' },
          ].map((m) => (
            <div key={m.name} className="border border-champagne-gold/10 rounded-xl p-6">
              <h4 className="font-header text-lg text-champagne-gold mb-1">{m.name}</h4>
              <span className="font-accent text-[9px] uppercase tracking-[0.15em] text-champagne-gold/40 block mb-3">{m.origin}</span>
              <p className="font-body text-xs text-warm-cream/50 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
