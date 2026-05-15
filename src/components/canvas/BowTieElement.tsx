import { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

export default function BowTieElement() {
  const texture = useTexture(brandAssets.heroBowTie);
  const meshRef = useRef<THREE.Mesh>(null);

  const planeArgs = useMemo<[number, number]>(() => {
    if (!texture.image) return [3.5, 3.5];
    const aspect = texture.image.width / texture.image.height;
    const height = 3;
    return [height * aspect, height];
  }, [texture]);

  // Slow continuous Y-axis rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
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
  );
}

useTexture.preload(brandAssets.heroBowTie);
