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

const SPARKLES = [
  { x: -110, y: -90, delay: 0.25, size: 14, rotate: 15 },
  { x: 120, y: -70, delay: 0.35, size: 10, rotate: 45 },
  { x: -130, y: 40, delay: 0.15, size: 12, rotate: -25 },
  { x: 100, y: 90, delay: 0.45, size: 8, rotate: 35 },
  { x: -50, y: -140, delay: 0.3, size: 16, rotate: 10 },
  { x: 60, y: 120, delay: 0.4, size: 10, rotate: -15 },
  { x: -140, y: -30, delay: 0.2, size: 8, rotate: 50 },
  { x: 140, y: 10, delay: 0.5, size: 12, rotate: -40 },
];

function SparkleIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))' }}
      className="pointer-events-none"
    >
      <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
    </svg>
  );
}

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
    if (!imagesLoaded) {
      setCurrentFrame(0);
      setIsUnboxed(false);
      return;
    }

    // Explicitly guarantee starting fully closed (frame 0) and not unboxed
    setCurrentFrame(0);
    setIsUnboxed(false);

    let intervalId: any;
    
    // Perfect time sequence parameters:
    // 1. A 600ms initial closed box delay to display the closed luxury box
    const startTimeout = setTimeout(() => {
      let frame = 0;
      
      // 2. 800ms smooth frame cycle opening
      const totalDuration = 800;
      const frameTransitions = FRAMES.length - 1;
      const intervalDuration = totalDuration / frameTransitions; // ~53.33ms per frame
      
      intervalId = setInterval(() => {
        if (frame < FRAMES.length - 1) {
          frame++;
          setCurrentFrame(frame);
        } else {
          clearInterval(intervalId);
          
          // 3. A 300ms deliberate pause at fully opened box state before product emergence
          setTimeout(() => {
            setIsUnboxed(true);
          }, 300);
        }
      }, intervalDuration);
    }, 600);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [imagesLoaded]);

  const productVariants: any = {
    initial: {
      opacity: 0,
      scale: 0.1,
      y: 120, // start hidden deep inside the box
      filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
    },
    shrinking: {
      opacity: 0,
      scale: 0.1,
      y: 120,
      filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
    },
    reveal: {
      opacity: 1,
      scale: 1.0, // Fits perfectly on mobile screens
      y: -30, // Rises elegantly above the open box without overflowing or overlapping navigation
      filter: 'drop-shadow(0 4px 12px rgba(43, 20, 12, 0.3)) drop-shadow(0 0 25px rgba(215, 185, 115, 0.75)) drop-shadow(0 10px 25px rgba(43, 20, 12, 0.2))', // luxury gold glow backdrop
      transition: {
        y: {
          type: 'spring',
          stiffness: 120,
          damping: 15,
          mass: 0.65,
        },
        scale: {
          type: 'spring',
          stiffness: 130,
          damping: 17,
          mass: 0.7,
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
            {/* Spectacular Multi-Layered Radial Shimmer Glow Backdrop */}
            {isUnboxed && (
              <>
                {/* Elegant, deep breathing gold background glow that stays */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.3, 0.65, 0.3],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    default: { duration: 1.2, ease: "easeOut" }
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(215, 185, 115, 0.35) 0%, rgba(215, 185, 115, 0.1) 50%, transparent 70%)',
                    filter: 'blur(35px)',
                  }}
                  className="absolute w-40 h-40 lg:w-[340px] lg:h-[340px] rounded-full z-0 pointer-events-none"
                />

                {/* Instant high-energy golden flash expansion */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.2, 2.4],
                  }}
                  transition={{
                    duration: 1.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 236, 179, 0.85) 0%, rgba(215, 185, 115, 0.3) 45%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  className="absolute w-32 h-32 lg:w-[300px] lg:h-[300px] rounded-full z-0 pointer-events-none"
                />

                {/* Concentric Luxury Ring Halos rotating in opposite directions */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.25, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="absolute w-36 h-36 lg:w-80 lg:h-80 rounded-full border border-dashed border-champagne-gold/25 z-0 pointer-events-none animate-slow-spin"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.15, scale: 0.85 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  className="absolute w-36 h-36 lg:w-80 lg:h-80 rounded-full border border-double border-champagne-gold/20 z-0 pointer-events-none animate-slow-spin-reverse"
                />

                {/* Magical Sparkle Burst */}
                {SPARKLES.map((sparkle, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                    animate={{
                      x: sparkle.x,
                      y: sparkle.y,
                      scale: [0, 1.25, 0.85, 0],
                      opacity: [0, 1, 1, 0],
                      rotate: sparkle.rotate + 180,
                    }}
                    transition={{
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: sparkle.delay,
                    }}
                    className="absolute z-30 pointer-events-none"
                  >
                    <SparkleIcon size={sparkle.size} color={idx % 2 === 0 ? '#f5e6c8' : '#e5c158'} />
                  </motion.div>
                ))}
              </>
            )}

            {/* Inner Floating wrapper for gentle weightless suspension */}
            <motion.div
              animate={isUnboxed ? {
                y: [-4, 4, -4],
              } : {}}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative flex items-center justify-center p-2"
            >
              {/* Image container holds the sweep shimmer sheen */}
              <div className="relative overflow-hidden rounded-2xl flex items-center justify-center p-2">
                <img
                  src={productImage}
                  alt={productName}
                  className="max-w-full max-h-[280px] lg:max-h-[320px] object-contain z-10"
                />

                {/* Double Shimmer Sweep Sheen Flash */}
                {isUnboxed && (
                  <>
                    {/* Primary intense white-gold reflection sweep */}
                    <motion.div
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={{
                        x: '150%',
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.2, 0.8, 1],
                        delay: 0.3,
                      }}
                      style={{
                        background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.75) 45%, rgba(255, 244, 215, 0.95) 50%, rgba(255, 255, 255, 0.75) 55%, rgba(255, 255, 255, 0) 70%, transparent 80%)'
                      }}
                      className="absolute inset-y-0 w-full -skew-x-20 z-20 pointer-events-none"
                    />

                    {/* Secondary subtle champagne-gold follow-up reflection sweep */}
                    <motion.div
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={{
                        x: '150%',
                        opacity: [0, 0.8, 0.8, 0],
                      }}
                      transition={{
                        duration: 1.1,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.15, 0.85, 1],
                        delay: 0.75,
                      }}
                      style={{
                        background: 'linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0) 40%, rgba(207, 197, 178, 0.55) 50%, rgba(255, 255, 255, 0) 60%, transparent 70%)'
                      }}
                      className="absolute inset-y-0 w-full -skew-x-20 z-20 pointer-events-none"
                    />
                  </>
                )}
              </div>
            </motion.div>
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
