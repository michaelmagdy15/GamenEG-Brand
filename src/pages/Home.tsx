import HeroSection from '../components/HeroSection';
import AtelierExperience from '../components/AtelierExperience';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import DetailsSection from '../components/DetailsSection';
import HeritageSection from '../components/HeritageSection';
import RitualSection from '../components/RitualSection';
import AcquisitionSection from '../components/AcquisitionSection';
import MarqueeTicker from '../components/MarqueeTicker';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeTicker variant="dark" speed="normal" />
      <AtelierExperience />
      <OriginSection />
      <MarqueeTicker
        variant="light"
        speed="slow"
        text="SÉLECTIONNÉ À LA MAIN  ·  SCULPTÉ AVEC INTENTION  ·  POLI JUSQU'À LA PERFECTION  ·  "
      />
      <CollectionsSection />
      <DetailsSection />
      <MarqueeTicker variant="dark" speed="normal" />
      <HeritageSection />
      <RitualSection />
      <AcquisitionSection />
    </main>
  );
}
