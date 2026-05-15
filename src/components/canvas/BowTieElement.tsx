import { useRef, useMemo, useState, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, invalidate } from '@react-three/fiber';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

let lastScrollY = -1;

export default function BowTieElement() {
  const texture = useTexture(brandAssets.heroBowTie);
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  // Respond to viewport changes
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.5);
      else if (w < 768) setScale(0.65);
      else setScale(1);
    };
    updateScale();
    window.addEventListener('resize', updateScale, { passive: true });
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const planeArgs = useMemo<[number, number]>(() => {
    const img = texture.image as HTMLImageElement | undefined;
    if (!img) return [3.5, 3.5];
    const aspect = img.width / img.height;
    const height = 3;
    return [height * aspect, height];
  }, [texture]);

  // Only re-render when scroll position actually changes — debounced by 0.5px threshold
  useFrame(() => {
    if (!meshRef.current) return;
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScrollY) < 0.5) return;
    lastScrollY = scrollY;

    const maxScroll = window.innerHeight * 2;
    const progress = Math.min(scrollY / maxScroll, 1);
    meshRef.current.rotation.y = progress * Math.PI * 2;
    invalidate();
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <planeGeometry args={planeArgs} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

useTexture.preload(brandAssets.heroBowTie);
