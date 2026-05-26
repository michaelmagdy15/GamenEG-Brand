import HeroSection from '../components/HeroSection';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import HeritageSection from '../components/HeritageSection';
import RitualSection from '../components/RitualSection';
import HowToWear from '../components/HowToWear';
import AtelierExperience from '../components/AtelierExperience';
import AcquisitionSection from '../components/AcquisitionSection';
import MarqueeTicker from '../components/MarqueeTicker';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="relative z-20 bg-deep-walnut">
        <MarqueeTicker variant="dark" speed="normal" />
        {/* <OriginSection /> */}
        {/* <MarqueeTicker variant="light" speed="slow" /> */}
        <AtelierExperience />
        {/* Smooth transition from AtelierExperience (deep-walnut) to CollectionsSection (espresso) */}
        <div className="relative bg-gradient-to-b from-deep-walnut to-espresso pt-20 pb-8 flex flex-col items-center justify-center">
          <span className="font-accent text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-champagne-gold/60 font-bold select-none animate-pulse">
            DRAG TO VIEW MORE TO THE RIGHT →
          </span>
          <div className="h-px w-20 bg-champagne-gold/15 mt-4" />
        </div>
        <CollectionsSection />
        {/* Smooth transition back from CollectionsSection (espresso) to deep-walnut */}
        <div className="h-20 bg-gradient-to-b from-espresso to-deep-walnut" />
        <MarqueeTicker variant="dark" speed="normal" />
        <HeritageSection />
        {/* <RitualSection /> */}{/* hidden — re-enable in a future version */}
        <HowToWear />
        <AcquisitionSection />
      </div>
    </main>
  );
}
