import HeroSection from '../components/HeroSection';
import AtelierExperience from '../components/AtelierExperience';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import DetailsSection from '../components/DetailsSection';
import HeritageSection from '../components/HeritageSection';
import SignatureUnboxing from '../components/SignatureUnboxing';
import RitualSection from '../components/RitualSection';
import HowToWear from '../components/HowToWear';
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
      <SignatureUnboxing />
      <RitualSection />
      <HowToWear />
      <AcquisitionSection />
    </main>
  );
}
