import { useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Group } from 'three';
import { useFrame, useThree, invalidate } from '@react-three/fiber';
import { MotionValue } from 'motion/react';

interface BowTieModelProps {
  explodeProgressValue?: MotionValue<number>;
  autoRotate?: boolean;
  targetRotation?: { x: number; y: number; z: number };
}

// ==========================================
// 1. Procedural Geometry Generators
// ==========================================

/**
 * Creates the Left Wing Geometry as a solid, closed 3D manifold.
 * Has a curved front face, flat back (z=0), and sharp side walls (skirt).
 */
function createLeftWingGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const Nu = 32;
  const Nv = 32;
  
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  
  // A. Front face vertices
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    for (let j = 0; j < Nv; j++) {
      const v = -1 + 2 * (j / (Nv - 1));
      const H = 0.667 + 1.333 * Math.pow(u, 1.5);
      const y = (v * H) / 2;
      const x = -(0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
      const T_base = 0.17 + 0.227 * Math.pow(u, 1.5);
      const zFront = T_base - 0.11 * u * (1.0 - Math.pow(1.0 - u, 4.0)) * (1.0 - v * v);
      
      positions.push(x, y, zFront);
      uvs.push(u, (v + 1) / 2);
    }
  }
  
  // Front face indices (CCW winding looking from +Z)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = i * Nv + j;
      const idxB = (i + 1) * Nv + j;
      const idxC = (i + 1) * Nv + (j + 1);
      const idxD = i * Nv + (j + 1);
      
      indices.push(idxA, idxB, idxC);
      indices.push(idxA, idxC, idxD);
    }
  }
  
  // B. Back face vertices
  const backOffset = Nu * Nv; // 1024
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    for (let j = 0; j < Nv; j++) {
      const v = -1 + 2 * (j / (Nv - 1));
      const H = 0.667 + 1.333 * Math.pow(u, 1.5);
      const y = (v * H) / 2;
      const x = -(0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
      const zBack = 0;
      
      positions.push(x, y, zBack);
      uvs.push(u, (v + 1) / 2);
    }
  }
  
  // Back face indices (reversed winding to face -Z)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = backOffset + i * Nv + j;
      const idxB = backOffset + (i + 1) * Nv + j;
      const idxC = backOffset + (i + 1) * Nv + (j + 1);
      const idxD = backOffset + i * Nv + (j + 1);
      
      indices.push(idxA, idxC, idxB);
      indices.push(idxA, idxD, idxC);
    }
  }
  
  // C. Skirt perimeter tracing
  const perimeter: [number, number][] = [];
  // Bottom: j = 0, i from 0 to Nu - 1
  for (let i = 0; i < Nu; i++) perimeter.push([i, 0]);
  // Right: i = Nu - 1, j from 1 to Nv - 1
  for (let j = 1; j < Nv; j++) perimeter.push([Nu - 1, j]);
  // Top: j = Nv - 1, i from Nu - 2 down to 0
  for (let i = Nu - 2; i >= 0; i--) perimeter.push([i, Nv - 1]);
  // Left: i = 0, j from Nv - 2 down to 1
  for (let j = Nv - 2; j >= 1; j--) perimeter.push([0, j]);
  
  const M = perimeter.length;
  const skirtOffset = 2 * Nu * Nv; // 2048
  
  for (let k = 0; k < M; k++) {
    const [i, j] = perimeter[k];
    const u = i / (Nu - 1);
    const v = -1 + 2 * (j / (Nv - 1));
    
    const H = 0.667 + 1.333 * Math.pow(u, 1.5);
    const y = (v * H) / 2;
    const x = -(0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
    const T_base = 0.17 + 0.227 * Math.pow(u, 1.5);
    const zFront = T_base - 0.11 * u * (1.0 - Math.pow(1.0 - u, 4.0)) * (1.0 - v * v);
    const zBack = 0;
    
    // Front skirt vertex k
    positions.push(x, y, zFront);
    uvs.push(k / M, 0);
    
    // Back skirt vertex k
    positions.push(x, y, zBack);
    uvs.push(k / M, 1);
  }
  
  // Skirt indices (connecting front perimeter to back perimeter)
  for (let k = 0; k < M; k++) {
    const nextK = (k + 1) % M;
    const idxA_front = skirtOffset + 2 * k;
    const idxA_back  = skirtOffset + 2 * k + 1;
    const idxB_front = skirtOffset + 2 * nextK;
    const idxB_back  = skirtOffset + 2 * nextK + 1;
    
    // Triangle 1
    indices.push(idxA_front, idxB_front, idxB_back);
    // Triangle 2
    indices.push(idxA_front, idxB_back, idxA_back);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  
  // Define index groups for materials:
  const frontFaceIndexCount = (Nu - 1) * (Nv - 1) * 6;
  const backFaceIndexCount = (Nu - 1) * (Nv - 1) * 6;
  const skirtIndexCount = M * 6;
  
  // Group 0: Front face (materialIndex: 0)
  geometry.addGroup(0, frontFaceIndexCount, 0);
  // Group 1: Back face (materialIndex: 1)
  geometry.addGroup(frontFaceIndexCount, backFaceIndexCount, 1);
  // Group 2: Skirt edges (materialIndex: 0)
  geometry.addGroup(frontFaceIndexCount + backFaceIndexCount, skirtIndexCount, 0);
  
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates the Right Wing Geometry as a perfectly mirrored copy of the Left Wing.
 * Mirrors X position and reverses index winding to keep the faces facing outwards.
 */
function createRightWingGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const Nu = 32;
  const Nv = 32;
  
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  
  // A. Front face vertices
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    for (let j = 0; j < Nv; j++) {
      const v = -1 + 2 * (j / (Nv - 1));
      const H = 0.667 + 1.333 * Math.pow(u, 1.5);
      const y = (v * H) / 2;
      // Mirror X
      const x = (0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
      const T_base = 0.17 + 0.227 * Math.pow(u, 1.5);
      const zFront = T_base - 0.11 * u * (1.0 - Math.pow(1.0 - u, 4.0)) * (1.0 - v * v);
      
      positions.push(x, y, zFront);
      uvs.push(1 - u, (v + 1) / 2);
    }
  }
  
  // Front face indices (reversed winding to face outwards after mirroring X)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = i * Nv + j;
      const idxB = (i + 1) * Nv + j;
      const idxC = (i + 1) * Nv + (j + 1);
      const idxD = i * Nv + (j + 1);
      
      indices.push(idxA, idxC, idxB);
      indices.push(idxA, idxD, idxC);
    }
  }
  
  // B. Back face vertices
  const backOffset = Nu * Nv; // 1024
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    for (let j = 0; j < Nv; j++) {
      const v = -1 + 2 * (j / (Nv - 1));
      const H = 0.667 + 1.333 * Math.pow(u, 1.5);
      const y = (v * H) / 2;
      // Mirror X
      const x = (0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
      const zBack = 0;
      
      positions.push(x, y, zBack);
      uvs.push(1 - u, (v + 1) / 2);
    }
  }
  
  // Back face indices (reversed compared to Left Wing)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = backOffset + i * Nv + j;
      const idxB = backOffset + (i + 1) * Nv + j;
      const idxC = backOffset + (i + 1) * Nv + (j + 1);
      const idxD = backOffset + i * Nv + (j + 1);
      
      indices.push(idxA, idxB, idxC);
      indices.push(idxA, idxC, idxD);
    }
  }
  
  // C. Skirt perimeter tracing
  const perimeter: [number, number][] = [];
  // Bottom: j = 0, i from 0 to Nu - 1
  for (let i = 0; i < Nu; i++) perimeter.push([i, 0]);
  // Right: i = Nu - 1, j from 1 to Nv - 1
  for (let j = 1; j < Nv; j++) perimeter.push([Nu - 1, j]);
  // Top: j = Nv - 1, i from Nu - 2 down to 0
  for (let i = Nu - 2; i >= 0; i--) perimeter.push([i, Nv - 1]);
  // Left: i = 0, j from Nv - 2 down to 1
  for (let j = Nv - 2; j >= 1; j--) perimeter.push([0, j]);
  
  const M = perimeter.length;
  const skirtOffset = 2 * Nu * Nv; // 2048
  
  for (let k = 0; k < M; k++) {
    const [i, j] = perimeter[k];
    const u = i / (Nu - 1);
    const v = -1 + 2 * (j / (Nv - 1));
    
    const H = 0.667 + 1.333 * Math.pow(u, 1.5);
    const y = (v * H) / 2;
    // Mirror X
    const x = (0.417 + u * 1.5 - 0.1 * u * (1.0 - v * v));
    const T_base = 0.17 + 0.227 * Math.pow(u, 1.5);
    const zFront = T_base - 0.11 * u * (1.0 - Math.pow(1.0 - u, 4.0)) * (1.0 - v * v);
    const zBack = 0;
    
    positions.push(x, y, zFront);
    uvs.push(1 - k / M, 0);
    
    positions.push(x, y, zBack);
    uvs.push(1 - k / M, 1);
  }
  
  // Skirt indices (reversed winding)
  for (let k = 0; k < M; k++) {
    const nextK = (k + 1) % M;
    const idxA_front = skirtOffset + 2 * k;
    const idxA_back  = skirtOffset + 2 * k + 1;
    const idxB_front = skirtOffset + 2 * nextK;
    const idxB_back  = skirtOffset + 2 * nextK + 1;
    
    // Triangle 1
    indices.push(idxA_front, idxB_back, idxB_front);
    // Triangle 2
    indices.push(idxA_front, idxA_back, idxB_back);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  
  // Define index groups for materials:
  const frontFaceIndexCount = (Nu - 1) * (Nv - 1) * 6;
  const backFaceIndexCount = (Nu - 1) * (Nv - 1) * 6;
  const skirtIndexCount = M * 6;
  
  // Group 0: Front face (materialIndex: 0)
  geometry.addGroup(0, frontFaceIndexCount, 0);
  // Group 1: Back face (materialIndex: 1)
  geometry.addGroup(frontFaceIndexCount, backFaceIndexCount, 1);
  // Group 2: Skirt edges (materialIndex: 0)
  geometry.addGroup(frontFaceIndexCount + backFaceIndexCount, skirtIndexCount, 0);
  
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates the Center Ring / Knot Geometry.
 * Symmetrical width=0.833, height=0.667 with crowned front and flat back.
 */
function createCenterKnotGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const Nu = 32;
  const Nv = 32;
  
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  
  const halfW = 0.416667;
  const halfH = 0.333333;
  
  // A. Front face
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    const x = -halfW + 2 * halfW * u;
    for (let j = 0; j < Nv; j++) {
      const v = j / (Nv - 1);
      const y = -halfH + 2 * halfH * v;
      
      const termX = 1.0 - Math.pow(x / halfW, 2);
      const termY = 1.0 - Math.pow(y / halfH, 2);
      const zFront = 0.17 + 0.03 * termX * termY;
      
      positions.push(x, y, zFront);
      uvs.push(u, v);
    }
  }
  
  // Front face indices (CCW winding)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = i * Nv + j;
      const idxB = (i + 1) * Nv + j;
      const idxC = (i + 1) * Nv + (j + 1);
      const idxD = i * Nv + (j + 1);
      
      indices.push(idxA, idxB, idxC);
      indices.push(idxA, idxC, idxD);
    }
  }
  
  // B. Back face
  const backOffset = Nu * Nv;
  for (let i = 0; i < Nu; i++) {
    const u = i / (Nu - 1);
    const x = -halfW + 2 * halfW * u;
    for (let j = 0; j < Nv; j++) {
      const v = j / (Nv - 1);
      const y = -halfH + 2 * halfH * v;
      const zBack = 0;
      
      positions.push(x, y, zBack);
      uvs.push(u, v);
    }
  }
  
  // Back face indices (reversed winding)
  for (let i = 0; i < Nu - 1; i++) {
    for (let j = 0; j < Nv - 1; j++) {
      const idxA = backOffset + i * Nv + j;
      const idxB = backOffset + (i + 1) * Nv + j;
      const idxC = backOffset + (i + 1) * Nv + (j + 1);
      const idxD = backOffset + i * Nv + (j + 1);
      
      indices.push(idxA, idxC, idxB);
      indices.push(idxA, idxD, idxC);
    }
  }
  
  // C. Skirt perimeter tracing
  const perimeter: [number, number][] = [];
  // Bottom: j = 0, i from 0 to Nu - 1
  for (let i = 0; i < Nu; i++) perimeter.push([i, 0]);
  // Right: i = Nu - 1, j from 1 to Nv - 1
  for (let j = 1; j < Nv; j++) perimeter.push([Nu - 1, j]);
  // Top: j = Nv - 1, i from Nu - 2 down to 0
  for (let i = Nu - 2; i >= 0; i--) perimeter.push([i, Nv - 1]);
  // Left: i = 0, j from Nv - 2 down to 1
  for (let j = Nv - 2; j >= 1; j--) perimeter.push([0, j]);
  
  const M = perimeter.length;
  const skirtOffset = 2 * Nu * Nv;
  
  for (let k = 0; k < M; k++) {
    const [i, j] = perimeter[k];
    const u = i / (Nu - 1);
    const v = j / (Nv - 1);
    const x = -halfW + 2 * halfW * u;
    const y = -halfH + 2 * halfH * v;
    
    const termX = 1.0 - Math.pow(x / halfW, 2);
    const termY = 1.0 - Math.pow(y / halfH, 2);
    const zFront = 0.17 + 0.03 * termX * termY;
    const zBack = 0;
    
    positions.push(x, y, zFront);
    uvs.push(k / M, 0);
    
    positions.push(x, y, zBack);
    uvs.push(k / M, 1);
  }
  
  // Skirt indices
  for (let k = 0; k < M; k++) {
    const nextK = (k + 1) % M;
    const idxA_front = skirtOffset + 2 * k;
    const idxA_back  = skirtOffset + 2 * k + 1;
    const idxB_front = skirtOffset + 2 * nextK;
    const idxB_back  = skirtOffset + 2 * nextK + 1;
    
    indices.push(idxA_front, idxB_front, idxB_back);
    indices.push(idxA_front, idxB_back, idxA_back);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  
  geometry.computeVertexNormals();
  return geometry;
}

// ==========================================
// 2. React BowTieModel Component
// ==========================================

export const BowTieModel = forwardRef<Group, BowTieModelProps>(
  ({ explodeProgressValue, autoRotate = false, targetRotation }, ref) => {
    const localGroupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => localGroupRef.current as Group);

    const faceRef = useRef<Group>(null);
    const coreRef = useRef<Group>(null);
    const backRef = useRef<Group>(null);

    const { gl, size } = useThree();

    // 📱 Responsive layout scale based on viewport width
    const responsiveScale = useMemo(() => {
      const w = window.innerWidth;
      if (w < 480) return 0.75;
      if (w < 768) return 0.95;
      return 1.25;
    }, [size]);

    const [woodGrainTexture, setWoodGrainTexture] = useState<THREE.Texture | null>(null);
    const [luxuryWoodTexture, setLuxuryWoodTexture] = useState<THREE.Texture | null>(null);
    
    const woodGrainTextureRef = useRef<THREE.Texture | null>(null);
    const luxuryWoodTextureRef = useRef<THREE.Texture | null>(null);

    // Dynamic 2D Canvas Texture for "G A M E N" vertical engraving
    const engravingTexture = useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High-height background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 256);
        
        // Deep dark debossed text (black)
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 40px Georgia, "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const chars = ['G', 'A', 'M', 'E', 'N'];
        const charSpacing = 42;
        const startY = 128 - (chars.length - 1) * charSpacing / 2;
        
        // Place text in the center horizontal, stacking vertically
        chars.forEach((char, index) => {
          ctx.fillText(char, 256, startY + index * charSpacing);
        });
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    }, []);

    // Load textures inside a React useEffect to avoid blocking renders
    useEffect(() => {
      const loader = new THREE.TextureLoader();
      const maxAnisotropy = gl ? gl.capabilities.getMaxAnisotropy() : 8;

      loader.load('/luxury_wood_texture.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1.5, 1.5);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = maxAnisotropy;
        texture.needsUpdate = true;
        luxuryWoodTextureRef.current = texture;
        setLuxuryWoodTexture(texture);
      });

      loader.load('/wood-grain.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = maxAnisotropy;
        texture.needsUpdate = true;
        woodGrainTextureRef.current = texture;
        setWoodGrainTexture(texture);
      });
    }, [gl]);

    // ✅ Memoize materials to prevent recreating them on every render
    const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#5c3a21', // rich fallback brown color
      roughness: 0.35,
      metalness: 0.0,
    }), []);

    const engravedWoodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#5c3a21', // rich fallback brown color
      roughness: 0.35,
      metalness: 0.0,
    }), []);

    const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#1a100b',
      roughness: 0.95,
      metalness: 0.1,
    }), []);

    const steelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#a0a5b0',
      roughness: 0.15,
      metalness: 0.95,
    }), []);

    // Apply loaded textures to materials dynamically
    useEffect(() => {
      if (luxuryWoodTexture) {
        woodMaterial.map = luxuryWoodTexture;
        woodMaterial.color.set('#ffffff'); // reset fallback color once texture is ready
        woodMaterial.needsUpdate = true;

        engravedWoodMaterial.map = luxuryWoodTexture;
        engravedWoodMaterial.color.set('#ffffff'); // reset fallback color
        engravedWoodMaterial.needsUpdate = true;
      }
      if (woodGrainTexture) {
        woodMaterial.bumpMap = woodGrainTexture;
        woodMaterial.bumpScale = 0.02;
        woodMaterial.needsUpdate = true;
      }
    }, [luxuryWoodTexture, woodGrainTexture, woodMaterial, engravedWoodMaterial]);

    // Apply engraving texture to the engraved material
    useEffect(() => {
      if (engravingTexture) {
        engravedWoodMaterial.bumpMap = engravingTexture;
        engravedWoodMaterial.bumpScale = -0.08; // negative bump scale to deboss/engrave
        engravedWoodMaterial.needsUpdate = true;
      }
    }, [engravingTexture, engravedWoodMaterial]);

    // ✅ Memoize mathematical procedural geometries (created exactly ONCE)
    const leftWingGeometry = useMemo(() => createLeftWingGeometry(), []);
    const rightWingGeometry = useMemo(() => createRightWingGeometry(), []);
    const centerKnotGeometry = useMemo(() => createCenterKnotGeometry(), []);

    // ⚡ Memoize back magnetic snap geometries to prevent VRAM memory leaks on canvas unmount
    const backingPlateGeo = useMemo(() => new THREE.CylinderGeometry(0.32, 0.35, 0.015, 32), []);
    const outerRingGeo = useMemo(() => new THREE.CylinderGeometry(0.26, 0.28, 0.03, 32), []);
    const magnetCoreGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.18, 0.025, 32), []);
    const lockingNotchGeo = useMemo(() => new THREE.CylinderGeometry(0.07, 0.07, 0.035, 16), []);
    const lockingPinGeo = useMemo(() => new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16), []);

    // Clean up GPU assets on unmount
    useEffect(() => {
      return () => {
        woodMaterial.dispose();
        engravedWoodMaterial.dispose();
        coreMaterial.dispose();
        steelMaterial.dispose();
        leftWingGeometry.dispose();
        rightWingGeometry.dispose();
        centerKnotGeometry.dispose();
        
        // Clean up magnetic clip geometries
        backingPlateGeo.dispose();
        outerRingGeo.dispose();
        magnetCoreGeo.dispose();
        lockingNotchGeo.dispose();
        lockingPinGeo.dispose();
        
        engravingTexture.dispose();
        if (woodGrainTextureRef.current) woodGrainTextureRef.current.dispose();
        if (luxuryWoodTextureRef.current) luxuryWoodTextureRef.current.dispose();
      };
    }, [
      woodMaterial, engravedWoodMaterial, coreMaterial, steelMaterial, 
      leftWingGeometry, rightWingGeometry, centerKnotGeometry,
      backingPlateGeo, outerRingGeo, magnetCoreGeo, lockingNotchGeo, lockingPinGeo,
      engravingTexture
    ]);

    const lastProgress = useRef(0);

    useFrame(() => {
      let needsRender = false;

      if (autoRotate && localGroupRef.current) {
        localGroupRef.current.rotation.y += 0.005;
        needsRender = true;
      } else if (targetRotation && localGroupRef.current) {
        // Smoothly interpolate current rotation towards targetRotation
        const dx = targetRotation.x - localGroupRef.current.rotation.x;
        const dy = targetRotation.y - localGroupRef.current.rotation.y;
        const dz = targetRotation.z - localGroupRef.current.rotation.z;

        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001 || Math.abs(dz) > 0.0001) {
          localGroupRef.current.rotation.x += dx * 0.08;
          localGroupRef.current.rotation.y += dy * 0.08;
          localGroupRef.current.rotation.z += dz * 0.08;
          needsRender = true;
        } else {
          // Snap directly to avoid perpetual minor updates
          localGroupRef.current.rotation.x = targetRotation.x;
          localGroupRef.current.rotation.y = targetRotation.y;
          localGroupRef.current.rotation.z = targetRotation.z;
        }
      }

      // Apply explode offsets based on progress
      const progress = explodeProgressValue ? explodeProgressValue.get() : 0;
      if (progress !== lastProgress.current) {
        lastProgress.current = progress;
        needsRender = true;
      }

      const maxOffset = 1.2;
      
      // Face moves forward
      if (faceRef.current) {
        faceRef.current.position.z = progress * maxOffset;
      }
      // Back / clip moves backward
      if (backRef.current) {
        backRef.current.position.z = -progress * maxOffset;
      }
      // Core remains relatively stable or shifts slightly forward for structural layer separation
      if (coreRef.current) {
        coreRef.current.position.z = -0.03 + progress * (maxOffset * 0.3);
      }

      if (needsRender) {
        invalidate();
      }
    });

    return (
      <group ref={localGroupRef} scale={[responsiveScale, responsiveScale, responsiveScale]} dispose={null}>
        {/* FACE LAYER — Beautiful wooden wing and knot elements */}
        <group ref={faceRef} position={[0, 0, 0]}>
          {/* Left Wing */}
          <mesh geometry={leftWingGeometry} material={[woodMaterial, engravedWoodMaterial]} />
          
          {/* Right Wing */}
          <mesh geometry={rightWingGeometry} material={[woodMaterial, woodMaterial]} />
          
          {/* Center Knot */}
          <mesh geometry={centerKnotGeometry} material={woodMaterial} />
        </group>

        {/* CORE LAYER — Sleek matching inner accent plate in carbon/dark wood */}
        <group ref={coreRef} position={[0, 0, -0.03]}>
          {/* Left Wing Core */}
          <mesh 
            geometry={leftWingGeometry} 
            material={coreMaterial} 
            scale={[0.96, 0.96, 0.4]} 
            position={[0, 0, -0.01]} 
          />
          
          {/* Right Wing Core */}
          <mesh 
            geometry={rightWingGeometry} 
            material={coreMaterial} 
            scale={[0.96, 0.96, 0.4]} 
            position={[0, 0, -0.01]} 
          />
          
          {/* Center Knot Core */}
          <mesh 
            geometry={centerKnotGeometry} 
            material={coreMaterial} 
            scale={[0.96, 0.96, 0.4]} 
            position={[0, 0, -0.01]} 
          />
        </group>

        {/* BACK / CLIP LAYER — High-fidelity magnetic snap fastener assembly */}
        <group ref={backRef} position={[0, 0, -0.07]}>
          {/* Circular Steel Backing Plate */}
          <mesh geometry={backingPlateGeo} material={steelMaterial} position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]} />
          
          {/* Outer Beveled Steel Ring */}
          <mesh geometry={outerRingGeo} material={steelMaterial} position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} />
          
          {/* Inner Magnet Core Ring */}
          <mesh geometry={magnetCoreGeo} material={steelMaterial} position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]} />
          
          {/* Dark Recessed Locking Notch */}
          <mesh geometry={lockingNotchGeo} material={coreMaterial} position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]} />
          
          {/* Central Locking Steel Pin */}
          <mesh geometry={lockingPinGeo} material={steelMaterial} position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      </group>
    );
  }
);

BowTieModel.displayName = 'BowTieModel';
