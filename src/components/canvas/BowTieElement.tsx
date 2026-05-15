import { useRef, useMemo } from 'react';
import { useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

export default function BowTieElement() {
  const texture = useTexture(brandAssets.heroBowTie);
  const planeRef = useRef<THREE.Mesh>(null);

  // Calculate plane dimensions from actual texture aspect ratio
  // so the bow tie is never stretched
  const planeArgs = useMemo<[number, number]>(() => {
    if (!texture.image) return [3.5, 3.5];
    const aspect = texture.image.width / texture.image.height;
    const height = 3; // base height in 3D units
    return [height * aspect, height];
  }, [texture]);

  return (
    <Float
      speed={1.8}
      rotationIntensity={0.4}
      floatIntensity={0.5}
      floatingRange={[-0.06, 0.06]}
    >
      <mesh ref={planeRef}>
        <planeGeometry args={planeArgs} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          roughness={0.5}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

useTexture.preload(brandAssets.heroBowTie);
