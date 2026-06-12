import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    district: '',
    state: '',
    country: 'India',
    pinCode: '',
    consentGiven: false
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found or invalid ID. Please return to the shop.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/orders', {
        ...formData,
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        category: product.category?.name || 'Uncategorized'
      });
      setSuccess(true);
    } catch (err) {
      console.error('Order submission failed:', err);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Product Details */}
          <m.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 min-w-0"
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
            
            <div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block opacity-80">
                {product.category?.name || 'Premium Gifting'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4 break-words break-all">{product.title}</h1>
              <div className="text-2xl font-bold text-main mb-6">₹{product.price.toLocaleString('en-IN')}</div>
              
              <div className="h-[1px] w-full bg-gray-200 mb-6"></div>
              
              <div className="prose prose-sm md:prose-base text-gray-600 font-serif italic leading-relaxed break-words break-all">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>A beautifully crafted piece perfect for capturing your most cherished memories. Contact us for custom personalization details.</p>
                )}
              </div>
            </div>
          </m.div>

          {/* Right Column: Inquiry Form */}
          <m.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface p-8 md:p-12 shadow-xl border border-surface rounded-sm relative overflow-hidden lg:sticky lg:top-32 min-w-0"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            
            <h3 className="text-2xl font-serif italic mb-2">Order Inquiry</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-8">
              Fill out the details below and we will contact you to confirm.
            </p>

            {success ? (
              <m.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h4 className="text-3xl font-serif">Inquiry Sent!</h4>
                <p className="text-gray-500 leading-relaxed max-w-sm break-words break-all">
                  Thank you for your interest in the {product.title}. Our team will review your details and contact you shortly.
                </p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="mt-8 bg-dark text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-primary transition-all"
                >
                  Continue Shopping
                </button>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pre-filled Product Details */}
                <div className="bg-secondary p-5 border border-surface rounded-sm mb-8 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20"></div>
                  <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Selected Product Details</h4>
                  <div className="flex justify-between items-start mb-1 gap-4">
                    <p className="font-serif text-main text-lg font-bold break-words break-all">{product.title}</p>
                    <p className="font-bold text-primary whitespace-nowrap mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category?.name || 'Premium Gifting'}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Contact Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="Phone Number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="Your Email" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">District / City *</label>
                    <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Pin Code *</label>
                    <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="Postal Code" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">State *</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Country *</label>
                    <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Additional Message (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-secondary border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none" placeholder="Any special requests or questions?"></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    required 
                    type="checkbox" 
                    id="order-consent" 
                    name="consentGiven" 
                    checked={formData.consentGiven} 
                    onChange={handleChange} 
                    className="mt-1 w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer" 
                  />
                  <label htmlFor="order-consent" className="text-xs text-gray-500 leading-relaxed cursor-pointer selection:bg-transparent">
                    I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline">Terms &amp; Conditions</a> and consent to the collection and processing of my contact and delivery details in accordance with the <a href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>. *
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-primary text-white py-5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
