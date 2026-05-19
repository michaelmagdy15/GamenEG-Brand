import { useRef, useMemo, useState, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, invalidate } from '@react-three/fiber';
import * as THREE from 'three';
import { brandAssets } from '../../brandAssets';

let lastScrollY = -1;

export default function BowTieElement() {
  const texture = useTexture(brandAssets.twoToneBowTie);
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
  useFrame((state) => {
    if (!meshRef.current) return;
    const scrollY = window.scrollY;
    
    // Continuous subtle floating
    const t = state.clock.getElapsedTime();
    const floatY = Math.sin(t * 1.5) * 0.05;
    
    const maxScroll = window.innerHeight * 2;
    const progress = Math.min(scrollY / maxScroll, 1);
    
    // Add scroll-based upward drift, subtle tilt, and full 360 rotation
    meshRef.current.position.y = floatY + progress * 0.5;
    meshRef.current.rotation.x = -progress * 0.1; // very subtle tilt
    meshRef.current.rotation.y = progress * Math.PI * 2; // Scroll-linked 360 rotation around Y axis
    
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

useTexture.preload(brandAssets.twoToneBowTie);
