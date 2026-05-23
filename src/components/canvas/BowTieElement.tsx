import { useRef, useMemo } from 'react';
import { useFrame, invalidate, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BowTieModel } from './BowTieModel';

export default function BowTieElement() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  const scale = useMemo(() => {
    const w = window.innerWidth;
    if (w < 480) return 0.75;
    if (w < 768) return 0.95;
    return 1.35;
  }, [size]);

  // Only re-render when scroll position actually changes
  useFrame((state) => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY;
    
    // Continuous subtle floating
    const t = state.clock.getElapsedTime();
    const floatY = Math.sin(t * 1.5) * 0.05;
    
    const maxScroll = window.innerHeight * 2;
    const progress = Math.min(scrollY / maxScroll, 1);
    
    // Add scroll-based upward drift, subtle tilt, and full 360 rotation
    groupRef.current.position.y = floatY + progress * 0.5;
    groupRef.current.rotation.x = -progress * 0.1; // very subtle tilt
    groupRef.current.rotation.y = progress * Math.PI * 2; // Scroll-linked 360 rotation around Y axis
    
    invalidate();
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <BowTieModel />
    </group>
  );
}
