import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, MessageSquare, MapPin, Phone, Mail } from 'lucide-react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Footer settings error:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-dark text-white pt-24 pb-12 border-t border-white/5 selection:bg-primary selection:text-white">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-left">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            <img 
              src="/inverselogo.png" 
              alt="Rimpy Digital Studio" 
              className="h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105 duration-500" 
              width="120"
              height="48"
            />
            <div className="space-y-4 max-w-sm md:max-w-none">
              <p className="text-gray-400 text-sm font-serif italic leading-loose opacity-80">
                Pioneering visual excellence in Karnal since 2004. We specialize in transforming your most intimate moments into timeless artistic treasures.
              </p>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold leading-relaxed">
                Premium Photography & <br className="hidden lg:block" /> Personalized Gifting Studio
              </p>
            </div>
          </div>

          {/* Column 2: Studio Navigation */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-accent">Studio Guide</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-4 w-full md:w-auto">
              {['Home', 'Portfolio', 'Services', 'Shop', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-xs md:text-sm text-gray-400 hover:text-primary hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visit Us */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-accent">Visit Us</h3>
            <div className="space-y-6 w-full max-w-xs md:max-w-none">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-gray-400 group">
                <MapPin size={18} className="text-primary md:mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm leading-relaxed italic font-serif">
                  {settings?.address || 'Shop No 18, Near Dav Women College, Railway Road, Karnal-132001, Haryana'}
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 text-gray-400 group">
                <Phone size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm italic font-serif truncate w-full">{settings?.phone || '+91 98124 11818'}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 text-gray-400 group">
                <Mail size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm italic font-serif truncate w-full">{settings?.email || 'hello@rimpy.com'}</p>
              </div>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-accent">Follow Us</h3>
            <div className="flex gap-4 mb-10">
              {[
                { name: 'Instagram', icon: Instagram, link: settings?.instagram, color: 'hover:text-pink-500' },
                { name: 'Facebook', icon: Facebook, link: settings?.facebook, color: 'hover:text-blue-600' },
                { name: 'WhatsApp', icon: MessageSquare, link: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g,'')}` : null, color: 'hover:text-green-500' },
                { name: 'YouTube', icon: Youtube, link: settings?.youtube, color: 'hover:text-red-600' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className={`p-3 bg-surface/5 rounded-sm text-gray-400 ${social.color} hover:bg-surface/10 transition-all duration-500 hover:-translate-y-2 shadow-xl`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div className="p-6 bg-surface/5 border border-white/10 rounded-sm w-full">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">Studio Status</p>
              <p className="text-xs text-accent font-bold mt-2">Available for Bookings</p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold text-center md:text-left">
            &copy; {new Date().getFullYear()} Rimpy Digital Studio. <br className="md:hidden" /> All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
