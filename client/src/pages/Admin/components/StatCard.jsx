import React from 'react';
import { motion as m } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <m.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-secondary rounded-sm text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">{label}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-serif text-dark italic">{value}</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Current</span>
        </div>
      </div>
    </div>
  </m.div>
);

export default StatCard;
