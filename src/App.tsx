/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import OriginSection from './components/OriginSection';
import CollectionsSection from './components/CollectionsSection';
import DetailsSection from './components/DetailsSection';
import HeritageSection from './components/HeritageSection';
import RitualSection from './components/RitualSection';
import AcquisitionSection from './components/AcquisitionSection';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <OriginSection />
            <CollectionsSection />
            <DetailsSection />
            <HeritageSection />
            <RitualSection />
            <AcquisitionSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
