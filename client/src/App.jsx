import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import MobileNav from './components/Layout/MobileNav';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';
import Footer from './components/Layout/Footer';
import CookieConsent from './components/Layout/CookieConsent';
import api from './utils/api';

import Home from './pages/Home';
// Lazy load pages
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Shop = lazy(() => import('./pages/Shop'));
const ShopCategory = lazy(() => import('./pages/ShopCategory'));
const ShopDetail = lazy(() => import('./pages/ShopDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Login = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // We don't want to show the footer on the 404 page or Admin pages
  const isSpecialPage = isAdminPage || location.pathname === '/404';

  useEffect(() => {
    const hexToRgb = (hex) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return `${r} ${g} ${b}`;
    };

    // 1. Instantly apply from localStorage to prevent FOUC
    const savedTheme = localStorage.getItem('rimpyTheme');
    if (savedTheme) {
      const colors = JSON.parse(savedTheme);
      const root = document.documentElement;
      if(colors.primary) root.style.setProperty('--color-primary', hexToRgb(colors.primary));
      if(colors.secondary) root.style.setProperty('--color-secondary', hexToRgb(colors.secondary));
      if(colors.accent) root.style.setProperty('--color-accent', hexToRgb(colors.accent));
      if(colors.dark) root.style.setProperty('--color-dark', hexToRgb(colors.dark));
      if(colors['text-main']) root.style.setProperty('--color-text-main', hexToRgb(colors['text-main']));
      if(colors['text-light']) root.style.setProperty('--color-text-light', hexToRgb(colors['text-light']));
      if(colors.surface) root.style.setProperty('--color-surface', hexToRgb(colors.surface));
      if(colors['surface-hover']) root.style.setProperty('--color-surface-hover', hexToRgb(colors['surface-hover']));
      if(colors.border) root.style.setProperty('--color-border', hexToRgb(colors.border));
    }

    // 2. Fetch fresh from DB
    const fetchTheme = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data && res.data.themeColors) {
          const colors = res.data.themeColors;
          localStorage.setItem('rimpyTheme', JSON.stringify(colors));
          const root = document.documentElement;
          if(colors.primary) root.style.setProperty('--color-primary', hexToRgb(colors.primary));
          if(colors.secondary) root.style.setProperty('--color-secondary', hexToRgb(colors.secondary));
          if(colors.accent) root.style.setProperty('--color-accent', hexToRgb(colors.accent));
          if(colors.dark) root.style.setProperty('--color-dark', hexToRgb(colors.dark));
          if(colors['text-main']) root.style.setProperty('--color-text-main', hexToRgb(colors['text-main']));
          if(colors['text-light']) root.style.setProperty('--color-text-light', hexToRgb(colors['text-light']));
          if(colors.surface) root.style.setProperty('--color-surface', hexToRgb(colors.surface));
          if(colors['surface-hover']) root.style.setProperty('--color-surface-hover', hexToRgb(colors['surface-hover']));
          if(colors.border) root.style.setProperty('--color-border', hexToRgb(colors.border));
        }
      } catch (err) {
        console.error('Failed to load theme settings:', err);
      }
    };
    fetchTheme();
  }, []);

  // Dynamic Title & SEO tags update on route change
  useEffect(() => {
    const titles = {
      '/home': 'Rimpy Gifts Studio | Custom Gifts & Photo Services in Karnal',
      '/about': 'About Us | Rimpy Gifts Studio Karnal',
      '/services': 'Services & Photography | Rimpy Gifts Studio',
      '/portfolio': 'Portfolio & Gallery | Rimpy Gifts Studio',
      '/shop': 'Shop Custom Gifts | Rimpy Gifts Studio',
      '/shop/products': 'Bespoke Products | Rimpy Gifts Studio',
      '/contact': 'Contact & Visit Us | Rimpy Gifts Studio Karnal',
      '/privacy': 'Privacy Policy | Rimpy Gifts Studio',
      '/terms': 'Terms & Conditions | Rimpy Gifts Studio',
      '/admin': 'Admin Portal | Rimpy Gifts Studio'
    };

    const descriptions = {
      '/home': 'Rimpy Gifts Studio - Karnal\'s trusted gift shop and studio with 22+ years of experience. Specializing in resin preservation, custom photo frames, bespoke hampers, and professional photography near DAV Women College.',
      '/about': 'Learn about Rimpy Gifts Studio, our 22+ year history of excellence in Karnal, and our commitment to premium custom gifting and photo services.',
      '/services': 'Explore our wide range of services including weddings, maternity, event photography, passport photos, and bespoke custom framing.',
      '/portfolio': 'Browse our portfolio of beautiful memories, custom resin preservation projects, personalized albums, and photography showcases.',
      '/shop': 'Discover premium personalized gifts, custom collages, high-end frames, and custom hampers at Rimpy Gifts Studio in Karnal.',
      '/shop/products': 'Order bespoke custom gifts, photo frames, resin preservation art, and custom hampers online.',
      '/contact': 'Find our address (Shop No 18, Railway Road, Karnal), phone number, email, and business hours to visit Rimpy Gifts Studio.',
    };

    const currentPath = location.pathname;
    let title = titles[currentPath] || 'Rimpy Gifts Studio | Custom Gifts & Photo Services';
    let description = descriptions[currentPath] || 'Karnal\'s trusted gift shop and studio with 22+ years of experience.';

    if (currentPath.startsWith('/shop/')) {
      title = 'Product Details | Rimpy Gifts Studio';
      description = 'View premium custom gift details and customization options at Rimpy Gifts Studio.';
    }

    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [location.pathname]);

  return (
    <div className="app bg-secondary min-h-screen selection:bg-primary selection:text-white pb-[72px] md:pb-0 relative">
      <ScrollToTop />
      {!isAdminPage && location.pathname !== '*' && <Navbar />}
      
      <main>
        <Suspense fallback={<PageLoader visible={true} message="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/shop" element={<ShopCategory />} />
            <Route path="/shop/products" element={<Shop />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
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
      {!isAdminPage && <MobileNav />}
      <CookieConsent />
    </div>
  );
}

export default App;
