import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Camera, Zap, Gift, Award, TrendingUp, Users, Heart, ShieldCheck, Sparkles, Coffee } from 'lucide-react';
import PageLoader from '../components/PageLoader';

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Progressive loading not needed for static content
  // if (loading) return <PageLoader message="Learning our Story..." visible={true} />;

  const timeline = [
    { 
      year: "2004", 
      title: "The Beginning", 
      desc: "Rimpy Digital Studio opens its doors on Railway Road, Karnal, with a vision to redefine local photography.",
      icon: Camera,
      color: "text-primary"
    },
    { 
      year: "2010", 
      title: "Digital Expansion", 
      desc: "Major investment in high-end digital printing and professional video editing suites to meet growing demand.",
      icon: Zap,
      color: "text-accent"
    },
    { 
      year: "2018", 
      title: "Personalized Gifting", 
      desc: "Launched a boutique gift shop featuring 3D Crystals, Designer Greeting cards, and custom framing.",
      icon: Gift,
      color: "text-primary"
    },
    { 
      year: "Today", 
      title: "Market Leader", 
      desc: "Successfully serving over 50,000+ happy clients with a 5.0 star rating and a legacy of trust.",
      icon: Award,
      color: "text-accent"
    }
  ];

  const values = [
    { title: "Unmatched Quality", desc: "We use industry-leading camera gear and premium printing materials to ensure every frame is a masterpiece.", icon: ShieldCheck },
    { title: "Emotional Storytelling", desc: "We don't just take photos; we capture the laughter, the tears, and the quiet moments that matter.", icon: Heart },
    { title: "Constant Innovation", desc: "From 3D keychains to cinematic video editing, we stay ahead of industry trends to offer you the best.", icon: Sparkles },
    { title: "Client Comfort", desc: "Our studio is designed to be a warm, welcoming space, especially for our newborn and maternity clients.", icon: Coffee }
  ];

  return (
    <div className="pt-40 pb-20 overflow-hidden bg-white">
      {/* Intro Section */}
      <section className="container mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Legacy Since 2004</span>
            <h1 className="text-5xl md:text-7xl mb-10 font-serif leading-tight text-dark">20 Years of <br /><span className="italic">Excellence</span></h1>
            <p className="text-text-light text-lg leading-relaxed mb-8 font-serif italic">
              Located in the heart of Karnal, Rimpy Digital Studio has been more than just a photography shop—it's a place where memories are preserved for a lifetime. 
            </p>
            <p className="text-text-light text-base leading-loose mb-10">
              For two decades, we have been the trusted choice for families in Haryana. Our journey began with a simple camera and a passion for art. Today, we are a multi-service studio specializing in everything from high-end wedding cinematography to personalized 3D crystal gifting.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-10">
              <div>
                <h4 className="text-3xl font-serif text-dark">50K+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Happy Clients</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-dark">20+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-dark">5.0</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Google Rating</p>
              </div>
            </div>
          </m.div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000" 
              alt="Studio Life"
              className="w-full aspect-square object-cover shadow-2xl"
            />
            <div className="absolute -bottom-10 -right-10 bg-dark text-white p-12 hidden md:block border-l-4 border-accent shadow-2xl">
              <p className="text-sm italic font-serif leading-relaxed">
                "We don't just take pictures,<br />we capture the soul of the moment."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-24">
            <span className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif">What We Stand For</h2>
            <div className="w-24 h-[1px] bg-primary mx-auto mt-6"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value, idx) => (
              <m.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <value.icon size={28} />
                </div>
                <h4 className="text-sm uppercase tracking-widest font-bold mb-4">{value.title}</h4>
                <p className="text-sm text-text-light leading-relaxed">{value.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-secondary py-32">
        <div className="container">
          <div className="text-center mb-24">
            <span className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Timeline</span>
            <h2 className="text-4xl md:text-6xl font-serif">Our Journey</h2>
            <div className="w-24 h-[1px] bg-primary mx-auto mt-6"></div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 hidden lg:block -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-4 gap-8 relative z-10">
              {timeline.map((item, idx) => (
                <m.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-white p-10 shadow-lg group hover:-translate-y-4 transition-all duration-500 border-t-4 border-primary/20 hover:border-primary"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 bg-secondary/50 rounded-full ${item.color} group-hover:bg-primary group-hover:text-white transition-colors duration-500`}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-4xl font-serif text-gray-100 group-hover:text-primary/10 transition-colors duration-500">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-6 text-dark group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise & Equipment Section */}
      <section className="py-32 container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000" 
              alt="High-end Equipment"
              className="w-full aspect-video object-cover shadow-2xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-accent uppercase tracking-widest text-xs font-bold mb-6 block">The Tech Behind the Art</span>
            <h2 className="text-4xl md:text-5xl mb-8 font-serif">Crafted with Precision</h2>
            <p className="text-text-light leading-loose mb-8">
              We believe that great art requires the best tools. Our studio is equipped with Sony & Canon professional full-frame cameras, high-end Profoto lighting, and a dedicated post-production suite where our editors bring your vision to life.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-dark">
                <div className="w-2 h-2 bg-primary"></div> High-Resolution Cinematic Video Editing
              </li>
              <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-dark">
                <div className="w-2 h-2 bg-primary"></div> Specialized 3D Crystal Laser Technology
              </li>
              <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-dark">
                <div className="w-2 h-2 bg-primary"></div> Professional Post-Processing & Retouching
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team/Vision Section */}
      <section className="py-40 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=2000" 
            alt="Cinematic Studio" 
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s] ease-out"
          />
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <TrendingUp className="text-primary mx-auto mb-10 opacity-40" size={60} />
              <h2 className="text-4xl md:text-7xl mb-12 font-serif text-white italic">Looking <span className="not-italic text-primary">Ahead</span></h2>
              <p className="text-xl md:text-2xl font-serif italic text-gray-300 leading-relaxed md:leading-loose">
                "At Rimpy Digital Studio, we aim to expand our line of products and services and cater to a larger client base in the near future. Our dedication to quality and customer satisfaction remains the same as it was on our first day in 2004."
              </p>
              <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
                <a href="/contact" className="px-12 py-5 bg-primary text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-dark transition-all duration-500 shadow-2xl rounded-sm">Book a Session</a>
                <a href="/shop" className="px-12 py-5 bg-transparent border border-white/30 text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-dark transition-all duration-500 rounded-sm">Visit Gift Shop</a>
              </div>
            </m.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

