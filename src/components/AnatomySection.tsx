import { useRef } from 'react';
import { Html, PresentationControls } from '@react-three/drei';
import { useScroll, useSpring, motion, useTransform } from 'motion/react';
import { useWindowSize } from 'react-use';
import { BowTieModel } from './canvas/BowTieModel';
import OptimizedCanvas from './canvas/OptimizedCanvas';

export default function AnatomySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Derived values for HTML annotations
  const faceOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const faceY = useTransform(scrollYProgress, [0.3, 0.4], [16, 0]);
  
  const coreOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const coreY = useTransform(scrollYProgress, [0.5, 0.6], [16, 0]);
  
  const clipOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const clipY = useTransform(scrollYProgress, [0.7, 0.8], [16, 0]);

  return (
    <section ref={containerRef} className="h-[250vh] w-full relative bg-deep-walnut">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute top-16 left-0 w-full text-center z-10 pointer-events-none">
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 block mb-4">The <span className="font-lambda">Λ</span>natomy</span>
          <h2 className="font-display text-4xl sm:text-6xl text-champagne-gold">Deconstructing Cr<span className="font-lambda">Λ</span>ft</h2>
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
          <group scale={isMobile ? 0.55 : 1}>
            <BowTieModel explodeProgressValue={scrollYProgress} />

            {/* Annotations — using framer-motion inside Html to avoid React state re-renders */}
            {/* Changed positions to be closer to center for mobile screens: x from -2/2 to -1/1 */}
            <Html position={[isMobile ? -0.6 : -1.2, isMobile ? 1.5 : 1, 1.5]} center style={{ pointerEvents: 'none', zIndex: 10 }}>
              <motion.div style={{ opacity: faceOpacity, y: faceY }} className="bg-deep-walnut/90 border border-champagne-gold/20 p-3 md:p-4 rounded-xl w-36 md:w-56 backdrop-blur-md">
                <h4 className="text-champagne-gold font-header text-base md:text-lg mb-1 md:mb-2">The F<span className="font-lambda">Λ</span>ce</h4>
                <p className="text-warm-cream/60 font-body text-[10px] md:text-xs leading-relaxed">Hand-carved Zan wood, meticulously sanded to reveal the natural depth of the grain.</p>
              </motion.div>
            </Html>

            <Html position={[isMobile ? 0.6 : 1.2, isMobile ? 0.5 : 0, -0.25]} center style={{ pointerEvents: 'none', zIndex: 10 }}>
              <motion.div style={{ opacity: coreOpacity, y: coreY }} className="bg-deep-walnut/90 border border-champagne-gold/20 p-3 md:p-4 rounded-xl w-36 md:w-56 backdrop-blur-md">
                <h4 className="text-champagne-gold font-header text-base md:text-lg mb-1 md:mb-2">The Core</h4>
                <p className="text-warm-cream/60 font-body text-[10px] md:text-xs leading-relaxed">Λ structural binding ensuring the piece maintains its precise geometry under tension.</p>
              </motion.div>
            </Html>

            <Html position={[isMobile ? -0.6 : -1.2, isMobile ? -1.5 : -1, -1.9]} center style={{ pointerEvents: 'none', zIndex: 10 }}>
              <motion.div style={{ opacity: clipOpacity, y: clipY }} className="bg-deep-walnut/90 border border-champagne-gold/20 p-3 md:p-4 rounded-xl w-36 md:w-56 backdrop-blur-md">
                <h4 className="text-champagne-gold font-header text-base md:text-lg mb-1 md:mb-2">The Clip</h4>
                <p className="text-warm-cream/60 font-body text-[10px] md:text-xs leading-relaxed">Λ durable, adjustable stainless steel mechanism for seamless, comfortable attachment.</p>
              </motion.div>
            </Html>
          </group>
        </PresentationControls>
      </OptimizedCanvas>
      </div>
    </section>
  );
}
