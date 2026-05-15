import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import BowTieElement from './BowTieElement';
import CinematicEffects from './CinematicEffects';

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]} // Support high-DPI mobile screens for better quality
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0 pointer-events-auto z-0"
    >
      <color attach="background" args={['#2A1B14']} /> {/* Match deep-walnut or make it transparent to blend with DOM */}
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Environment for reflections on the wood/brass */}
      <Environment preset="city" />

      {/* Main Object */}
      <BowTieElement />

      {/* Ground Shadow - Compute ONLY ONCE for massive performance boost */}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} frames={1} resolution={256} />

      {/* Postprocessing */}
      <CinematicEffects />
    </Canvas>
  );
}
