import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('rimpyCookieConsent');
    
    // Don't show if on admin routes
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (!consent && !isAdminRoute) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500); // 1.5 second delay for a smooth entry
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    localStorage.setItem('rimpyCookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('rimpyCookieConsent', 'declined');
    setShowBanner(false);
  };

  // Do not render on admin paths
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <m.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-8 z-[9999] max-w-md w-[calc(100%-3rem)] md:w-[400px] glass-panel rounded-sm border border-border-surface p-6 shadow-2xl flex flex-col gap-4 text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Cookie size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif tracking-widest text-main uppercase text-sm font-semibold">
                  Cookie Settings
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Privacy Consent</span>
              </div>
            </div>
            <button 
              onClick={handleDecline} 
              className="text-gray-400 hover:text-main transition-colors p-1"
              aria-label="Close privacy notice"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <p className="text-xs text-text-light leading-relaxed font-sans">
            We use cookies to optimize website performance, analyze traffic patterns, and personalize your experience. By clicking <span className="font-semibold text-main">"Accept All"</span>, you consent to our use of these technologies. You can view our details in our{' '}
            <Link to="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleDecline}
              className="flex-1 py-2 px-4 border border-dark/20 text-dark uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:border-dark hover:bg-dark/5 rounded-sm text-center"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-4 bg-primary text-white uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:bg-dark hover:text-white rounded-sm text-center shadow-sm"
            >
              Accept All
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
