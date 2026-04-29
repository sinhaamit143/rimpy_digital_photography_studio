import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';

import Footer from './components/Layout/Footer';

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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/shop" element={<Shop />} />
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
      </main>

      {!isSpecialPage && <Footer />}
    </div>
  );
}

export default App;
