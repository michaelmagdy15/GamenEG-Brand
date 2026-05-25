import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const FRAMES = [
  'gamenbox_000000_0015_Layer-1.png',
  'gamenbox_000000_0014_gamenbox_000001.png',
  'gamenbox_000000_0013_gamenbox_000002.png',
  'gamenbox_000000_0012_gamenbox_000003.png',
  'gamenbox_000000_0011_gamenbox_000004.png',
  'gamenbox_000000_0010_gamenbox_000005.png',
  'gamenbox_000000_0009_gamenbox_000006.png',
  'gamenbox_000000_0008_gamenbox_000007.png',
  'gamenbox_000000_0007_gamenbox_000008.png',
  'gamenbox_000000_0006_gamenbox_000009.png',
  'gamenbox_000000_0005_gamenbox_000010.png',
  'gamenbox_000000_0004_gamenbox_000011.png',
  'gamenbox_000000_0003_gamenbox_000012.png',
  'gamenbox_000000_0002_gamenbox_000013.png',
  'gamenbox_000000_0001_gamenbox_000014.png',
  'gamenbox_000000_0000_gamenbox_000015.png'
];

interface UnboxingExperienceProps {
  productImage: string;
  productName: string;
}

export default function UnboxingExperience({ productImage, productName }: UnboxingExperienceProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = `/unboxing/${frame}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAMES.length) {
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    });
    imageRefs.current = loadedImages;
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    let frame = 0;
    const interval = setInterval(() => {
      if (frame < FRAMES.length - 1) {
        frame++;
        setCurrentFrame(frame);
      } else {
        clearInterval(interval);
        setTimeout(() => {
            setIsUnboxed(true);
        }, 200); // slight delay before product rising
      }
    }, 60); // ~16 fps for a smooth opening

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Box Sequence */}
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        {imagesLoaded ? (
          <img
            src={`/unboxing/${FRAMES[currentFrame]}`}
            alt="Unboxing sequence"
            style={{
              filter: isUnboxed 
                ? 'blur(12px) drop-shadow(0 0 2.5px rgba(26, 16, 11, 0.95)) drop-shadow(0 12px 36px rgba(0, 0, 0, 0.6))' 
                : 'drop-shadow(0 0 2.5px rgba(26, 16, 11, 0.95)) drop-shadow(0 12px 36px rgba(0, 0, 0, 0.6))'
            }}
            className={`w-full h-full object-contain transition-all duration-1000 ${
              isUnboxed ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
            }`}
          />
        ) : (
          <div className="w-10 h-10 border-t-2 border-champagne-gold border-solid rounded-full animate-spin"></div>
        )}

        {/* Product emerging from the box */}
        {isUnboxed && (
          <motion.img
            initial={{ opacity: 0, y: 150, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            src={productImage}
            alt={productName}
            className="absolute z-10 max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
          />
        )}
      </div>

      <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {FRAMES.map((frame) => (
          <img key={frame} src={`/unboxing/${frame}`} alt="preload" />
        ))}
      </div>
    </div>
  );
}
