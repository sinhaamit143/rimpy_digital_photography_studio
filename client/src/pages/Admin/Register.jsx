import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', secretKey: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 md:p-10 relative">
      <AnimatePresence>
        {isSuccess && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
            <m.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary"
            >
              <CheckCircle size={60} className="text-primary" />
            </m.div>
            <div className="text-center space-y-3">
              <h4 className="text-3xl font-serif text-white italic">Account Created</h4>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Redirecting to Vault Access...</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      
      <Link 
        to="/admin" 
        className="absolute top-8 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-main/40 hover:text-primary transition-colors group z-50"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Login
      </Link>

      <div className="w-full max-w-[1100px] h-auto lg:min-h-[700px] flex shadow-2xl rounded-sm overflow-hidden bg-surface border border-surface relative">
        
        {/* Left Side: Photo */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-dark">
          <img 
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" 
            alt="Studio" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-serif leading-tight mb-4">Join the <br /><span className="italic text-primary">Artistic Team</span></h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Studio Administrative Onboarding</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-10 text-center lg:text-left">
              <img src="/rimpylogo.png" alt="Logo" className="h-16 md:h-20 mb-8 mx-auto lg:mx-0 w-auto object-contain" />
              <h1 className="text-3xl font-serif text-main mb-2">Create Admin</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Join the Rimpy Digital Studio workspace</p>
            </div>

            {error && (
              <m.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-widest"
              >
                {error}
              </m.div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Email Address</label>
                <div className="relative">
                  <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    placeholder="admin@rimpy.com"
                    className="w-full py-4 pl-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-main"
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full py-4 pl-10 pr-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-main"
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Admin Secret Key</label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Enter studio secret"
                    className="w-full py-4 pl-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-main font-sans"
                    required
                    onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                  />
                </div>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Required for account verification</p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="group w-full py-5 bg-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 mt-4"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></>}
              </button>

              <div className="mt-10 pt-10 border-t border-surface flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-400">
                <span>Already have access?</span>
                <Link to="/admin" className="text-primary hover:underline">Login here</Link>
              </div>
            </form>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
