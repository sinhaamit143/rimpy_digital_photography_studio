import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "Can I place an online order at Rimpy Digital Studio in Karnal?",
    a: "Yes, most gift shops allow customers to place an online order. However, we suggest you get in touch with us directly for more details on specific items."
  },
  {
    q: "Does Rimpy Digital Studio offer a warranty on gifts?",
    a: "Yes, most gifting companies offer a warranty on gifts. Please contact us for more information on the specific product you are interested in."
  },
  {
    q: "How can I contact Rimpy Digital Studio?",
    a: "You can call us during our working hours. Mon-Sat: 9:30 AM - 9:00 PM and Sun: 12:00 PM - 4:00 PM."
  },
  {
    q: "What is the rating received by Rimpy Digital Studio?",
    a: "Rimpy Digital Studio has successfully acquired a rating of 5.0 for its wide variety of gifting options and quality services."
  },
  {
    q: "Does Rimpy Digital Studio offer discounts and offers?",
    a: "Yes, we often have discounts and offers planned for our customers. Feel free to contact us or visit the shop for the latest deals."
  }
];

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

        <div className="bg-white p-8 md:p-20 shadow-xl rounded-sm">
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
