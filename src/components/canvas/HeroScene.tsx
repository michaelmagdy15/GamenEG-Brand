import { Canvas } from '@react-three/fiber';
import BowTieElement from './BowTieElement';

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={1}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
        depth: false,
      }}
      className="!absolute inset-0 pointer-events-auto z-0"
    >
      <color attach="background" args={['#2A1B14']} />

      {/* Minimal lighting — no Environment map, no shadows */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      {/* Main Object */}
      <BowTieElement />

      {/* No post-processing, no ContactShadows, no Environment */}
    </Canvas>
  );
}
