import OptimizedCanvas from './OptimizedCanvas';
import { lazy, Suspense } from 'react';

const BowTieElement = lazy(() => import('./BowTieElement'));

export default function HeroScene() {
  return (
    <OptimizedCanvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      frameloop="always"
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
        depth: true,
      }}
      className="!absolute inset-0 pointer-events-auto z-0"
      onCreated={({ gl }) => {
        // Gracefully recover from WebGL context loss (mobile GPU memory pressure)
        const canvas = gl.domElement;
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          console.warn('WebGL context lost — will attempt restore');
        });
        canvas.addEventListener('webglcontextrestored', () => {
          console.info('WebGL context restored');
        });
      }}
    >
      <color attach="background" args={['#2A1B14']} />
      {/* Optimized High-Fidelity Lighting System */}
      <ambientLight intensity={0.35} />
      {/* Key light from top-right-front to define the main shape */}
      <directionalLight position={[5, 6, 4]} intensity={1.2} />
      {/* Back grazing/rim light to pop the wood grain and cylinder metal edges */}
      <directionalLight position={[-6, 2, -3]} intensity={0.8} />
      {/* Deep engraving highlight grazing light from bottom-back */}
      <directionalLight position={[0, -5, -4]} intensity={0.6} />
      {/* Front-fill light close to camera axis to create glistening glossy lacquer sheath */}
      <directionalLight position={[1, 0.5, 5]} intensity={0.4} />

      <Suspense fallback={null}>
        <BowTieElement />
      </Suspense>
    </OptimizedCanvas>
  );
}

