import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "Where is Rimpy Gifts Studio located and what are the working hours?",
    a: "Rimpy Gifts Studio is located at Shop No 18, Near DAV Women College, Railway Road, Karnal - 132001, Haryana. We are open Monday through Saturday from 09:30 AM to 09:00 PM."
  },
  {
    q: "What specialties and custom gifting options do you offer in Karnal?",
    a: "We specialize in bespoke resin preservation (including wedding varmala preservation and flower casting), premium custom photo frames, bespoke picture collages, and personalized gift hampers for all occasions."
  },
  {
    q: "How does the wedding varmala resin preservation process work?",
    a: "Our flower preservation process involves carefully drying your wedding varmala or flowers, arranging them in a custom mold (such as a clock, hexagon, letter, or block), and casting them in high-quality, UV-resistant epoxy resin to create a durable, crystal-clear keepsake that lasts a lifetime."
  },
  {
    q: "Can I place an online order at Rimpy Gifts Studio?",
    a: "Yes! You can browse our products online and contact us directly at +91 98124 11818 or via our online inquiry form to place customized orders for delivery or in-store pickup."
  },
  {
    q: "Do you offer professional photo services like event photography or passport photos?",
    a: "Yes, we provide instant high-quality passport-size pictures at our Railway Road studio, along with professional event photography, family portraits, and cinematography services."
  },
  {
    q: "Are the custom collages and photo frames durable and high quality?",
    a: "Absolutely. We are renowned in Karnal for using premium materials, high-quality printing, and durable framing techniques that prevent fading and protect your memories for over 22 years and beyond."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => (
  <div className="border-b border-surface last:border-0">
    <button 
      onClick={toggle}
      className="w-full py-8 flex justify-between items-center text-left group"
    >
      <span className={`text-sm md:text-base uppercase tracking-widest font-bold transition-colors ${isOpen ? 'text-primary' : 'text-main group-hover:text-primary'}`}>
        {faq.q}
      </span>
      {isOpen ? <Minus size={20} className="text-primary" /> : <Plus size={20} className="text-text-light" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-8 text-text-light text-lg leading-relaxed font-serif italic">
            {faq.a}
          </p>
        </m.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="pt-40 pb-32 bg-secondary min-h-screen">
      <div className="container max-w-4xl">
        <div className="text-center mb-20">
          <span className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Help Center</span>
          <h2 className="text-5xl md:text-7xl mb-8">Frequently Asked Questions</h2>
          <div className="w-24 h-[2px] bg-primary mx-auto mb-10"></div>
          <p className="text-text-light font-serif italic text-lg leading-relaxed">
            Everything you need to know about our services, orders, and studio policies.
          </p>
        </div>
 
        <div className="glass-panel p-8 md:p-20">
          {faqs.map((faq, idx) => (
            <FAQItem 
              key={idx} 
              faq={faq} 
              isOpen={openIndex === idx} 
              toggle={() => setOpenIndex(openIndex === idx ? null : idx)} 
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <h4 className="text-2xl font-serif mb-6 italic">Still have questions?</h4>
          <a href="/contact" className="btn-primary inline-block">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

