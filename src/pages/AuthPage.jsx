import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, User, Lock, Mail, ChevronRight } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const mouseGlowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = `${e.clientX}px`;
        mouseGlowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const tempErrors = {};
    if (activeTab === 'register' && !form.name.trim()) tempErrors.name = 'Username is required';
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = 'Please provide a valid email';
    }
    if (!form.password) {
      tempErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Store user details mock login
      const mockUser = {
        username: activeTab === 'register' ? form.name : (form.email.split('@')[0]),
        email: form.email,
        tier: 'Cinema Elite',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        joined: 'May 2026',
        watchTime: '142 Hours',
        videosWatched: '520 Videos',
        playlistsCount: '6'
      };

      localStorage.setItem('nextube_profile', JSON.stringify(mockUser));
      localStorage.setItem('nextube_logged_in', 'true');
      
      // Redirect to homepage
      navigate('/');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white flex items-center justify-center p-4 selection:bg-orange-500/30 overflow-hidden">
      {/* Cinematic Atmosphere background */}
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      {/* Aesthetic Orbs */}
      <div className="orb w-[500px] h-[500px] bg-orange-500/10 top-[-10%] right-[-10%]" />
      <div className="orb w-[450px] h-[450px] bg-red-950/20 bottom-[-10%] left-[-10%]" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        {/* PlayVerse Branding */}
        <div className="text-center space-y-3 cursor-pointer" onClick={() => navigate('/')}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-orange-500 rounded-3xl flex items-center justify-center font-black text-white text-lg shadow-xl shadow-orange-500/20 mx-auto"
          >
            PV
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black tracking-tighter"
          >
            PlayVerse Stream
          </motion.h1>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.22em]">Cinematic OTT Streaming Platform</p>
        </div>

        {/* Auth form Glass Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-premium p-8 md:p-10 rounded-[3rem] border-white/5 shadow-2xl relative"
        >
          {/* Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mb-8">
            <button 
              onClick={() => { setActiveTab('login'); setErrors({}); }}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'login' ? 'bg-orange-500 text-white shadow-md' : 'text-white/40 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setErrors({}); }}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'register' ? 'bg-orange-500 text-white shadow-md' : 'text-white/40 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'register' && (
                <motion.div 
                  key="username-input"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Display Name</label>
                  <div className="relative bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 focus-within:border-orange-500/40 transition-all">
                    <User size={16} className="text-white/30" />
                    <input 
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.name}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Email Address</label>
              <div className="relative bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 focus-within:border-orange-500/40 transition-all">
                <Mail size={16} className="text-white/30" />
                <input 
                  type="email" 
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20 font-medium"
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Password</label>
              <div className="relative bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 focus-within:border-orange-500/40 transition-all">
                <Lock size={16} className="text-white/30" />
                <input 
                  type="password" 
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20 font-medium"
                />
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] text-xs uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === 'login' ? 'Access Account' : 'Initialize Account'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Premium tier promise statement */}
          <div className="mt-8 flex items-center gap-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
            <Shield size={18} className="text-orange-500 flex-shrink-0" />
            <p className="text-[9px] text-white/50 leading-relaxed font-medium">
              We encrypt authorization parameters locally. Your visual analytics and watch histories belong exclusively to your local device.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
