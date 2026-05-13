import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, ImageIcon, Star, 
  MessageSquare, Settings, LogOut, Menu, Bell, Layers,
  ShoppingCart, Clock, CheckCircle, XCircle, Globe, Loader2
} from 'lucide-react';
import api, { setAccessToken } from '../../utils/api';

// Shared Components
import StatCard from './components/StatCard';
import AdminAnalytics from './components/AdminAnalytics';

// Management Modules (Lazy Loaded)
const ProductManagement = lazy(() => import('./modules/ProductManagement'));
const PortfolioManagement = lazy(() => import('./modules/PortfolioManagement'));
const TestimonialManagement = lazy(() => import('./modules/TestimonialManagement'));
const InquiryManagement = lazy(() => import('./modules/InquiryManagement'));
const SettingsManagement = lazy(() => import('./modules/SettingsManagement'));
const OrderManagement = lazy(() => import('./modules/OrderManagement'));

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [counts, setCounts] = useState({ 
    products: 0, albums: 0, testimonials: 0, unreadLeads: 0, totalLeads: 0,
    totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0
  });
  const [ordersData, setOrdersData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Portfolio', icon: ImageIcon },
    { name: 'Testimonials', icon: Star },
    { name: 'Inquiries', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  const fetchCounts = async () => {
    try {
      const [p, a, t, i, o] = await Promise.all([
        api.get('/products'),
        api.get('/portfolio/albums'),
        api.get('/testimonials'),
        api.get('/contact'),
        api.get('/orders').catch(() => ({ data: { orders: [] } }))
      ]);

      const productList = p.data.products || [];
      const albumList = a.data.albums || [];
      const testimonialList = t.data.testimonials || [];
      const inquiryList = i.data.inquiries || [];
      const orderList = o.data.orders || [];

      const unreadCount = inquiryList.filter(msg => !msg.isRead).length;
      const pendingCount = orderList.filter(ord => ord.status === 'pending').length;
      const completedCount = orderList.filter(ord => ord.status === 'delivered').length;
      const cancelledCount = orderList.filter(ord => ord.status === 'cancelled').length;

      setOrdersData(orderList);

      setCounts({ 
        products: productList.length, 
        albums: albumList.length, 
        testimonials: testimonialList.length, 
        unreadLeads: unreadCount,
        totalLeads: inquiryList.length,
        totalOrders: orderList.length,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        cancelledOrders: cancelledCount
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
      localStorage.removeItem('user');
      setAccessToken(null); // Clear memory token
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
              <m.img key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src="/inverselogo.png" alt="Logo" className="h-14 w-auto object-contain" />
            ) : (
              <m.img key="icon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} src="/logo_rdps2.png" alt="Icon" className="h-8 brightness-0 invert mx-auto" />
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-4 p-3 rounded-sm transition-all group ${activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface/5 text-gray-400'}`}>
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{item.name}</span>}
              {sidebarOpen && item.name === 'Inquiries' && counts.unreadLeads > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">NEW</span>
              )}
              {sidebarOpen && item.name === 'Orders' && counts.pendingOrders > 0 && (
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
        <header className="h-20 bg-surface border-b border-surface flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-secondary rounded-sm transition-colors text-main"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-serif text-main italic">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-primary transition-all hover:bg-secondary rounded-full"
            >
              <Bell size={22} />
              {(counts.unreadLeads + counts.pendingOrders) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {counts.unreadLeads + counts.pendingOrders}
                </span>
              )}
            </button>

            <button 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary hover:text-white transition-all text-main rounded-sm text-[10px] uppercase tracking-widest font-bold shadow-sm"
              title="Visit Public Website"
            >
              <Globe size={16} />
              <span className="hidden md:inline">Visit Site</span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <m.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-12 mt-4 w-72 md:w-80 bg-surface border border-surface shadow-2xl rounded-sm overflow-hidden z-50"
                >
                  <div className="p-4 bg-secondary/80 border-b border-surface flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Notifications</span>
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">{counts.unreadLeads + counts.pendingOrders} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {counts.pendingOrders > 0 && (
                      <button 
                        onClick={() => { setActiveTab('Orders'); setShowNotifications(false); }}
                        className="w-full text-left p-4 hover:bg-secondary/50 border-b border-surface transition-colors flex items-start gap-4 group"
                      >
                        <div className="p-2.5 bg-yellow-100 text-yellow-600 rounded-full group-hover:scale-110 transition-transform">
                          <ShoppingCart size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-main mb-0.5">Pending Orders</p>
                          <p className="text-xs text-gray-500">You have {counts.pendingOrders} orders waiting.</p>
                        </div>
                      </button>
                    )}
                    {counts.unreadLeads > 0 && (
                      <button 
                        onClick={() => { setActiveTab('Inquiries'); setShowNotifications(false); }}
                        className="w-full text-left p-4 hover:bg-secondary/50 border-b border-surface transition-colors flex items-start gap-4 group"
                      >
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-main mb-0.5">New Inquiries</p>
                          <p className="text-xs text-gray-500">You have {counts.unreadLeads} unread messages.</p>
                        </div>
                      </button>
                    )}
                    {(counts.unreadLeads === 0 && counts.pendingOrders === 0) && (
                      <div className="p-8 text-center text-gray-400">
                        <CheckCircle size={28} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">All caught up!</p>
                      </div>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full border border-primary/20 font-serif font-bold text-primary shadow-inner">R</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
           <AnimatePresence mode='wait'>
             <m.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {activeTab === 'Overview' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                      <StatCard label="Total Orders" value={counts.totalOrders} icon={ShoppingCart} onClick={() => setActiveTab('Orders')} />
                      <StatCard label="Pending Orders" value={counts.pendingOrders} icon={Clock} onClick={() => setActiveTab('Orders')} />
                      <StatCard label="Delivered Orders" value={counts.completedOrders} icon={CheckCircle} onClick={() => setActiveTab('Orders')} />
                      <StatCard label="Cancelled Orders" value={counts.cancelledOrders} icon={XCircle} onClick={() => setActiveTab('Orders')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                      <StatCard label="Total Leads" value={counts.totalLeads} icon={Layers} onClick={() => setActiveTab('Inquiries')} />
                      <StatCard label="Products" value={counts.products} icon={ShoppingBag} onClick={() => setActiveTab('Products')} />
                      <StatCard label="Albums" value={counts.albums} icon={ImageIcon} onClick={() => setActiveTab('Portfolio')} />
                      <StatCard label="Testimonials" value={counts.testimonials} icon={Star} onClick={() => setActiveTab('Testimonials')} />
                    </div>
                    <AdminAnalytics orders={ordersData} />
                  </div>
                )}
                <Suspense fallback={
                  <div className="h-[400px] flex flex-col items-center justify-center text-primary">
                    <Loader2 size={40} className="animate-spin mb-4 opacity-20" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">Loading Module...</p>
                  </div>
                }>
                  {activeTab === 'Products' && <ProductManagement refreshStats={fetchCounts} />}
                  {activeTab === 'Portfolio' && <PortfolioManagement refreshStats={fetchCounts} />}
                  {activeTab === 'Testimonials' && <TestimonialManagement refreshStats={fetchCounts} />}
                  {activeTab === 'Inquiries' && <InquiryManagement refreshStats={fetchCounts} />}
                  {activeTab === 'Orders' && <OrderManagement refreshStats={fetchCounts} />}
                  {activeTab === 'Settings' && <SettingsManagement />}
                </Suspense>
             </m.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
