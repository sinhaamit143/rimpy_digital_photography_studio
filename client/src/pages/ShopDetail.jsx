import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/settings').catch(() => ({ data: {} }))
        ]);
        setProduct(productRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Product not found or invalid ID. Please return to the shop.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleWhatsAppOrder = () => {
    // The user explicitly requested to use this number for orders, as the admin setting might be a WhatsApp Channel link
    const phoneNumber = '919812411818';
    
    const productUrl = window.location.href;
    const message = `Hi, I would like to order this product:\n\n*Name:* ${product.title}\n*Price:* ₹${product.price.toLocaleString('en-IN')}\n*Description:* ${product.description || 'N/A'}\n\n*Link:* ${productUrl}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <PageLoader message="Loading Product Details..." visible={true} />;
  if (error) return (
    <div className="pt-32 pb-24 px-4 min-h-screen flex flex-col items-center justify-center bg-secondary">
      <div className="text-center">
        <h2 className="text-2xl text-accent mb-4">{error}</h2>
        <button onClick={() => navigate('/shop/products')} className="text-primary hover:text-white underline">Back to Shop</button>
      </div>
    </div>
  );
  if (!product) return null;

  return (
    <div className="pt-32 md:pt-40 pb-20 bg-secondary min-h-screen">
      <div className="px-6 md:container max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Product Image */}
          <m.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 min-w-0"
          >
            <div className="bg-surface p-4 shadow-sm border border-surface rounded-sm">
              <div className="aspect-square bg-zinc-900 relative overflow-hidden rounded-sm">
                <img 
                  src={product.imageUrl?.startsWith('http') ? product.imageUrl : `${BASE_URL}${product.imageUrl}`} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </m.div>

          {/* Right Column: Product Details & WhatsApp Button */}
          <m.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8 min-w-0 lg:sticky lg:top-32"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block opacity-80">
                {product.category?.name || 'Premium Gifting'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4 break-words break-all">{product.title}</h1>
              <div className="text-3xl font-bold text-main mb-6">₹{product.price.toLocaleString('en-IN')}</div>
              
              <div className="h-[1px] w-full bg-gray-200 mb-6"></div>
              
              <div className="prose prose-sm md:prose-base text-gray-600 font-serif italic leading-relaxed break-words break-all mb-8">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>A beautifully crafted piece perfect for capturing your most cherished memories. Contact us for custom personalization details.</p>
                )}
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-primary text-white py-5 px-6 rounded-sm uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-dark transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <MessageSquare size={18} />
                Order via WhatsApp
              </button>
              
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-4 text-center">
                Clicking this button will open WhatsApp with product details pre-filled.
              </p>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
