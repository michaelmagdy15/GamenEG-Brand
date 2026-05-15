import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1 }}
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <ScrollProgress />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
        <Footer />
      </motion.div>
    </Router>
  );
}
