import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, User, Lock, Mail, ChevronRight } from 'lucide-react';
import axios from 'axios';
import playButtonImg from '../assets/play-button.png';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If VITE_API_URL points to localhost, but we're accessing from another device (e.g. local network IP)
    if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return envUrl.replace('localhost', hostname).replace('127.0.0.1', hostname);
      }
      return envUrl;
    }
    
    // Fallback if VITE_API_URL is not defined
    if (!envUrl) {
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
      }
      // If accessing via local IP, point to port 5000 on the same host IP
      if (/^[0-9.]+$/.test(hostname) || hostname.endsWith('.local')) {
        return `http://${hostname}:5000/api`;
      }
      return '/api';
    }
  }
  
  return envUrl || '/api';
};

const API_URL = getApiUrl();

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
    setErrors({ ...errors, [e.target.name]: '', server: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    const normalizedEmail = form.email.trim().toLowerCase();

    try {
      if (activeTab === 'register') {
        // 1. Try Backend API for Sign Up
        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            username: form.name,
            email: normalizedEmail,
            password: form.password
          });
          
          if (response.data.success) {
            const registeredUser = response.data.user;
            localStorage.setItem('nextube_profile', JSON.stringify(registeredUser));
            localStorage.setItem('nextube_logged_in', 'true');
            navigate('/');
            return;
          }
        } catch (apiError) {
          // If the backend specifically rejected with 400 (e.g. duplicate user), show that exact error
          if (apiError.response && apiError.response.status === 400) {
            const msg = apiError.response.data?.error || 'User with this email already exists';
            setErrors({ server: msg });
            setLoading(false);
            return;
          }
          // If connection was refused or general network error, trigger LocalStorage fallback DB
          console.warn("API Register failed, trying client-side LocalStorage DB fallback:", apiError.message);
          throw apiError;
        }
      } else {
        // 2. Try Backend API for Sign In
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: normalizedEmail,
            password: form.password
          });
          
          if (response.data.success) {
            const loggedInUser = response.data.user;
            localStorage.setItem('nextube_profile', JSON.stringify(loggedInUser));
            localStorage.setItem('nextube_logged_in', 'true');
            navigate('/');
            return;
          }
        } catch (apiError) {
          // If the backend explicitly returned a 401/400 validation error, display it directly
          if (apiError.response && (apiError.response.status === 401 || apiError.response.status === 400)) {
            const msg = apiError.response.data?.error || 'Invalid email or password';
            setErrors({ server: msg });
            setLoading(false);
            return;
          }
          console.warn("API Login failed, trying client-side LocalStorage DB fallback:", apiError.message);
          throw apiError;
        }
      }
    } catch (fallbackTrigger) {
      // client-side LocalStorage DB Fallback
      const localUsers = JSON.parse(localStorage.getItem('nextube_local_users') || '[]');
      
      // Seed seeded user from users.json if the list is empty
      if (localUsers.length === 0) {
        localUsers.push({
          username: "sri",
          email: "reachsrimurugan@gmail.com",
          password: "password123",
          tier: "Cinema Elite",
          avatar: "src/assets/man1.png",
          joined: "May 2026"
        });
        localStorage.setItem('nextube_local_users', JSON.stringify(localUsers));
      }

      if (activeTab === 'register') {
        const exists = localUsers.some(u => u.email.toLowerCase() === normalizedEmail);
        if (exists) {
          setErrors({ server: 'User with this email already exists' });
          setLoading(false);
          return;
        }

        const newUser = {
          username: form.name,
          email: normalizedEmail,
          password: form.password,
          tier: 'Cinema Elite',
          avatar: 'src/assets/man1.png',
          joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };

        localUsers.push(newUser);
        localStorage.setItem('nextube_local_users', JSON.stringify(localUsers));
        localStorage.setItem('nextube_profile', JSON.stringify(newUser));
        localStorage.setItem('nextube_logged_in', 'true');
        navigate('/');
      } else {
        const user = localUsers.find(
          u => u.email.toLowerCase() === normalizedEmail && u.password === form.password
        );
        
        if (!user) {
          setErrors({ server: 'Invalid email or password' });
          setLoading(false);
          return;
        }

        localStorage.setItem('nextube_profile', JSON.stringify(user));
        localStorage.setItem('nextube_logged_in', 'true');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
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
            className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-orange-500/25 mx-auto overflow-hidden p-2 border border-white/10"
          >
            <img 
              src={playButtonImg} 
              alt="PlayVerse" 
              className="w-full h-full object-contain" 
            />
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
            {errors.server && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
                {errors.server}
              </div>
            )}
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
