import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Grid, Image as ImageIcon, Loader2, Camera } from 'lucide-react';
import api from '../utils/api';
import Pagination from '../components/Common/Pagination';
import Skeleton from '../components/Common/Skeleton';

import PageLoader from '../components/PageLoader';

const fallbackImg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000";

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const Portfolio = () => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/portfolio/albums?page=${page}&limit=9`;
      if (activeCategory !== "All") {
        const cat = categories.find(c => c.name === activeCategory);
        if (cat) url += `&categoryId=${cat.id}`;
      }

      const [albumRes, catRes] = await Promise.all([
        api.get(url),
        api.get('/portfolio/categories')
      ]);
      
      setAlbums(albumRes.data.albums);
      setPagination(albumRes.data.pagination);
      setCategories(catRes.data);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [activeCategory]);

  const filteredAlbums = activeCategory === "All" 
    ? albums 
    : albums.filter(album => album.category?.name === activeCategory);

  // if (loading) {
  //   return <PageLoader message="Developing the Rolls..." visible={true} />;
  // }

  return (
    <div className="pt-32 md:pt-40 pb-20 min-h-screen bg-secondary overflow-x-hidden">
      <div className="px-6 md:container">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4 block italic">Our Visual Journal</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-8 leading-tight">Curated <span className="italic">Stories</span></h2>
          <div className="w-16 md:w-24 h-[1px] bg-primary mx-auto"></div>
        </div>

        {/* Categories (Horizontal Scroll on Mobile) */}
        <div className="w-full overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 mb-12 md:mb-20">
          <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-8 md:gap-12 whitespace-nowrap border-b border-surface md:border-none pb-4 md:pb-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-500 pb-2 border-b-2 ${activeCategory === "All" ? 'text-primary border-primary' : 'text-text-light border-transparent hover:text-main'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-500 pb-2 border-b-2 ${activeCategory === cat.name ? 'text-primary border-primary' : 'text-text-light border-transparent hover:text-main'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 md:gap-y-16 min-h-[800px]">
          {loading ? (
            <Skeleton className="aspect-[4/5] w-full opacity-10" repeat={6} />
          ) : (
            <AnimatePresence mode='popLayout'>
            {albums.map((album, index) => (
              <m.div
                layout
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-6 md:mb-8 bg-zinc-900 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img 
                    src={album.coverImage?.startsWith('http') ? album.coverImage : `${BASE_URL}${album.coverImage}`} 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => { e.target.src = fallbackImg; }}
                  />
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <div className="p-4 rounded-full border border-white/20 scale-50 group-hover:scale-100 transition-transform duration-500">
                      <ImageIcon className="text-white" size={28} />
                    </div>
                    <span className="text-white text-[9px] uppercase tracking-[0.4em] font-bold mt-4">View Collection</span>
                  </div>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div className="space-y-1 md:space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-primary font-bold opacity-60">{album.category?.name}</span>
                    <h3 className="text-xl md:text-2xl font-serif leading-tight group-hover:text-primary transition-colors line-clamp-1">{album.title}</h3>
                  </div>
                  <ChevronRight size={18} className="text-text-light group-hover:text-primary transition-all group-hover:translate-x-2 mt-2" />
                </div>
              </m.div>
            ))}
            </AnimatePresence>
          )}
        </div>

        <Pagination 
          pagination={pagination} 
          onPageChange={(page) => fetchData(page)} 
        />

        {/* Empty State */}
        {albums.length === 0 && (
          <div className="py-24 md:py-32 text-center border-2 border-dashed border-surface rounded-sm">
            <Camera size={40} className="mx-auto text-gray-200 mb-4" />
            <h4 className="text-xl md:text-2xl font-serif text-gray-300 italic mb-2">No albums found</h4>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Try exploring another genre</p>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox / Album Detail */}
      <AnimatePresence>
        {selectedAlbum && (
          <m.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[2000] bg-surface overflow-y-auto custom-scrollbar"
          >
            {/* Lightbox Controls */}
            <div className="fixed top-0 left-0 w-full bg-surface/90 backdrop-blur-md z-[2100] h-20 md:h-24 flex items-center justify-between px-6 md:px-20 border-b border-surface">
              <div className="flex items-center gap-3 md:gap-4">
                <Grid size={16} className="text-primary hidden md:block" />
                <div className="flex flex-col">
                   <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-main">{selectedAlbum.title}</span>
                   <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">{selectedAlbum.images?.length || 0} Captures</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-all bg-dark text-white md:bg-transparent md:text-main px-4 py-2 md:p-0 rounded-full"
              >
                <span className="hidden md:inline">Close Album</span> <X size={18} />
              </button>
            </div>

            {/* Album Content */}
            <div className="pt-32 md:pt-48 pb-20 px-6 md:container max-w-6xl">
              <div className="text-center mb-16 md:mb-24">
                <span className="text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 block font-bold">{selectedAlbum.category?.name} Edition</span>
                <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight italic">{selectedAlbum.title}</h2>
                <div className="w-16 md:w-24 h-[1px] bg-primary mx-auto mb-8 opacity-30"></div>
                {selectedAlbum.clientName && (
                  <p className="text-text-light font-serif italic text-base md:text-xl max-w-2xl mx-auto">
                    A personalized visual narrative captured for <span className="text-main font-bold not-italic font-sans text-sm md:text-base ml-1">{selectedAlbum.clientName}</span>.
                  </p>
                )}
              </div>

              {/* Dynamic Grid */}
              <div className="columns-1 md:columns-2 lg:columns-2 gap-6 md:gap-10 space-y-6 md:space-y-10">
                {selectedAlbum.images?.map((img, idx) => (
                  <m.div
                    key={img.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    className="relative overflow-hidden group bg-zinc-900 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-700"
                  >
                    <img 
                      src={img.imageUrl?.startsWith('http') ? img.imageUrl : `${BASE_URL}${img.imageUrl}`} 
                      alt={`Gallery ${idx}`} 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" 
                      loading="lazy"
                      onError={(e) => { e.target.src = fallbackImg; }}
                    />
                    <div className="absolute inset-0 bg-dark/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </m.div>
                ))}
              </div>

              {/* End of Album Call to Action */}
              <div className="mt-24 md:mt-40 text-center border-t border-surface pt-16 md:pt-20">
                <h4 className="text-xl md:text-3xl font-serif mb-8 md:mb-10 italic">Love our style? Let's talk about your project.</h4>
                <a href="/contact" className="inline-block bg-dark text-white px-10 md:px-14 py-4 md:py-6 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary transition-all shadow-2xl rounded-sm">Book a Session Now</a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;

