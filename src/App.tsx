if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CustomCursor from './components/CustomCursor';
import BackToTop from './components/BackToTop';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import Craftsmanship from './pages/Craftsmanship';
import CareInstructions from './pages/CareInstructions';
import ShippingReturns from './pages/ShippingReturns';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  // Admin pages: no navbar/footer/cursor
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {loading && !isAdminPage && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <ScrollToTop />

      {isAdminPage ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      ) : (
        <motion.div
          className="relative"
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.98 }}
          animate={{
            opacity: loading ? 0 : 1,
            filter: loading ? 'blur(12px)' : 'blur(0px)',
            scale: loading ? 0.98 : 1,
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ pointerEvents: loading ? 'none' : 'auto' }}
        >
          <ScrollProgress />
          <Navbar />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/craftsmanship" element={<Craftsmanship />} />
            <Route path="/care" element={<CareInstructions />} />
            <Route path="/shipping" element={<ShippingReturns />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
          <Footer />
          <BackToTop />
        </motion.div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminAuthProvider>
    </Router>
  );
}
