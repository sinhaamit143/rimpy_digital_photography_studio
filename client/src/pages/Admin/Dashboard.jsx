import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, ImageIcon, Star, 
  MessageSquare, Settings, LogOut, Menu, Bell, Layers
} from 'lucide-react';
import api from '../../utils/api';

// Shared Components
import StatCard from './components/StatCard';

// Management Modules (Lazy Loaded or Direct)
import ProductManagement from './modules/ProductManagement';
import PortfolioManagement from './modules/PortfolioManagement';
import TestimonialManagement from './modules/TestimonialManagement';
import InquiryManagement from './modules/InquiryManagement';
import SettingsManagement from './modules/SettingsManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [counts, setCounts] = useState({ products: 0, albums: 0, testimonials: 0, unreadLeads: 0, totalLeads: 0 });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Portfolio', icon: ImageIcon },
    { name: 'Testimonials', icon: Star },
    { name: 'Inquiries', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  const fetchCounts = async () => {
    try {
      const [p, a, t, i] = await Promise.all([
        api.get('/products'),
        api.get('/portfolio/albums'),
        api.get('/testimonials'),
        api.get('/contact')
      ]);

      const productList = p.data.products || [];
      const albumList = a.data.albums || [];
      const testimonialList = t.data.testimonials || [];
      const inquiryList = i.data.inquiries || [];

      const unreadCount = inquiryList.filter(msg => !msg.isRead).length;

      setCounts({ 
        products: productList.length, 
        albums: albumList.length, 
        testimonials: testimonialList.length, 
        unreadLeads: unreadCount,
        totalLeads: inquiryList.length
      });
    } catch (err) { console.error('Stats error:', err); }
  };

  useEffect(() => { 
    fetchCounts(); 
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        await api.post('/auth/logout', { userId: user.id });
      }
    } catch (err) {
      console.error('Logout sync failed:', err);
    } finally {
      localStorage.clear();
      setTimeout(() => {
        navigate('/admin');
      }, 800);
    }
  };

  return (
    <div className="flex h-screen bg-secondary overflow-hidden selection:bg-primary selection:text-white font-sans">
      <AnimatePresence>
        {isLoggingOut && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-dark/90 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-24 h-24 border-2 border-primary/20 border-t-primary rounded-full" />
              <img src="/logo_rdps2.png" className="w-10 absolute inset-0 m-auto brightness-0 invert opacity-50" alt="Logo" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-xl font-serif text-white italic">Securing Session</h4>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold animate-pulse">Clearing vault & redirecting...</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <m.aside initial={false} animate={{ width: sidebarOpen ? '280px' : '80px' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-dark text-white flex flex-col z-50 relative shadow-2xl border-r border-white/5">
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <AnimatePresence mode='wait'>
            {sidebarOpen ? (
              <m.img key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src="/logo_rdps.png" alt="Logo" className="h-10 brightness-0 invert" />
            ) : (
              <m.img key="icon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} src="/logo_rdps2.png" alt="Icon" className="h-8 brightness-0 invert mx-auto" />
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-4 p-3 rounded-sm transition-all group ${activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-gray-400'}`}>
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{item.name}</span>}
              {sidebarOpen && item.name === 'Inquiries' && counts.unreadLeads > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">NEW</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 h-20">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-sm text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold">Logout</span>}
          </button>
        </div>
      </m.aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-secondary rounded-sm transition-colors text-dark"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-serif text-dark italic">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('Inquiries')}
              className="relative p-2 text-gray-400 hover:text-primary transition-all hover:bg-secondary rounded-full"
            >
              <Bell size={22} />
              {counts.unreadLeads > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {counts.unreadLeads}
                </span>
              )}
            </button>
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full border border-primary/20 font-serif font-bold text-primary shadow-inner">R</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
           <AnimatePresence mode='wait'>
             <m.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard label="Products" value={counts.products} icon={ShoppingBag} />
                    <StatCard label="Albums" value={counts.albums} icon={ImageIcon} />
                    <StatCard label="Testimonials" value={counts.testimonials} icon={Star} />
                    <StatCard label="Total Leads" value={counts.totalLeads} icon={Layers} />
                  </div>
                )}
                {activeTab === 'Products' && <ProductManagement refreshStats={fetchCounts} />}
                {activeTab === 'Portfolio' && <PortfolioManagement refreshStats={fetchCounts} />}
                {activeTab === 'Testimonials' && <TestimonialManagement refreshStats={fetchCounts} />}
                {activeTab === 'Inquiries' && <InquiryManagement refreshStats={fetchCounts} />}
                {activeTab === 'Settings' && <SettingsManagement />}
             </m.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
