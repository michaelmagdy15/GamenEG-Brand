import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';

export default function CinematicEffects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom 
        intensity={1.2} 
        luminanceThreshold={0.8} 
        luminanceSmoothing={0.9} 
        mipmapBlur={false}
        resolutionScale={0.5}
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
