import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import PageLoader from '../components/PageLoader';

const Privacy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <PageLoader message="Securing the Vault..." visible={true} />;

  return (
    <div className="pt-40 pb-32 bg-secondary min-h-screen selection:bg-primary selection:text-white">
      <div className="container max-w-4xl px-6 md:px-8">
        
        {/* Header */}
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-8 text-primary border border-gray-100">
            <ShieldCheck size={32} />
          </div>
          <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block italic">Studio Compliance</span>
          <h1 className="text-4xl md:text-7xl font-serif leading-tight text-dark italic">Privacy <span className="not-italic font-sans text-primary">Policy</span></h1>
          <div className="w-24 h-[2px] bg-primary mx-auto mt-8"></div>
          <p className="mt-8 text-gray-500 text-xs uppercase tracking-widest font-bold">Last Updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </m.div>

        {/* Content */}
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-20 shadow-2xl border border-gray-100 rounded-sm prose prose-zinc prose-invert max-w-none"
        >
          <div className="space-y-16">
            
            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-dark flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Our Commitment
              </h3>
              <p className="text-gray-600 font-serif italic text-lg leading-relaxed">
                At Rimpy Digital Studio, your trust is our most valuable asset. We are committed to protecting the personal information and precious memories you share with us, ensuring a secure and transparent experience across our studio and digital shop.
              </p>
            </section>

            <section className="space-y-8">
              <h3 className="text-2xl font-serif text-dark flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Information We Collect
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-secondary/50 border border-gray-100 rounded-sm">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3 flex items-center gap-2"><Lock size={14} /> Personal Details</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Name, email, and phone number collected through inquiry forms to provide personalized photography services.</p>
                </div>
                <div className="p-6 bg-secondary/50 border border-gray-100 rounded-sm">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3 flex items-center gap-2"><Eye size={14} /> Visual Assets</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Photographs and videos captured during shoots or provided for personalized gifting are treated with the highest level of confidentiality.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-dark flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Use of Information
              </h3>
              <ul className="space-y-4 text-gray-600 text-sm md:text-base list-none p-0">
                {[
                  "To fulfill photography bookings and event coverage.",
                  "To process and deliver personalized gifting orders from our shop.",
                  "To communicate studio updates and promotional offers (with your consent).",
                  "To improve our artistic services based on client feedback."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-dark flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Image Rights & Portfolio
              </h3>
              <p className="text-gray-600 text-sm leading-loose">
                As an artistic studio, we take pride in our work. We may use selected images in our professional portfolio or social media to showcase our expertise. However, we strictly respect client privacy and will always honor requests to keep specific shoots private or remove images from our public galleries.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-dark flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Data Security
              </h3>
              <p className="text-gray-600 text-sm leading-loose">
                We implement industry-standard encryption and secure server protocols to protect your data. Your visual memories are stored in our secure digital vault, accessible only to authorized studio staff.
              </p>
            </section>

            <section className="pt-10 border-t border-gray-100 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Contact our Compliance Team</p>
              <a href="/contact" className="text-primary font-bold hover:tracking-widest transition-all">hello@rimpy.com</a>
            </section>

          </div>
        </m.div>
      </div>
    </div>
  );
};

export default Privacy;

