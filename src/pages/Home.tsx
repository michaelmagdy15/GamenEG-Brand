import HeroSection from '../components/HeroSection';
import AtelierExperience from '../components/AtelierExperience';
import OriginSection from '../components/OriginSection';
import CollectionsSection from '../components/CollectionsSection';
import DetailsSection from '../components/DetailsSection';
import HeritageSection from '../components/HeritageSection';
import RitualSection from '../components/RitualSection';
import AcquisitionSection from '../components/AcquisitionSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AtelierExperience />
      <OriginSection />
      <CollectionsSection />
      <DetailsSection />
      <HeritageSection />
      <RitualSection />
      <AcquisitionSection />
    </main>
  );
}
