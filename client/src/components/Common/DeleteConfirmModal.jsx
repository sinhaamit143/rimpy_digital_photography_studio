import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <m.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm" 
          />
          <m.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="bg-surface w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h4 className="text-xl font-serif text-main italic mb-2">Confirm Deletion</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
                  Are you sure you want to remove <span className="text-main">"{title}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose} 
                  className="flex-1 py-4 bg-secondary text-main uppercase tracking-widest text-[10px] font-bold hover:bg-gray-200 transition-all rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm} 
                  disabled={loading}
                  className="flex-[2] py-4 bg-red-500 text-white uppercase tracking-widest text-[10px] font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 rounded-sm flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={14} />}
                  Confirm Delete
                </button>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-main transition-colors"
            >
              <X size={20} />
            </button>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
