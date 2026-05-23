import HeroSection from '../components/HeroSection';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import AnatomySection from '../components/AnatomySection';
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
        <CollectionsSection />
        <AnatomySection />
        <MarqueeTicker variant="dark" speed="normal" />
        <HeritageSection />
        {/* <RitualSection /> */}{/* hidden — re-enable in a future version */}
        <HowToWear />
        <AcquisitionSection />
      </div>
    </main>
  );
}
