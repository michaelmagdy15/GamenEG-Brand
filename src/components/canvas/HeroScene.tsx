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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <BowTieElement />
      </Suspense>
    </OptimizedCanvas>
  );
}

