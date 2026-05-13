import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Image, 
  Lightbulb, 
  Heart, 
  Gift, 
  Baby, 
  Book, 
  Briefcase, 
  PartyPopper,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Award,
  Truck,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const ShopCategory = () => {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category Pagination
  const [catPage, setCatPage] = useState(1);
  const itemsPerPage = 12;

  // Map category names to icons and sample images
  const categoryMap = {
    "Photo Frames": { icon: Image, img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800" },
    "LED Lamps": { icon: Lightbulb, img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800" },
    "Couple Gifts": { icon: Heart, img: "https://images.unsplash.com/photo-1516589174184-c685266d4303?q=80&w=800" },
    "Gift Hampers": { icon: Gift, img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800" },
    "Baby Gifts": { icon: Baby, img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800" },
    "Photo Albums": { icon: Book, img: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800" },
    "Corporate Gifts": { icon: Briefcase, img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800" },
    "Occasion Gifts": { icon: PartyPopper, img: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800" }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, settingsRes, prodRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/settings'),
          api.get('/products?limit=8') // Fetch first 8 products for best sellers
        ]);
        setCategories(catRes.data);
        setSettings(settingsRes.data);
        setBestSellers(prodRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const whatsappNumber = settings?.phone?.split(',')[0].replace(/[^0-9]/g, '') || "919812411818";

  const handleCategoryClick = (categoryName) => {
    navigate('/shop/products', { state: { selectedCategory: categoryName } });
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <PageLoader message="Organizing Collection..." visible={true} />;

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/shop.webp" 
            alt="Hero" 
            loading="eager"
            fetchpriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="container relative z-10 text-center text-white px-6">
          <m.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="block text-xs uppercase tracking-[0.4em] mb-4 text-primary"
          >
            Since 2004 • Karnal's Premier Studio
          </m.span>
          <m.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif mb-8 leading-tight"
          >
            Crafting <span className="italic">Timeless</span> <br /> Memories
          </m.h1>
          <m.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-serif italic mb-10 opacity-90 max-w-2xl mx-auto"
          >
            Personalized gifts that turn moments into memories.
          </m.p>
          
          <m.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/shop/products')}
              className="bg-primary text-white px-8 py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-dark transition-all"
            >
              <ShoppingBag size={16} />
              Shop Now
            </button>
            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-dark transition-all"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </m.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 bg-surface border-b border-surface">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-secondary rounded-full border border-primary/20">
                <Star className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-main">Since 2004</h4>
                <p className="text-[11px] text-text-light uppercase tracking-tighter">Trusted by 50K+ Customers</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-secondary rounded-full border border-primary/20">
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-main">Premium Quality</h4>
                <p className="text-[11px] text-text-light uppercase tracking-tighter">Best Materials, Perfect Finishing</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-secondary rounded-full border border-primary/20">
                <Truck className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-main">Pan India Delivery</h4>
                <p className="text-[11px] text-gray-500 uppercase tracking-tighter">Safe & On-time Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Explore</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Shop by <span className="text-primary italic">Category</span></h2>
            <p className="text-text-light text-sm md:text-base">Find the perfect personalized gift for every occasion.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage).map((cat) => {
              const config = categoryMap[cat.name] || { icon: Gift, img: "https://images.unsplash.com/photo-1549465220-1d8c95ad76e0?q=80&w=800" };
              const Icon = config.icon;
              const catImage = cat.imageUrl ? (cat.imageUrl.startsWith('http') ? cat.imageUrl : `${BASE_URL}${cat.imageUrl}`) : config.img;
              
              return (
                <m.div
                  key={cat.id}
                  whileHover={{ y: -10 }}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface shadow-sm border border-surface">
                    <img 
                      src={catImage} 
                      alt={cat.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800"; }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-md rounded-lg p-4 flex flex-col items-center justify-center shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Icon size={24} className="text-primary mb-2" />
                      <h3 className="text-sm md:text-base font-bold text-main uppercase tracking-widest group-hover:text-primary transition-colors text-center">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>

          <div className="text-center mt-20 space-y-8">
            {categories.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  disabled={catPage === 1}
                  onClick={() => setCatPage(p => p - 1)}
                  className="p-3 border border-primary/20 rounded-full text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-main">Page {catPage} of {Math.ceil(categories.length / itemsPerPage)}</span>
                <button 
                  disabled={catPage === Math.ceil(categories.length / itemsPerPage)}
                  onClick={() => setCatPage(p => p + 1)}
                  className="p-3 border border-primary/20 rounded-full text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/shop/products')}
              className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-primary hover:text-white transition-all rounded-sm"
            >
              View All Products <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Best Sellers / Customer Favorites */}
      <section className="py-24 bg-dark text-white overflow-hidden">
        <div className="container px-6 relative">
          <div className="text-center mb-16">
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Best Sellers</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-4">Customer <span className="text-primary italic">Favorites</span></h2>
            <p className="text-gray-400 text-sm">Handpicked gifts loved by our customers.</p>
          </div>

          <div className="relative group/slider">
            {/* Overlay Navigation Arrows */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-surface text-main border border-primary/10 shadow-2xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all duration-300 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 rounded-full bg-surface text-main border border-primary/10 shadow-2xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all duration-300 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-10 scrollbar-hide scroll-smooth"
            >
            {bestSellers.map((product) => (
              <m.div 
                key={product.id} 
                onClick={() => navigate(`/shop/${product.id}`)}
                className="min-w-[280px] md:min-w-[320px] bg-white/5 rounded-xl overflow-hidden border border-white/5 group relative cursor-pointer"
              >
                <div className="aspect-square relative">
                  <img 
                    src={product.imageUrl?.startsWith('http') ? product.imageUrl : `${BASE_URL}${product.imageUrl}`} 
                    alt={product.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800"; }}
                  />
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                    <Heart size={14} className="text-white" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-serif italic text-lg mb-2 line-clamp-1">{product.title}</h4>
                  <p className="text-primary font-bold">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>


    </div>
  );
};

export default ShopCategory;
