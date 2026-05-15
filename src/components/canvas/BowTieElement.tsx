import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float, PresentationControls, MeshReflectorMaterial, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

export default function BowTieElement() {
  const texture = useTexture(brandAssets.heroBowTie);
  const planeRef = useRef<THREE.Mesh>(null);

  // Rotate subtly based on mouse movement could be done here or handled by PresentationControls
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
        speed={2} // Animation speed
        rotationIntensity={0.5} // XYZ rotation intensity
        floatIntensity={1} // Up/down float intensity
        floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
      >
        <mesh ref={planeRef} castShadow receiveShadow>
          {/* We use a plane that matches the aspect ratio of the image. Assuming roughly 16:9 or similar. Adjust as needed. */}
          <planeGeometry args={[4, 2.5]} />
          <meshPhysicalMaterial 
            map={texture} 
            transparent 
            alphaTest={0.05} 
            roughness={0.4} 
            metalness={0.1}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </Float>
    </PresentationControls>
  );
}

useTexture.preload(brandAssets.heroBowTie);
