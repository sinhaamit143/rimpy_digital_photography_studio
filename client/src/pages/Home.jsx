import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Quote, Camera, Gift, Award, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const FAQItem = ({ faq, isOpen, toggle }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button 
      onClick={toggle}
      className="w-full py-8 flex justify-between items-center text-left group"
    >
      <span className={`text-sm md:text-base uppercase tracking-widest font-bold transition-colors ${isOpen ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>
        {faq.q}
      </span>
      {isOpen ? <Minus size={20} className="text-primary" /> : <Plus size={20} className="text-text-light" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-8 text-text-light text-lg leading-relaxed font-serif italic">
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [testRes, settingsRes] = await Promise.all([
        api.get('/testimonials'),
        api.get('/settings')
      ]);
      setTestimonials(testRes.data.filter(t => t.status === 'active'));
      setSettings(settingsRes.data);
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const faqs = [
    {
      q: "Can I place an online order at Rimpy Digital Studio in Karnal?",
      a: "Yes, our integrated gift shop allows you to browse and enquire via WhatsApp directly from the website."
    },
    {
      q: "Does Rimpy Digital Studio offer a warranty on gifts?",
      a: "Yes, we prioritize quality and offer a standard studio warranty on our premium 3D crystals and frames."
    },
    {
      q: "How can I contact Rimpy Digital Studio?",
      a: `You can call us at ${settings?.phone || 'our studio number'} during working hours: ${settings?.workingHours || 'Mon-Sat: 10 AM - 8 PM'}.`
    },
    {
      q: "What is the rating received by Rimpy Digital Studio?",
      a: "Rimpy Digital Studio maintains a 5.0 rating for its dedication to photographic excellence and premium gift crafting."
    }
  ];

  const shopCategories = [
    { title: "Personalized Gifts", icon: Gift, img: "https://images.unsplash.com/photo-1549465220-1d8c95ad76e0?q=75&w=800&auto=format&fit=crop" },
    { title: "Premium Frames", icon: Camera, img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=75&w=800&auto=format&fit=crop" },
    { title: "3D Crystals", icon: Award, img: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=75&w=800&auto=format&fit=crop" },
  ];

  // Auto-slide logic
  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading) return <PageLoader message="Gathering Client Stories..." visible={true} />;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center bg-dark">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=75&w=1600" 
            alt="Photography Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        <div className="container relative z-10 text-center text-white">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="block text-[10px] md:text-sm uppercase tracking-[0.4em] mb-6 font-medium text-accent"
          >
            Since 2004 • Karnal's Premier Studio
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif mb-10 leading-tight"
          >
            Crafting <span className="italic">Timeless</span> <br /> Memories
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-center gap-6"
          >
            <a href="/portfolio" className="btn-accent inline-block">View Portfolio</a>
            <a href="/shop" className="btn-primary !border-white !text-white hover:!bg-white hover:!text-dark inline-block">Browse Gift Shop</a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us / Shop Categories Preview */}
      <section className="py-32 bg-secondary">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl mb-6">Explore Our Studio</h2>
            <p className="text-text-light font-serif italic max-w-2xl mx-auto">From professional shoots to personalized gifting, we provide a complete visual experience.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {shopCategories.map((cat) => (
              <motion.div 
                key={cat.title}
                whileHover={{ y: -10 }}
                className="group relative h-[500px] overflow-hidden bg-zinc-900 cursor-pointer shadow-2xl"
              >
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-700" 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000'; }}
                />
                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                  <cat.icon className="text-accent mb-4" size={32} />
                  <h3 className="text-2xl mb-4 font-serif tracking-widest">{cat.title}</h3>
                  <a href="/shop" className="text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-4 transition-all text-accent font-bold">
                    Shop Category <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section Snippet - RESTORED */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=75&w=800" 
              alt="Studio Interior"
              className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl"
            />
            <div className="absolute top-10 -left-10 bg-dark text-white p-10 hidden md:block border-l-4 border-primary shadow-2xl">
              <span className="text-5xl font-serif block text-primary mb-2">20+</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Years of Trust</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Premium Quality</span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">One Stop Destination for All Your <span className="italic text-primary">Visual Needs</span></h2>
            <p className="text-text-light mb-10 leading-loose text-lg font-serif italic">
              Established in 2004, Rimpy Digital Studio has been a cornerstone of creativity in Karnal. Whether it's capturing the first smile of a newborn or creating a personalized 3D crystal gift, we handle every project with unmatched dedication.
            </p>
            <div className="grid grid-cols-2 gap-10 mb-12">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark">Photography</h4>
                <div className="w-10 h-[1px] bg-primary"></div>
                <p className="text-xs text-text-light leading-relaxed">Weddings, Portraits, Maternity, Events & Cinematography.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark">Gifting</h4>
                <div className="w-10 h-[1px] bg-primary"></div>
                <p className="text-xs text-text-light leading-relaxed">3D Crystals, Custom Frames, Personalized Albums & More.</p>
              </div>
            </div>
            <a href="/about" className="px-10 py-5 bg-dark text-white uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-primary transition-all shadow-xl inline-block">Read Our Story</a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Slider */}
      {testimonials.length > 0 && (
        <section className="py-32 bg-dark text-white relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="text-accent mx-auto mb-10 opacity-20" size={80} />
              <h2 className="text-4xl md:text-5xl mb-16 italic font-serif">Kind Words from <br className="md:hidden" /> our Clients</h2>
              
              <div className="relative h-auto md:h-[350px] flex items-center justify-center py-10 md:py-0">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8 absolute w-full"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full border-2 border-accent/30 p-1 overflow-hidden">
                        <img 
                          src={testimonials[currentTestimonial].imageUrl?.startsWith('http') ? testimonials[currentTestimonial].imageUrl : `${BASE_URL}${testimonials[currentTestimonial].imageUrl}`} 
                          className="w-full h-full object-cover rounded-full bg-secondary"
                          alt="Client"
                          loading="lazy"
                          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + testimonials[currentTestimonial].name + "&background=c49a6c&color=fff"; }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center gap-1 text-accent mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < testimonials[currentTestimonial].rating ? "currentColor" : "transparent"} className={i < testimonials[currentTestimonial].rating ? "" : "text-white/20"} />
                      ))}
                    </div>
                    <p className="text-gray-300 font-serif italic text-xl md:text-3xl leading-relaxed max-w-3xl mx-auto">
                      "{testimonials[currentTestimonial].comment}"
                    </p>
                    <div className="mt-8">
                      <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-white">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-[9px] text-accent uppercase tracking-widest mt-2 font-bold opacity-60">
                        {testimonials[currentTestimonial].profession || 'Happy Client'}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-24">
                <div className="flex items-center gap-6">
                  <button onClick={prevTestimonial} className="p-4 border border-white/10 rounded-full hover:bg-accent hover:border-accent transition-all group">
                    <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="flex gap-3">
                    {testimonials.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentTestimonial(i)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${currentTestimonial === i ? 'w-10 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                  <button onClick={nextTestimonial} className="p-4 border border-white/10 rounded-full hover:bg-accent hover:border-accent transition-all group">
                    <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/4 h-full bg-accent/5 -skew-x-12 hidden lg:block" />
        </section>
      )}

      {/* FAQ Section - FULLY RESTORED */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-20">
            <span className="text-primary uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-4 block">Help Center</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">Common <br className="md:hidden" /> Questions</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-6"></div>
          </div>
          <div className="bg-white p-6 md:p-12 shadow-2xl shadow-dark/5 border border-gray-50 rounded-sm">
            {faqs.map((faq, idx) => (
              <FAQItem 
                key={idx} 
                faq={faq} 
                isOpen={openFAQ === idx} 
                toggle={() => setOpenFAQ(openFAQ === idx ? null : idx)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - FULLY RESTORED */}
      <section className="py-24 bg-primary text-white text-center relative overflow-hidden group">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" 
        />
        <div className="container relative z-10">
          <h2 className="text-4xl md:text-6xl mb-12 font-serif italic">Ready to Capture <br className="md:hidden" /> Your Story?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a href="/contact" className="px-12 py-5 bg-white text-dark uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-dark hover:text-white transition-all shadow-2xl group-hover:scale-105 duration-500 rounded-sm">Book a Session Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
