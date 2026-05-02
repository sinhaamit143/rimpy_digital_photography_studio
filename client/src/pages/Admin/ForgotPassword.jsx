import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Key, CheckCircle, Mail, Hash } from 'lucide-react';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({ token: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [debugToken, setDebugToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.debugToken) {
        setDebugToken(res.data.debugToken);
        setResetData({ ...resetData, token: res.data.debugToken });
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', resetData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Token might be invalid or expired.');
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
              <h4 className="text-3xl font-serif text-white italic">Password Reset</h4>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Account secured. Redirecting to Login...</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      
      <Link 
        to="/admin" 
        className="absolute top-8 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-dark/40 hover:text-primary transition-colors group z-50"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Login
      </Link>

      <div className="w-full max-w-[1100px] h-auto lg:min-h-[700px] flex shadow-2xl rounded-sm overflow-hidden bg-white border border-gray-100 relative">
        
        {/* Left Side: Photo */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-dark">
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200" 
            alt="Studio" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-serif leading-tight mb-4">Restore Your <br /><span className="italic text-primary">Access</span></h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Secure Account Recovery Protocol</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
          <m.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-10 text-center lg:text-left">
              <img src="/logo_rdps.png" alt="Logo" className="h-10 mb-8 mx-auto lg:mx-0" />
              <h1 className="text-3xl font-serif text-dark mb-2">
                {step === 1 ? 'Recover Password' : 'Reset Password'}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {step === 1 ? 'Enter your email to receive a reset token' : 'Use your token to set a new security code'}
              </p>
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

            {step === 1 ? (
              <form onSubmit={handleRequestToken} className="space-y-8">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@rimpy.com"
                      className="w-full py-4 pl-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-dark"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-5 bg-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Request Token <Key size={14} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-8">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Reset Token</label>
                  <div className="relative">
                    <Hash size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Enter the 64-char token"
                      className="w-full py-4 pl-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-dark font-sans text-xs"
                      required
                      value={resetData.token}
                      onChange={(e) => setResetData({...resetData, token: e.target.value})}
                    />
                  </div>
                  {debugToken && <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Debug: Token auto-filled from server response</p>}
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full py-4 pl-10 pr-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-dark"
                      required
                      onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
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

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-5 bg-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Update Password <ArrowRight size={14} /></>}
                </button>
                
                <button type="button" onClick={() => setStep(1)} className="w-full text-[9px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors">
                  Didn't get a token? Try again
                </button>
              </form>
            )}

            <div className="mt-10 pt-10 border-t border-gray-100 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-400">
              <span>Remembered your password?</span>
              <Link to="/admin" className="text-primary hover:underline">Go back to login</Link>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
