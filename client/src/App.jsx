import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';
import Footer from './components/Layout/Footer';

import Home from './pages/Home';
// Lazy load pages
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Shop = lazy(() => import('./pages/Shop'));
const ShopDetail = lazy(() => import('./pages/ShopDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Login = lazy(() => import('./pages/Admin/Login'));
const Register = lazy(() => import('./pages/Admin/Register'));
const ForgotPassword = lazy(() => import('./pages/Admin/ForgotPassword'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // We don't want to show the footer on the 404 page or Admin pages
  const isSpecialPage = isAdminPage || location.pathname === '/404';

  return (
    <div className="app bg-secondary min-h-screen selection:bg-primary selection:text-white">
      <ScrollToTop />
      {!isAdminPage && location.pathname !== '*' && <Navbar />}
      
      <main>
        <Suspense fallback={<PageLoader visible={true} message="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
  
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isSpecialPage && <Footer />}
    </div>
  );
}

export default App;
