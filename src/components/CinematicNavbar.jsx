import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, ChevronDown, Search, Mic, Home, Film, Tv, 
  Sparkles, Plus, Play, User, Settings, History, 
  Library, LogOut, LogIn, Menu, X, ShieldAlert 
} from 'lucide-react';
import debounce from 'lodash.debounce';

const CinematicNavbar = ({ onSearch, onTagSelect, searchResults = [], onVideoSelect, activeTag = 'Home' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(activeTag);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const profileRef = useRef(null);

  useEffect(() => {
    setActiveTab(activeTag);
  }, [activeTag]);

  // Check login state
  useEffect(() => {
    const loggedIn = localStorage.getItem('nextube_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const savedProfile = localStorage.getItem('nextube_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  }, []);

  const tabs = [
    { name: 'Home', icon: <Home size={16} />, path: '/' },
    { name: 'TV Series', icon: <Tv size={16} />, path: '/category/TV Series' },
    { name: 'Movies', icon: <Film size={16} />, path: '/category/Movies' },
    { name: 'Trending', icon: <Sparkles size={16} />, path: '/trending' },
    { name: 'Anime', icon: <Plus size={16} />, path: '/category/Anime' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (onSearch) onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    setShowResults(query.length > 0);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowResults(false);
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleTagClick = (tab) => {
    setActiveTab(tab.name);
    if (onTagSelect) {
      onTagSelect(tab.name);
    } else {
      navigate(tab.path);
    }
    setShowMobileDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nextube_logged_in');
    localStorage.removeItem('nextube_profile');
    setIsLoggedIn(false);
    setUserProfile(null);
    setShowProfileDropdown(false);
    navigate('/auth');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-10 py-6 ${
        isScrolled ? 'bg-[#0a0502]/85 backdrop-blur-3xl border-b border-white/10 py-4 shadow-2xl shadow-black/25' : 'bg-transparent'
      }`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
          
          {/* Left Side menu & branding */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowMobileDrawer(true)}
              className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/70 hover:text-orange-500 hover:bg-white/10 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                PV
              </div>
              <span className="text-2xl font-black tracking-tighter text-glow text-white group-hover:text-orange-500 transition-colors">PlayVerse</span>
            </Link>
          </div>

          {/* Interactive Search Bar center */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative">
            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-2xl flex items-center gap-4 focus-within:border-orange-500/40 focus-within:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-all group">
              <Search size={20} className="text-white/30 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setShowResults(searchQuery.length > 0)}
                placeholder="Search by title, genre, actors..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20 font-medium"
              />
              <button className="p-2 hover:bg-white/5 rounded-xl text-white/30 hover:text-orange-500 transition-all">
                <Mic size={18} />
              </button>
            </div>

            {/* Suggestions Search Dropdown */}
            <AnimatePresence>
              {showResults && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-3 glass-dark p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">Matches Found</p>
                    {searchResults.map((video) => (
                      <div 
                        key={video.videoId || video.id} 
                        onClick={() => {
                          if (onVideoSelect) onVideoSelect(video);
                          else navigate(`/watch/${video.videoId || video.id}`);
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all"
                      >
                        <div className="w-20 aspect-video rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                          <img src={video.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 animate-fade" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-orange-500 transition-colors">{video.title}</h4>
                          <p className="text-[10px] font-bold text-white/30 uppercase mt-0.5">{video.channelTitle}</p>
                        </div>
                        <Play size={16} className="ml-auto text-white/0 group-hover:text-orange-500 transition-all translate-x-2 group-hover:translate-x-0" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions, profile & tags */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Desktop Tags */}
            <div className="hidden xl:flex items-center gap-1 glass-dark p-1 rounded-2xl mr-4 border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTagClick(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.name 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Notification button */}
            <button className="relative w-12 h-12 glass rounded-2xl flex items-center justify-center group hover:border-orange-500/50 transition-all active:scale-90 cursor-pointer">
              <Bell size={20} className="text-white/60 group-hover:text-orange-500 transition-colors" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-orange-500 rounded-full border border-[#0a0502] animate-pulse" />
            </button>

            {/* Profile Menu dropdown widget */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 glass p-1.5 pr-5 rounded-2xl cursor-pointer group hover:border-orange-500/30 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-orange-500/50 transition-all">
                  <img 
                    src={isLoggedIn && userProfile ? userProfile.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{isLoggedIn ? 'Premium' : 'Guest'}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">
                      {isLoggedIn && userProfile ? userProfile.username : 'Sign In'}
                    </span>
                    <ChevronDown size={12} className="text-white/30 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Profile Dropdown box */}
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute top-full right-0 mt-3 w-56 glass-dark border border-white/10 rounded-2xl shadow-3xl overflow-hidden py-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <Link 
                          to="/profile" 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User size={16} className="text-orange-500" /> My Profile
                        </Link>
                        <Link 
                          to="/library" 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Library size={16} className="text-orange-500" /> My Library
                        </Link>
                        <Link 
                          to="/history" 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <History size={16} className="text-orange-500" /> Streaming Logs
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Settings size={16} className="text-orange-500" /> Settings
                        </Link>
                        <div className="h-px bg-white/5 my-1" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all text-left"
                        >
                          <LogOut size={16} /> Disconnect
                        </button>
                      </>
                    ) : (
                      <Link 
                        to="/auth" 
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3.5 text-xs font-black uppercase tracking-wider text-orange-500 hover:bg-white/5 transition-all"
                      >
                        <LogIn size={16} /> Connect Account
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile overlay Sidebar Drawer */}
      <AnimatePresence>
        {showMobileDrawer && (
          <div className="fixed inset-0 z-[200] flex">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileDrawer(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer list */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-full min-h-screen bg-[#0a0502]/95 border-r border-white/10 flex flex-col p-6 space-y-8 z-10"
            >
              {/* Drawer header branding */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-white text-sm">PV</div>
                  <span className="text-xl font-black tracking-tighter text-white">PlayVerse</span>
                </div>
                <button 
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile links list */}
              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-3 mb-2">Explore</p>
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => handleTagClick(tab)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                        activeTab === tab.name 
                          ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.icon}
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-3 mb-2">Library & Logs</p>
                  {isLoggedIn ? (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowMobileDrawer(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User size={16} className="text-orange-500" /> Account Dashboard
                      </Link>
                      <Link 
                        to="/library" 
                        onClick={() => setShowMobileDrawer(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Library size={16} className="text-orange-500" /> Saved Playlists
                      </Link>
                      <Link 
                        to="/history" 
                        onClick={() => setShowMobileDrawer(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <History size={16} className="text-orange-500" /> Watch Logs
                      </Link>
                      <Link 
                        to="/settings" 
                        onClick={() => setShowMobileDrawer(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings size={16} className="text-orange-500" /> settings
                      </Link>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      onClick={() => setShowMobileDrawer(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-orange-500 hover:bg-white/5 transition-all"
                    >
                      <LogIn size={16} /> Sign In
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile disconnect item */}
              {isLoggedIn && (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut size={16} /> Disconnect Account
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CinematicNavbar;
