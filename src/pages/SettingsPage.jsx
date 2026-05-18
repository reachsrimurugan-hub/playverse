import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import { useLanguage, languages } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Settings, Sliders, Globe, Eye, Zap, Shield } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    autoPlay: true,
    subtitlesEnabled: false,
    defaultQuality: '1080p',
    cinemaGrain: true,
    mouseGlow: true,
    glowIntensity: 'medium',
    hardwareAcceleration: true,
    dataSaver: false
  });
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

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nextube_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = (updated) => {
    setSettings(updated);
    localStorage.setItem('nextube_settings', JSON.stringify(updated));
  };

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    saveSettings(updated);
  };

  const handleSelectChange = (key, val) => {
    const updated = { ...settings, [key]: val };
    saveSettings(updated);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-10 max-w-[1000px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-orange-500">
            <Settings size={24} className="animate-spin-slow" />
            <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">Control Panel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">System Settings</h1>
          <div className="h-1.5 w-24 bg-orange-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Navigation Sidebar inside page */}
          <div className="md:col-span-1 space-y-3">
            <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-4">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] font-mono mb-4">Categories</h3>
              
              <a href="#playback" className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 text-orange-500 font-bold border border-white/10 text-sm transition-all">
                <Sliders size={16} />
                Playback Settings
              </a>
              <a href="#appearance" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-white/60 hover:text-white border border-transparent hover:border-white/5 text-sm transition-all">
                <Eye size={16} />
                Atmosphere & UI
              </a>
              <a href="#performance" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-white/60 hover:text-white border border-transparent hover:border-white/5 text-sm transition-all">
                <Zap size={16} />
                Performance & Hardware
              </a>
            </div>
          </div>

          {/* Setting Options panels */}
          <div className="md:col-span-2 space-y-8">
            {/* Playback Settings */}
            <section id="playback" className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-orange-500 mb-2">
                <Sliders size={20} />
                <h3 className="font-bold text-lg text-white">Playback Configuration</h3>
              </div>
              <div className="h-px bg-white/5" />

              {/* Autoplay toggling */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Auto-Play Videos</p>
                  <p className="text-xs text-white/40 leading-relaxed">Stream next recommendation automatically when video ends.</p>
                </div>
                <button 
                  onClick={() => handleToggle('autoPlay')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.autoPlay ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Subtitles toggling */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Closed Captions (CC)</p>
                  <p className="text-xs text-white/40 leading-relaxed">Show translations and subtitles on video stream if available.</p>
                </div>
                <button 
                  onClick={() => handleToggle('subtitlesEnabled')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.subtitlesEnabled ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Quality Settings Selection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Default Resolution</p>
                  <p className="text-xs text-white/40 leading-relaxed">Set preferred video streaming quality when loading players.</p>
                </div>
                <select 
                  value={settings.defaultQuality}
                  onChange={(e) => handleSelectChange('defaultQuality', e.target.value)}
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white outline-none focus:border-orange-500 cursor-pointer"
                >
                  {['Auto', '4K', '1080p', '720p', '480p'].map(q => (
                    <option key={q} value={q} className="bg-[#0a0502] text-white">{q}</option>
                  ))}
                </select>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Application Language</p>
                  <p className="text-xs text-white/40 leading-relaxed">Select your default translation language for PlayVerse.</p>
                </div>
                <select 
                  value={selectedLanguage.code}
                  onChange={(e) => {
                    const matched = languages.find(l => l.code === e.target.value);
                    if (matched) setSelectedLanguage(matched);
                  }}
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white outline-none focus:border-orange-500 cursor-pointer"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code} className="bg-[#0a0502] text-white">{l.name}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Atmosphere & UI Settings */}
            <section id="appearance" className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-orange-500 mb-2">
                <Eye size={20} />
                <h3 className="font-bold text-lg text-white">Atmosphere & Interface</h3>
              </div>
              <div className="h-px bg-white/5" />

              {/* Grain Overlay toggling */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Cinematic Grain Overlay</p>
                  <p className="text-xs text-white/40 leading-relaxed">Enable aesthetic micro-grain motion filter over user interface.</p>
                </div>
                <button 
                  onClick={() => handleToggle('cinemaGrain')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.cinemaGrain ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Mouse Glow effect toggling */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Interactive Mouse Follower</p>
                  <p className="text-xs text-white/40 leading-relaxed">Turn on the dynamic orange atmospheric light following mouse movement.</p>
                </div>
                <button 
                  onClick={() => handleToggle('mouseGlow')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.mouseGlow ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </section>

            {/* Performance Settings */}
            <section id="performance" className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-orange-500 mb-2">
                <Zap size={20} />
                <h3 className="font-bold text-lg text-white">Performance Optimizations</h3>
              </div>
              <div className="h-px bg-white/5" />

              {/* GPU acceleration */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Hardware GPU Acceleration</p>
                  <p className="text-xs text-white/40 leading-relaxed">Utilize local device hardware acceleration for smoother Framer animations.</p>
                </div>
                <button 
                  onClick={() => handleToggle('hardwareAcceleration')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.hardwareAcceleration ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Data Saver Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Bandwidth Data Saver</p>
                  <p className="text-xs text-white/40 leading-relaxed">Optimize buffer speeds and set player qualities to lower resolutions automatically.</p>
                </div>
                <button 
                  onClick={() => handleToggle('dataSaver')}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${settings.dataSaver ? 'bg-orange-500 justify-end shadow-md shadow-orange-500/20' : 'bg-white/10 justify-start'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
