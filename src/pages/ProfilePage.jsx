import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import { motion } from 'framer-motion';
import { 
  User, CreditCard, Receipt, History, Library, Settings, 
  LogOut, ChevronRight, Volume2, Shield, Bell, Globe, Eye, Pencil 
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: 'sri',
    email: 'reachsrimurugan@gmail.com',
    tier: 'PREMIUM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    joined: 'May 2026'
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Profile');

  useEffect(() => {
    const loggedIn = localStorage.getItem('nextube_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
    const saved = localStorage.getItem('nextube_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nextube_logged_in');
    localStorage.removeItem('nextube_profile');
    setIsLoggedIn(false);
    navigate('/');
  };

  const menuItems = [
    { label: 'Profile', icon: <User size={16} /> },
    { label: 'Subscription', icon: <CreditCard size={16} /> },
    { label: 'Billing', icon: <Receipt size={16} /> },
    { label: 'Watch History', icon: <History size={16} />, path: '/history' },
    { label: 'My List', icon: <Library size={16} />, path: '/library' },
    { label: 'Settings', icon: <Settings size={16} />, path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24 lg:pb-10">
      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-[4.5rem] lg:pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <p className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider px-1">Account</p>
            <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-2 space-y-0.5">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                      activeMenu === item.label
                        ? 'bg-[#f97316]/15 text-[#f97316]'
                        : 'text-[#8e8e93] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <div className="lg:col-span-8 space-y-8 text-left">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-6">Profile</h1>
            </div>

            {/* Profile Detail Card exactly like mockup */}
            <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5 w-full sm:w-auto">
                {/* Circular Profile Avatar */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full blur-md opacity-20" />
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 relative z-10">
                    <img 
                      src={profile.avatar} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name / Email / Tier Info Row */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white truncate">{profile.username}</h2>
                    
                    {/* Orange status label + PREMIUM badge */}
                    <span className="bg-[#f97316] text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded">
                      {profile.tier}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white/40 truncate">{profile.email}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                    Member since {profile.joined}
                  </p>
                </div>
              </div>

              {/* Edit button */}
              <button className="flex-shrink-0 w-full sm:w-auto px-5 py-3 rounded-full border border-white/10 hover:border-white/20 text-xs font-black uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2">
                <Pencil size={12} />
                Edit Profile
              </button>
            </div>

            {/* Preferences block exactly like mockup */}
            <div className="space-y-4">
              <h3 className="text-lg font-black tracking-tight text-white uppercase tracking-wider font-mono">Preferences</h3>
              <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
                {[
                  { label: 'Playback Settings', icon: <Volume2 size={16} className="text-orange-500" /> },
                  { label: 'Parental Controls', icon: <Shield size={16} className="text-orange-500" /> },
                  { label: 'Notifications', icon: <Bell size={16} className="text-orange-500" /> },
                  { label: 'Language', icon: <Globe size={16} className="text-orange-500" />, detail: 'English' },
                  { label: 'App Appearance', icon: <Eye size={16} className="text-orange-500" />, detail: 'Dark' }
                ].map((pref) => (
                  <div 
                    key={pref.label} 
                    className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        {pref.icon}
                      </div>
                      <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                        {pref.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                      {pref.detail && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">
                          {pref.detail}
                        </span>
                      )}
                      <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
