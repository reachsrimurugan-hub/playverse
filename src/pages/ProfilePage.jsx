import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Calendar, Sparkles, Award, Clock, Play } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: 'Alex Smith',
    email: 'alex.smith@playverse.tv',
    tier: 'Cinema Elite',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    joined: 'May 2026',
    watchTime: '142 Hours',
    videosWatched: '520 Videos',
    playlistsCount: '6'
  });
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(profile.username);
  const [editedEmail, setEditedEmail] = useState(profile.email);
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

  // Load profile from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem('nextube_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(prev => ({ ...prev, ...parsed }));
      setEditedName(parsed.username || profile.username);
      setEditedEmail(parsed.email || profile.email);
    }
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    const updated = { ...profile, username: editedName, email: editedEmail };
    setProfile(updated);
    localStorage.setItem('nextube_profile', JSON.stringify(updated));
    setEditMode(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 lg:px-16 xl:px-24 max-w-[1200px] mx-auto space-y-12">
        {/* Profile Card Widescreen */}
        <div className="relative glass-premium p-8 md:p-12 rounded-[3.5rem] border-white/5 shadow-2xl overflow-hidden">
          {/* Decorative Back Orbs */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-800/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar block */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border border-white/10">
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-orange-500 text-white font-mono text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg shadow-orange-500/30">
                Premium
              </div>
            </div>

            {/* User Info details */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{profile.username}</h2>
                <div className="flex items-center gap-1.5 glass-orange px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-orange-500 border-orange-500/20">
                  <ShieldCheck size={12} />
                  {profile.tier}
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-orange-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-orange-500" />
                  <span>Member Since {profile.joined}</span>
                </div>
              </div>

              <div className="pt-2">
                {editMode ? (
                  <form onSubmit={saveProfile} className="space-y-4 max-w-md mx-auto lg:mx-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={editedName} 
                        onChange={(e) => setEditedName(e.target.value)} 
                        className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orange-500 transition-all font-semibold"
                        placeholder="Display Name"
                        required
                      />
                      <input 
                        type="email" 
                        value={editedEmail} 
                        onChange={(e) => setEditedEmail(e.target.value)} 
                        className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orange-500 transition-all font-semibold"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow-lg shadow-orange-500/20">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditMode(false)} className="bg-white/5 border border-white/10 text-white/60 font-bold px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-wider hover:text-white">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="glass-button px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider"
                  >
                    Edit Profile Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Watch Time stat */}
          <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-[30px] rounded-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-mono">Engagement</span>
              <Clock className="text-orange-500" size={20} />
            </div>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Total Watch Time</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{profile.watchTime}</h3>
          </div>

          {/* Videos Watched stat */}
          <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[30px] rounded-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-mono">Activity</span>
              <Play className="text-red-500" size={20} />
            </div>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Streams Viewed</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{profile.videosWatched}</h3>
          </div>

          {/* Saved Playlists stat */}
          <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[30px] rounded-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-mono">Collections</span>
              <Award className="text-amber-500" size={20} />
            </div>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Active Playlists</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{profile.playlistsCount}</h3>
          </div>
        </div>

        {/* Premium Level Showcase */}
        <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none" />
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 text-orange-500 justify-center md:justify-start">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">PlayVerse Member Club</span>
            </div>
            <h3 className="text-xl font-bold">You are in the premium tier, alex!</h3>
            <p className="text-xs text-white/40 max-w-lg leading-relaxed">
              Enjoy ad-free cinema-grade streaming, early access to new video trailers, and high-fidelity HDR quality settings across all devices.
            </p>
          </div>
          <div className="w-fit text-center border border-white/10 px-8 py-5 rounded-3xl bg-white/5 backdrop-blur-xl">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
            <span className="text-sm font-black text-orange-500 uppercase tracking-widest">Active Partner</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
