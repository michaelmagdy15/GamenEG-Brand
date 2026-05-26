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
    // Preload images (both unboxing frames and the product image)
    let loadedCount = 0;
    const totalToLoad = FRAMES.length + 1;
    const loadedImages: HTMLImageElement[] = [];
    setImagesLoaded(false);

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        setImagesLoaded(true);
      }
    };

    // Preload the product image
    const prodImg = new Image();
    prodImg.src = productImage;
    prodImg.onload = checkAllLoaded;
    prodImg.onerror = checkAllLoaded;
    loadedImages.push(prodImg);

    // Preload unboxing frames
    FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = `/unboxing/${frame}`;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
      loadedImages.push(img);
    });

    imageRefs.current = loadedImages;
  }, [productImage]);

  useEffect(() => {
    if (!imagesLoaded) return;

    let intervalId: any;
    
    // A elegant 800ms delay to display the closed box and initial product visual
    const startTimeout = setTimeout(() => {
      let frame = 0;
      intervalId = setInterval(() => {
        if (frame < FRAMES.length - 1) {
          frame++;
          setCurrentFrame(frame);
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsUnboxed(true);
          }, 300); // slight delay before product rising
        }
      }, 60); // ~16 fps for a smooth opening
    }, 800);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [imagesLoaded]);

  const productVariants: any = {
    initial: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))',
    },
    shrinking: {
      opacity: 0,
      scale: 0.15,
      y: 80, // shrink and move into the box
      filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
      transition: {
        duration: 0.5,
        ease: [0.32, 0, 0.67, 0] as const // fast ease-in for fading/shrinking down into the box
      }
    },
    reveal: {
      opacity: 1,
      scale: 1.15, // spectacular scale-up
      y: -30, // 'y: -30px' spring rise-up as requested
      filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.95)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.55))', // gold radial drop shadow + physical dark shadow
      transition: {
        y: {
          type: 'spring',
          stiffness: 110,  // robust springiness
          damping: 11,     // subtle premium overshoot bounce
          mass: 0.75,
        },
        scale: {
          type: 'spring',
          stiffness: 110,
          damping: 11,
          mass: 0.75,
        },
        opacity: {
          duration: 0.35,
          ease: 'easeOut'
        },
        filter: {
          duration: 1.2,
          ease: 'easeOut'
        }
      }
    }
  };

  const getAnimationState = () => {
    if (isUnboxed) return "reveal";
    if (currentFrame > 0) return "shrinking";
    return "initial";
  };

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
        {imagesLoaded && (
          <motion.div
            variants={productVariants}
            initial="initial"
            animate={getAnimationState()}
            className="absolute z-10 max-w-[75%] max-h-[75%] flex items-center justify-center pointer-events-none select-none"
          >
            {/* Spectacular Radial Shimmer Glow Backdrop */}
            {isUnboxed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 0.9, 0.7, 0],
                  scale: [0.3, 1.25, 1.75, 2.2],
                }}
                transition={{
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15,
                }}
                className="absolute w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.8)_0%,rgba(212,175,55,0.2)_45%,transparent_70%)] blur-2xl z-0"
              />
            )}

            {/* Image container holds the sweep shimmer sheen */}
            <div className="relative overflow-hidden rounded-2xl flex items-center justify-center p-2">
              <img
                src={productImage}
                alt={productName}
                className="max-w-full max-h-[280px] lg:max-h-[320px] object-contain z-10"
              />

              {/* Shimmer Sweep Sheen Flash */}
              {isUnboxed && (
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={{
                    x: '150%',
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.2, 0.7, 1],
                    delay: 0.2,
                  }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 z-20 pointer-events-none"
                />
              )}
            </div>
          </motion.div>
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
