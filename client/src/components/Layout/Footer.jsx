import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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
              alt="Rimpy Gifts Studio" 
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
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-gray-300">Studio Guide</h3>
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
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-gray-300">Visit Us</h3>
            <div className="space-y-6 w-full max-w-xs md:max-w-none">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-gray-400 group">
                <MapPin size={18} className="text-primary md:mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="https://www.google.com/maps?cid=9837681666753068686&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAFKgSoqNcy" target="_blank" rel="noopener noreferrer" className="text-sm leading-relaxed italic font-serif hover:text-white transition-colors">
                  {settings?.address || 'Shop No 18, Near Dav Women College, Railway Road, Karnal-132001, Haryana'}
                </a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 text-gray-400 group">
                <Phone size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <a href={`tel:${settings?.phone?.replace(/\D/g, '') || '+919812411818'}`} className="text-sm font-sans font-medium tracking-wide truncate w-full hover:text-white transition-colors">{settings?.phone || '+91 98124 11818'}</a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 text-gray-400 group">
                <Mail size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <a href={`mailto:${settings?.email || 'hello@rimpy.com'}`} className="text-sm italic font-serif truncate w-full hover:text-white transition-colors">{settings?.email || 'hello@rimpy.com'}</a>
              </div>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 font-bold text-gray-300">Follow Us</h3>
            <div className="flex gap-4 mb-10">
              {[
                { name: 'Instagram', icon: Instagram, link: settings?.instagram, color: 'hover:text-pink-500' },
                { name: 'Facebook', icon: Facebook, link: settings?.facebook, color: 'hover:text-blue-600' },
                { name: 'WhatsApp', icon: WhatsAppIcon, link: settings?.whatsapp?.includes('http') ? settings.whatsapp : (settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null), color: 'hover:text-green-500' },
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
            &copy; {new Date().getFullYear()} Rimpy Gifts Studio. <br className="md:hidden" /> All Rights Reserved.
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
