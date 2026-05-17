import HeroSection from '../components/HeroSection';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import AnatomySection from '../components/AnatomySection';
import DetailsSection from '../components/DetailsSection';
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
      <MarqueeTicker variant="dark" speed="normal" />
      <OriginSection />
      <MarqueeTicker
        variant="light"
        speed="slow"
        text="SÉLECTIONNÉ À LA MAIN  ·  SCULPTÉ AVEC INTENTION  ·  POLI JUSQU'À LA PERFECTION  ·  "
      />
      <CollectionsSection />
      <AnatomySection />
      <DetailsSection />
      <MarqueeTicker variant="dark" speed="normal" />
      <HeritageSection />
      <RitualSection />
      <HowToWear />
      <AtelierExperience />
      <AcquisitionSection />
    </main>
  );
}
