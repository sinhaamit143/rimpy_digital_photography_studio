import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Gavel, Calendar, CreditCard, ShoppingBag, Copyright } from 'lucide-react';
import PageLoader from '../components/PageLoader';

const Terms = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <PageLoader message="Establishing the Protocol..." visible={true} />;

  return (
    <div className="pt-40 pb-32 bg-secondary min-h-screen selection:bg-primary selection:text-white">
      <div className="container max-w-4xl px-6 md:px-8">
        
        {/* Header */}
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="w-16 h-16 bg-surface shadow-xl rounded-full flex items-center justify-center mx-auto mb-8 text-primary border border-surface">
            <Gavel size={32} />
          </div>
          <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block italic">Studio Agreement</span>
          <h1 className="text-4xl md:text-7xl font-serif leading-tight text-main italic">Terms & <span className="not-italic font-sans text-primary">Conditions</span></h1>
          <div className="w-24 h-[2px] bg-primary mx-auto mt-8"></div>
        </m.div>

        {/* Content */}
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface p-8 md:p-20 shadow-2xl border border-surface rounded-sm max-w-none"
        >
          <div className="space-y-16">
            
            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-main flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Professional Relationship
              </h3>
              <p className="text-gray-600 font-serif italic text-lg leading-relaxed">
                By accessing our services or purchasing from our shop, you agree to the following protocols that ensure a high standard of creative collaboration and customer satisfaction at Rimpy Digital Studio.
              </p>
            </section>

            <section className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-2"><Calendar size={14} /> Bookings & Deposits</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">To secure a photography session, a non-refundable deposit may be required. This ensures our studio is fully prepared for your scheduled time.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-2"><Copyright size={14} /> Copyright & Usage</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Rimpy Digital Studio retains copyright to all images. Clients receive usage rights for personal sharing. Commercial usage requires a separate agreement.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-2"><ShoppingBag size={14} /> Personalized Gifts</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Due to the custom nature of our gifts (3D crystals, frames, etc.), orders cannot be cancelled once production has begun.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-2"><CreditCard size={14} /> Payments</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Full payment is required before the delivery of final high-resolution galleries or the dispatch of gift shop items.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-main flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Delivery Timelines
              </h3>
              <p className="text-gray-600 text-sm leading-loose">
                We strive for perfection. Standard digital galleries are delivered within 10-15 working days. Specialized gifts and albums may take 7-10 days for production and local delivery in Karnal.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-serif text-main flex items-center gap-4 italic">
                <div className="w-10 h-[1px] bg-primary"></div> Cancellation & Rescheduling
              </h3>
              <p className="text-gray-600 text-sm leading-loose">
                We understand life happens. Shoots can be rescheduled with at least 48 hours' notice. Cancellations made within 24 hours of the shoot may result in the forfeiture of the booking deposit.
              </p>
            </section>

            <section className="pt-10 border-t border-surface text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Need Clarification?</p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <a href="/contact" className="px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all">Contact Studio</a>
              </div>
            </section>

          </div>
        </m.div>
      </div>
    </div>
  );
};

export default Terms;

