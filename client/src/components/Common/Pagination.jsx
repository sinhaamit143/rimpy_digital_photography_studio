import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (page < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-16 mb-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-dark transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, idx) => (
          p === '...' ? (
            <span key={`sep-${idx}`} className="px-3 text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              className={`min-w-[40px] h-10 rounded-sm text-xs font-bold transition-all ${
                page === p 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'hover:bg-gray-100 text-dark/60 hover:text-dark'
              }`}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-dark transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
