/**
 * OptimizedCanvas — a thin wrapper around @react-three/fiber Canvas that:
 *  1. Pauses the WebGL render loop when the element is not visible (IntersectionObserver)
 *  2. Caps DPR at 1.5 (enough for retina without burning GPU on 3× displays)
 *  3. Applies performance-friendly WebGL context attributes
 *  4. Uses frameloop="demand" by default so renders only fire when invalidate() is called
 */
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';

interface OptimizedCanvasProps extends Omit<CanvasProps, 'frameloop'> {
  children: ReactNode;
  className?: string;
  /** Override — set to "always" only for scenes with continuous animation */
  frameloop?: 'demand' | 'always' | 'never';
}

export default function OptimizedCanvas({
  children,
  className,
  frameloop = 'demand',
  camera,
  ...rest
}: OptimizedCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Only mount/activate the WebGL context when the canvas enters the viewport range
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { 
        rootMargin: '200px 0px', // Pre-mount 200px before entering viewport to prevent flashing/jank
        threshold: 0.01 
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
      role="img"
      aria-label="Interactive 3D model of GAMÉN luxury design. You can interact with or rotate the visual model."
    >
      {active && (
        <Canvas
          camera={camera}
          frameloop={frameloop}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,          // MSAA off — saves ~30% GPU fill rate
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,            // We never use stencil buffer
            depth: true,
            preserveDrawingBuffer: false,
          }}
          performance={{ min: 0.5 }}   // R3F adaptive performance: drop to 50% DPR under load
          {...rest}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}
