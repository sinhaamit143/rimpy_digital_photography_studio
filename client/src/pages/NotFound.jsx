import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CameraOff, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-6 overflow-hidden relative">
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        <div className="mb-12 relative inline-block">
          <CameraOff size={100} className="text-primary mx-auto opacity-20" />
          <h1 className="text-[150px] font-serif leading-none text-dark/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">404</h1>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif text-dark mb-6 italic">Picture <span className="text-primary">Incomplete</span></h2>
        <p className="text-text-light text-lg mb-12 font-serif leading-relaxed">
          It seems the moment you're looking for was never captured. The page you are looking for has been moved or doesn't exist.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-10 py-5 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all duration-500 shadow-xl"
        >
          <ArrowLeft size={14} /> Back to Civilization
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
