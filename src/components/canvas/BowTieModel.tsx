import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Group, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface BowTieModelProps {
  explodeProgress?: number; // 0 (collapsed) to 1 (fully exploded)
  autoRotate?: boolean;
}

export const BowTieModel = forwardRef<Group, BowTieModelProps>(
  ({ explodeProgress = 0, autoRotate = false }, ref) => {
    const localGroupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => localGroupRef.current as Group);

    const faceRef = useRef<Group>(null);
    const coreRef = useRef<Group>(null);
    const backRef = useRef<Group>(null);

    // ✅ Memoize materials — previously recreated on EVERY render
    const woodMaterial = useMemo(() => new MeshStandardMaterial({
      color: '#3d2516',
      roughness: 0.8,
      metalness: 0.1,
    }), []);

    const coreMaterial = useMemo(() => new MeshStandardMaterial({
      color: '#1a100b',
      roughness: 0.9,
      metalness: 0.1,
    }), []);

    const steelMaterial = useMemo(() => new MeshStandardMaterial({
      color: '#a0a0a0',
      roughness: 0.2,
      metalness: 0.9,
    }), []);

    useFrame(() => {
      if (autoRotate && localGroupRef.current) {
        localGroupRef.current.rotation.y += 0.005;
      }

      // Apply explode offsets based on progress
      const maxOffset = 1.5;
      if (faceRef.current) faceRef.current.position.z = explodeProgress * maxOffset;
      if (backRef.current) backRef.current.position.z = -explodeProgress * maxOffset;
    });

    return (
      // dispose={null} prevents Three.js from auto-disposing shared geometry/materials
      <group ref={localGroupRef} dispose={null}>
        {/* FACE LAYER */}
        <group ref={faceRef}>
          {/* Center Knot */}
          <mesh material={woodMaterial} position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.45]} />
          </mesh>
          {/* Left Wing — 3 segments (triangle) is optimal for a flat prism shape */}
          <mesh material={woodMaterial} position={[-1.5, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[1.2, 1.2, 0.4, 3]} />
          </mesh>
          {/* Right Wing */}
          <mesh material={woodMaterial} position={[1.5, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6 + Math.PI]}>
            <cylinderGeometry args={[1.2, 1.2, 0.4, 3]} />
          </mesh>
        </group>

        {/* CORE LAYER */}
        <group ref={coreRef} position={[0, 0, -0.25]}>
          <mesh material={coreMaterial} position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.1]} />
          </mesh>
          <mesh material={coreMaterial} position={[-1.4, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[1.1, 1.1, 0.1, 3]} />
          </mesh>
          <mesh material={coreMaterial} position={[1.4, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6 + Math.PI]}>
            <cylinderGeometry args={[1.1, 1.1, 0.1, 3]} />
          </mesh>
        </group>

        {/* BACK / CLIP LAYER */}
        <group ref={backRef} position={[0, 0, -0.4]}>
          {/* Steel Band / Clip — reduced cylinder segments: 16 → 8 */}
          <mesh material={steelMaterial} position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.2]} />
          </mesh>
          <mesh material={steelMaterial} position={[0.4, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          </mesh>
          <mesh material={steelMaterial} position={[-0.4, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          </mesh>
        </group>
      </group>
    );
  }
);

BowTieModel.displayName = 'BowTieModel';
