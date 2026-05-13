import React from 'react';
import { m, AnimatePresence } from 'framer-motion';

const PageLoader = ({ message = "Loading...", visible = true }) => {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
        >
          <div className="relative">
            <m.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary/20 border-t-primary rounded-full shadow-2xl shadow-primary/20"
            />
            <img
              src="/logo_rdps2.png"
              className="w-8 md:w-12 absolute inset-0 m-auto brightness-0 invert opacity-60"
              alt="Logo"
            />
          </div>
          <div className="text-center space-y-3">
            <h4 className="text-lg md:text-2xl font-serif text-white italic tracking-wide">Rimpy Gifts</h4>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-primary font-bold animate-pulse">
              {message}
            </p>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

