import { useRef } from 'react';
import { useTexture, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

export default function BowTieElement() {
  const texture = useTexture(brandAssets.heroBowTie);
  const planeRef = useRef<THREE.Mesh>(null);

  return (
    <PresentationControls
      global
      config={{ mass: 2, tension: 500 }}
      snap={{ mass: 4, tension: 1500 }}
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 6, Math.PI / 6]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
    >
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.6}
        floatingRange={[-0.08, 0.08]}
      >
        <mesh ref={planeRef}>
          <planeGeometry args={[4, 2.5]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.05}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      </Float>
    </PresentationControls>
  );
}

useTexture.preload(brandAssets.heroBowTie);
