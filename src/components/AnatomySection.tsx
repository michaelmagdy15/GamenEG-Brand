import { useRef, useState, useLayoutEffect } from 'react';
import { Html, PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BowTieModel } from './canvas/BowTieModel';
import OptimizedCanvas from './canvas/OptimizedCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function AnatomySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [explodeProgress, setExplodeProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setExplodeProgress(self.progress);
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full relative bg-deep-walnut overflow-hidden">
      <div className="absolute top-16 left-0 w-full text-center z-10 pointer-events-none">
        <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">The Anatomy</span>
        <h2 className="font-display text-4xl sm:text-6xl text-champagne-gold">Deconstructing Craft</h2>
        <p className="font-body text-warm-cream/60 mt-4 max-w-md mx-auto text-sm">
          Scroll to explore the layers of our signature wooden bow tie.
        </p>
      </div>

      {/* OptimizedCanvas: no WebGL until visible, capped DPR, no HDR environment */}
      <OptimizedCanvas
        frameloop="always"
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="absolute inset-0"
      >
        {/* Replaced Environment preset="city" (loads ~2MB HDR) with simple lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <directionalLight position={[-5, -3, -2]} intensity={0.3} />

        <PresentationControls
          global
          rotation={[0.1, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          snap={true}
        >
          <BowTieModel explodeProgress={explodeProgress} />

          {/* Annotations — only visible when exploded enough */}
          <Html position={[-2, 1, 1.5 * explodeProgress]} center style={{ pointerEvents: 'none' }}>
            <div className={`transition-all duration-700 ease-out bg-deep-walnut/90 border border-champagne-gold/20 p-4 rounded-xl w-56 backdrop-blur-md ${explodeProgress > 0.4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-champagne-gold font-header text-lg mb-2">The Face</h4>
              <p className="text-warm-cream/60 font-body text-xs leading-relaxed">Hand-carved Zan wood, meticulously sanded to reveal the natural depth of the grain.</p>
            </div>
          </Html>

          <Html position={[2, 0, -0.25]} center style={{ pointerEvents: 'none' }}>
            <div className={`transition-all duration-700 delay-100 ease-out bg-deep-walnut/90 border border-champagne-gold/20 p-4 rounded-xl w-56 backdrop-blur-md ${explodeProgress > 0.6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-champagne-gold font-header text-lg mb-2">The Core</h4>
              <p className="text-warm-cream/60 font-body text-xs leading-relaxed">A structural binding ensuring the piece maintains its precise geometry under tension.</p>
            </div>
          </Html>

          <Html position={[-2, -1, -1.5 * explodeProgress - 0.4]} center style={{ pointerEvents: 'none' }}>
            <div className={`transition-all duration-700 delay-200 ease-out bg-deep-walnut/90 border border-champagne-gold/20 p-4 rounded-xl w-56 backdrop-blur-md ${explodeProgress > 0.8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-champagne-gold font-header text-lg mb-2">The Clip</h4>
              <p className="text-warm-cream/60 font-body text-xs leading-relaxed">A durable, adjustable stainless steel mechanism for seamless, comfortable attachment.</p>
            </div>
          </Html>
        </PresentationControls>
      </OptimizedCanvas>
    </section>
  );
}
