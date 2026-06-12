import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Youtube, ChevronDown, Globe } from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    countryFlag: '🇮🇳',
    phone: '',
    message: '',
    consentGiven: false
  });

  const countryCodes = [
    { code: '+91', flag: '🇮🇳', name: 'IN' },
    { code: '+1', flag: '🇺🇸', name: 'US' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+971', flag: '🇦🇪', name: 'AE' },
    { code: '+61', flag: '🇦🇺', name: 'AU' },
    { code: '+1', flag: '🇨🇦', name: 'CA' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Settings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`
      };
      await api.post('/contact', payload);
      setSubmitted(true);
      setFormData({ name: '', email: '', countryCode: '+91', countryFlag: '🇮🇳', phone: '', message: '', consentGiven: false });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageLoader message="Opening our Doors..." visible={true} />;

  return (
    <div className="pt-28 md:pt-48 pb-20 md:pb-32 bg-surface min-h-screen selection:bg-primary selection:text-white">
      <div className="container px-6 md:px-8">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-16 md:mb-32">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block italic text-center md:text-left">Let's Connect</span>
            <h1 className="text-4xl md:text-8xl font-serif leading-none text-main italic mb-6 md:mb-8 text-center md:text-left">Get In <span className="not-italic text-primary">Touch</span></h1>
            <p className="text-gray-500 font-serif italic text-base md:text-xl max-w-xl leading-relaxed text-center md:text-left mx-auto md:mx-0">
              Whether it's a grand wedding or a personalized gift, we are here to turn your vision into a masterpiece.
            </p>
          </m.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-24">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/10 p-6 md:p-16 rounded-sm border border-surface shadow-sm"
            >
              {submitted ? (
                <div className="text-center py-10 md:py-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Send className="text-primary" size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif italic mb-4">Message Received</h3>
                  <p className="text-gray-500 uppercase tracking-widest text-[9px] md:text-[10px] font-bold">Our studio representative will reach out shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 md:mt-10 text-primary font-bold uppercase tracking-widest text-[10px] border-b border-primary pb-1">Send another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-2 relative">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-transparent border-b border-gray-200 py-2 md:py-3 outline-none focus:border-primary transition-all font-serif italic text-base md:text-lg text-gray-500" 
                        placeholder="e.g. Rahul Sharma"
                        required 
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        className="w-full bg-transparent border-b border-gray-200 py-2 md:py-3 outline-none focus:border-primary transition-all font-serif italic text-base md:text-lg text-gray-500" 
                        placeholder="rahul@example.com"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Phone Number</label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      {/* Custom Country Selector */}
                      <div className="relative w-full sm:w-36 shrink-0" ref={dropdownRef}>
                        <div 
                          onClick={() => setShowCountryMenu(!showCountryMenu)}
                          className="flex items-center justify-between border-b border-gray-200 py-2 md:py-3 cursor-pointer group transition-all"
                        >
                          <span className="font-serif italic text-base md:text-lg text-gray-500 flex items-center gap-3">
                            <span className="not-italic">{formData.countryFlag}</span>
                            <span>{formData.countryCode}</span>
                          </span>
                          <ChevronDown size={14} className={`text-gray-300 transition-transform duration-300 ${showCountryMenu ? 'rotate-180 text-primary' : ''}`} />
                        </div>
                        
                        <AnimatePresence>
                          {showCountryMenu && (
                            <m.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 top-full mt-2 w-full bg-surface shadow-2xl border border-surface rounded-sm z-50 overflow-hidden backdrop-blur-xl"
                            >
                              <div className="max-h-60 overflow-y-auto no-scrollbar">
                                {countryCodes.map((c) => (
                                  <div 
                                    key={c.name + c.code}
                                    onClick={() => {
                                      setFormData({...formData, countryCode: c.code, countryFlag: c.flag});
                                      setShowCountryMenu(false);
                                    }}
                                    className="px-4 py-3 hover:bg-secondary/50 flex items-center justify-between transition-colors cursor-pointer group"
                                  >
                                    <span className="font-serif italic text-sm text-gray-500 group-hover:text-primary">
                                      <span className="not-italic mr-3">{c.flag}</span> {c.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-primary">{c.code}</span>
                                  </div>
                                ))}
                              </div>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        className="flex-1 bg-transparent border-b border-gray-200 py-2 md:py-3 outline-none focus:border-primary transition-all font-serif italic text-base md:text-lg tracking-[0.2em] text-gray-500" 
                        placeholder="00000 00000"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Your Inquiry</label>
                    <textarea 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      className="w-full bg-transparent border-b border-gray-200 py-2 md:py-3 outline-none focus:border-primary transition-all font-serif italic text-base md:text-lg min-h-[100px] md:min-h-[120px] resize-none text-gray-500" 
                      placeholder="Tell us about your project or gift requirement..."
                      required 
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="contact-consent"
                      checked={formData.consentGiven}
                      onChange={e => setFormData({...formData, consentGiven: e.target.checked})}
                      className="mt-1 w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer"
                      required
                    />
                    <label htmlFor="contact-consent" className="text-xs text-gray-500 leading-relaxed cursor-pointer selection:bg-transparent">
                      I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline">Terms &amp; Conditions</a> and consent to the collection and processing of my contact details in accordance with the <a href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>. *
                    </label>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="group relative w-full md:w-auto px-12 md:px-16 py-4 md:py-5 bg-dark text-white uppercase tracking-[0.4em] text-[9px] md:text-[10px] font-bold overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send size={14} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </form>
              )}
            </m.div>
          </div>

          {/* Right: Studio Info */}
          <div className="lg:col-span-5 space-y-10 md:space-y-16 order-1 lg:order-2">
            <m.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8 md:space-y-12"
            >
              {/* Info Cards */}
              <div className="space-y-8 md:space-y-10">
                <div className="flex gap-6 md:gap-8 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary flex items-center justify-center rounded-full shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400">Visit Our Studio</h4>
                    <p className="text-main font-serif italic text-base md:text-lg leading-relaxed">{settings?.address || 'Shop No 18, Near Dav Women College, Railway Road, Karnal-132001, Haryana'}</p>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary flex items-center justify-center rounded-full shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400">Direct Contact</h4>
                    <p className="text-main font-sans font-medium tracking-wide text-sm md:text-base leading-relaxed">{settings?.phone || '+91 98124 11818'}</p>
                    <p className="text-main font-sans font-medium tracking-wide text-sm md:text-base leading-relaxed">{settings?.email || 'hello@rimpy.com'}</p>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary flex items-center justify-center rounded-full shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400">Studio Hours</h4>
                    <p className="text-main font-serif italic text-base md:text-lg leading-relaxed">{settings?.workingHours || 'Mon - Sat: 09:30 AM - 09:00 PM'}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-surface">
                <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-6">Connect Digitally</h4>
                <div className="flex gap-5">
                  <a href={settings?.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 border border-surface flex items-center justify-center rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 shadow-sm"><Instagram size={18} /></a>
                  <a href={settings?.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 border border-surface flex items-center justify-center rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 shadow-sm"><Facebook size={18} /></a>
                  <a href={settings?.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 border border-surface flex items-center justify-center rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 shadow-sm"><Youtube size={18} /></a>
                </div>
              </div>

              {/* Branded Quote */}
              <div className="p-6 md:p-8 bg-dark text-white rounded-sm relative overflow-hidden group shadow-xl border border-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700"></div>
                <p className="text-xs md:text-sm font-serif italic text-gray-400 leading-relaxed relative z-10">
                  "At Rimpy Gifts Studio, we don't just take photos; we capture the soul of your most precious moments. Let's create a legacy together."
                </p>
              </div>
            </m.div>
          </div>

        </div>

        {/* Geolocation Map Section */}
        <m.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 md:mt-32 pt-16 border-t border-surface"
        >
          <div className="text-center mb-10">
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">Find Us on the Map</span>
            <h3 className="text-2xl md:text-4xl font-serif italic text-main">Our Physical Location</h3>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="w-full h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-2xl border border-surface relative group">
            <iframe
              title="Google Maps Location for Rimpy Gifts Studio"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.284000305886!2d76.981998!3d29.6892701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e71380fb35f15%3A0x8886775a88307e8e!2sRimpy%20Gifts%20Studio!5e0!3m2!1sen!2sin!4v1716612000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            ></iframe>
          </div>
        </m.div>

      </div>
    </div>
  );
};

export default Contact;

