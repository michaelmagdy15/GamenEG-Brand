import { motion } from 'motion/react';

export default function HeroScene() {
  return (
    <div className="relative w-full h-full max-w-[280px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[560px] aspect-square flex items-center justify-center pointer-events-auto">
      {/* Premium ambient gold glow behind the bow tie */}
      <div className="absolute w-[75%] h-[75%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_65%)] blur-2xl pointer-events-none" />

      {/* Floating bow tie image */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <img
          src="/Images/bowtie 3d spin/BOWSPIN.gif"
          alt="GΛMÉN Luxury Wooden Bow Tie"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter contrast-125 saturate-105"
          style={{ imageRendering: 'auto', clipPath: 'inset(0% 3% 0% 3%)' }}
        />
      </motion.div>
    </div>
  );
}

