import { Canvas } from '@react-three/fiber';
import BowTieElement from './BowTieElement';

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
        depth: true,
      }}
      className="!absolute inset-0 pointer-events-auto z-0"
    >
      <color attach="background" args={['#2A1B14']} />

      {/* Minimal lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      {/* Main Object */}
      <BowTieElement />
    </Canvas>
  );
}
