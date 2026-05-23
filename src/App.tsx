if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProductsProvider } from './context/ProductsContext';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CustomCursor from './components/CustomCursor';
import BackToTop from './components/BackToTop';
import AdminRoute from './components/AdminRoute';

/* ─── Lazy-loaded pages — only fetched when the user navigates to them ── */
const Home             = lazy(() => import('./pages/Home'));
const Shop             = lazy(() => import('./pages/Shop'));
const ProductDetail    = lazy(() => import('./pages/ProductDetail'));
const OurStory         = lazy(() => import('./pages/OurStory'));
const Contact          = lazy(() => import('./pages/Contact'));
const Craftsmanship    = lazy(() => import('./pages/Craftsmanship'));
const CareInstructions = lazy(() => import('./pages/CareInstructions'));
const ShippingReturns  = lazy(() => import('./pages/ShippingReturns'));
const Checkout         = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

/* Admin pages — also lazy */
const AdminLogin     = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

/* Minimal inline fallback — matches the dark background so no flash */
function PageFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#462718',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid #cfc5b2',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {loading && !isAdminPage && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <ScrollToTop />

      {isAdminPage ? (
        <Suspense fallback={<PageFallback />}>
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
            {/* Catch-all admin routes */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      ) : (
        <>
          <ScrollProgress />
          <Navbar />
          <CartDrawer />
          <BackToTop />
          <motion.div
            className="relative"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{
              opacity: loading ? 0 : 1,
              filter: loading ? 'blur(12px)' : 'blur(0px)',
            }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ pointerEvents: loading ? 'none' : 'auto' }}
          >
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/"                  element={<Home />} />
                <Route path="/shop"              element={<Shop />} />
                <Route path="/product/:slug"     element={<ProductDetail />} />
                <Route path="/our-story"         element={<OurStory />} />
                <Route path="/contact"           element={<Contact />} />
                <Route path="/craftsmanship"     element={<Craftsmanship />} />
                <Route path="/care"              element={<CareInstructions />} />
                <Route path="/shipping"          element={<ShippingReturns />} />
                <Route path="/checkout"          element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                {/* Catch-all global routes */}
                <Route path="*"                  element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Footer />
          </motion.div>
        </>
      )}
    </>
  );
}



export default function App() {
  return (
    <Router>
      <ProductsProvider>
        <AdminAuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AdminAuthProvider>
      </ProductsProvider>
    </Router>
  );
}
