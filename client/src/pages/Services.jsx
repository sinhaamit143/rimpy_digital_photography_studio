import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import PageLoader from '../components/PageLoader';

const fallbackImg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000";

const allServices = [
  {
    title: "Wedding & Events",
    description: "Capturing the grand gestures and quiet intimacies of your special day. Our full-day coverage includes luxury wedding albums and high-resolution digital galleries, perfectly edited to preserve your memories.",
    price: "Premium Packages",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Maternity & Newborn",
    description: "The journey of a new life is precious. We specialize in gentle, artistic photography for expectant mothers and newborns, creating timeless portraits that you will cherish for generations.",
    price: "Starting at ₹5,999",
    image: "https://images.unsplash.com/photo-1519225495810-75178319a11b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Personalized Gifting",
    description: "From 3D Keychains to Designer Greeting Cards, we turn your photos into unique gifts. Our gifting shop is a top destination in Karnal for high-quality, customized items for every occasion.",
    price: "Starting at ₹299",
    image: "https://images.unsplash.com/photo-1549465220-1d8c95ad76e0?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Photo Frame Dealing",
    description: "As leading photo frame dealers, we offer an extensive collection of premium frames. Whether it's a vintage wall frame or a modern panoramic canvas, we provide the perfect display for your art.",
    price: "Custom Sizes Available",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Video Editing Services",
    description: "Professional video editing for weddings, corporate events, and social media. We use industry-standard suites to ensure your stories are told with cinematic flair and precision.",
    price: "Starting at ₹1,999",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000"
  }
];

const Services = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <PageLoader message="Preparing our Studio..." visible={true} />;

  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 bg-secondary min-h-screen selection:bg-primary selection:text-white">
      <div className="container px-6 md:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-20 md:mb-32">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block italic">Our Expertise</span>
            <h2 className="text-4xl md:text-7xl mb-8 font-serif italic text-main leading-tight">Artistic <span className="not-italic text-primary">Services</span></h2>
            <div className="w-24 h-[2px] bg-primary mx-auto mb-8"></div>
            <p className="text-gray-500 max-w-2xl mx-auto font-serif italic text-base md:text-lg leading-relaxed">
              From the lens to the final gift, Rimpy Digital Studio offers a complete ecosystem of visual storytelling in Karnal.
            </p>
          </m.div>
        </div>

        {/* Services List */}
        <div className="space-y-32 md:space-y-48">
          {allServices.map((service, index) => (
            <m.div 
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Column */}
              <div className="w-full lg:flex-1 relative group">
                <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-dark shadow-2xl rounded-sm">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    onError={(e) => { e.target.src = fallbackImg; }}
                  />
                </div>
                {/* Mobile Price Tag */}
                <div className="mt-4 lg:hidden">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                    {service.price}
                  </span>
                </div>
                {/* Desktop Price Tag */}
                <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} bg-dark text-white px-8 py-5 hidden lg:block shadow-2xl border-l-4 border-primary`}>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary block mb-1">Pricing Guide</span>
                  <span className="text-sm font-serif italic text-white">{service.price}</span>
                </div>
              </div>
              
              {/* Content Column */}
              <div className="w-full lg:flex-1 text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <span className="text-primary font-serif italic text-xl">Service 0{index + 1}</span>
                  <h3 className="text-3xl md:text-6xl font-serif tracking-tight leading-tight text-main">{service.title}</h3>
                </div>
                <p className="text-gray-500 text-base md:text-lg leading-loose font-serif italic">
                  "{service.description}"
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4">
                  <a href="/contact" className="px-10 py-4 bg-primary text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-dark transition-all duration-500 shadow-xl rounded-sm">
                    Enquire Now
                  </a>
                  <a href="/portfolio" className="text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 text-gray-400 hover:text-primary transition-colors group">
                    View Gallery <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

