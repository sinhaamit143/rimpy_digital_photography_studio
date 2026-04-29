import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { openWhatsApp } from '../utils/whatsapp';
import { Filter, ShoppingBag, Loader2 } from 'lucide-react';
import api from '../utils/api';

import PageLoader from '../components/PageLoader';

const fallbackImg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to fetch shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category?.name === activeCategory);

  if (loading) {
    return <PageLoader message="Curating the Collection..." visible={true} />;
  }

  return (
    <div className="pt-32 md:pt-40 pb-20 bg-secondary min-h-screen">
      <div className="px-6 md:container">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-20 gap-8 md:gap-10">
          <div className="max-w-2xl">
            <span className="text-primary uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-4 block">Boutique Store</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 leading-tight">Personalized <br className="md:hidden" /> Gifting</h2>
            <p className="text-text-light font-serif italic text-base md:text-lg leading-relaxed max-w-xl">
              Explore our wide range of 3D crystals, designer frames, and custom keychains. Every piece is crafted to tell a story.
            </p>
          </div>
          
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="flex flex-nowrap lg:flex-wrap gap-6 lg:gap-10 whitespace-nowrap border-b border-gray-100 lg:border-none pb-4 lg:pb-0">
              <button
                onClick={() => setActiveCategory("All")}
                className={`text-[10px] md:text-xs uppercase tracking-widest transition-all pb-1 border-b-2 ${activeCategory === "All" ? 'text-primary border-primary font-bold' : 'text-text-light border-transparent hover:text-dark'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`text-[10px] md:text-xs uppercase tracking-widest transition-all pb-1 border-b-2 ${activeCategory === cat.name ? 'text-primary border-primary font-bold' : 'text-text-light border-transparent hover:text-dark'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-white group shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-sm overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-900">
                  <img 
                    src={product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:5004${product.imageUrl}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => { e.target.src = fallbackImg; }}
                  />
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => openWhatsApp(product.title, `₹${product.price}`)}
                      className="bg-white text-dark px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-2xl scale-90 group-hover:scale-100 duration-500 rounded-sm"
                    >
                      Buy via WhatsApp
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/10">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-8 md:pb-10 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block opacity-60">{product.category?.name}</span>
                  <h3 className="text-lg md:text-xl font-serif mb-4 tracking-wide group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                  <div className="h-0.5 w-12 bg-primary/20 mx-auto group-hover:w-24 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 md:py-32 text-center border-2 border-dashed border-gray-100 rounded-sm">
            <h4 className="text-xl md:text-2xl font-serif text-gray-300 italic mb-2">Collection is currently empty</h4>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Please check back later or browse other categories</p>
          </div>
        )}

        {/* Shop Info Snippet - Bulk Orders */}
        <div className="mt-20 md:mt-40 relative overflow-hidden group rounded-sm shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2000" 
              alt="Gifting Workshop" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s] ease-out"
            />
            <div className="absolute inset-0 bg-dark/90 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 p-10 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md group-hover:border-primary/50 transition-all duration-500">
                <ShoppingBag className="text-primary" size={32} />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl md:text-5xl font-serif italic text-white leading-tight">Bulk Orders & <br className="hidden md:block" /><span className="not-italic text-primary">Customization</span></h4>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-400 font-bold max-w-md leading-relaxed">
                  Need something unique? We specialize in corporate gifting and large-scale personalized orders for any occasion.
                </p>
              </div>
            </div>
            
            <a 
              href="/contact" 
              className="w-full lg:w-auto text-center px-12 py-5 bg-primary text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-dark transition-all duration-500 shadow-2xl rounded-sm"
            >
              Enquire Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
