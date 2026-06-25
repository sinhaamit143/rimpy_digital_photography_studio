import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, HelpCircle } from 'lucide-react';
import api from '../../utils/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user } = response.data;

      // Import setAccessToken to save it in memory
      const { setAccessToken } = await import('../../utils/api');
      setAccessToken(accessToken);

      localStorage.setItem('user', JSON.stringify(user));

      setIsAuthenticating(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 md:p-10 relative">
      <AnimatePresence>
        {isAuthenticating && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-32 h-32 border-2 border-primary/20 border-t-primary rounded-full shadow-2xl shadow-primary/20" />
              <img src="/logo_rdps2.png" className="w-12 absolute inset-0 m-auto brightness-0 invert opacity-60" alt="Logo" />
            </div>
            <div className="text-center space-y-3">
              <h4 className="text-2xl font-serif text-white italic">Verifying Credentials</h4>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold animate-pulse">Initializing Studio Workspace...</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Back to Website - Floating Button */}
      <Link
        to="/home"
        className="absolute top-8 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:text-primary transition-all group z-50 bg-dark/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Website
      </Link>

      <div className="w-full max-w-[1100px] h-auto lg:h-[700px] flex shadow-2xl rounded-sm overflow-hidden bg-surface border border-surface relative">

        {/* Left Side: Photo */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-dark">
          <img
            src="/rimpyshop.webp"
            alt="Studio"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-serif leading-tight mb-4">Quality Since <br /><span className="italic text-primary">2004</span></h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Admin Management Portal</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-12 text-center lg:text-left">
              <div className="inline-block p-4 bg-white/5 rounded-xl border border-white/10 mb-8 mx-auto lg:mx-0">
                <img src="/inverselogo.png" alt="Logo" className="h-14 md:h-16 w-auto object-contain" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-main mb-3 leading-tight">Welcome <span className="italic text-primary">Back</span></h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Authorized Personnel Only</p>
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

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Email Address</label>
                <div className="relative">
                  <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full py-4 pl-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-main"
                    required
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Security Code</label>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full py-4 pl-10 pr-10 bg-transparent border-b border-primary/10 focus:border-primary transition-all outline-none text-main"
                    required
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Enter Dashboard <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></>}
              </button>

              <div className="mt-10 pt-10 border-t border-surface flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-400">
                <HelpCircle size={14} />
                <span>Authorized Personnel Only. Contact admin for access.</span>
              </div>
            </form>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

