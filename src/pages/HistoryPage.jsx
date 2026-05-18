import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, History, Play, AlertCircle } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('nextube_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const deleteEntry = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('nextube_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire watch history?")) {
      setHistory([]);
      localStorage.removeItem('nextube_history');
    }
  };

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.channelTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoSelect = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-10 max-w-[1400px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-orange-500">
              <History size={24} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">Watch Logs</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Watch History</h1>
            <div className="h-1.5 w-24 bg-orange-500 rounded-full" />
          </div>

          {history.length > 0 && (
            <button 
              onClick={clearAllHistory}
              className="flex items-center gap-2 bg-red-600/10 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-500 px-6 py-3.5 rounded-2xl transition-all shadow-lg w-fit active:scale-95 text-xs font-bold uppercase tracking-wider"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}
        </div>

        {/* Search History */}
        {history.length > 0 && (
          <div className="relative max-w-md w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 focus-within:border-orange-500/40 transition-all">
            <Search size={18} className="text-white/30" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watch history..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20 font-medium"
            />
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <motion.div
                key={`${item.id}_${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 rounded-3xl glass-premium border-white/5 hover:border-orange-500/30 transition-all cursor-pointer relative"
                onClick={() => handleVideoSelect(item.id)}
              >
                <div className="flex gap-4 min-w-0 w-full md:w-auto">
                  <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <Play size={18} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 font-semibold">{item.channelTitle}</p>
                    {item.watchedAt && (
                      <p className="text-[10px] text-white/20 mt-2 font-bold uppercase tracking-wider">
                        Watched on {new Date(item.watchedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(item.id);
                  }}
                  className="p-3 bg-white/5 border border-white/5 rounded-2xl text-white/30 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all self-end md:self-auto"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-premium p-20 rounded-[3rem] text-center max-w-md mx-auto border-white/5"
            >
              <AlertCircle size={36} className="text-orange-500 mx-auto mb-6 animate-pulse" />
              <h3 className="text-lg font-bold mb-2">No history logs</h3>
              <p className="text-white/30 text-xs leading-relaxed mb-6">
                {searchQuery ? 'No search results match your criteria.' : 'Videos you stream on PlayVerse will show up here.'}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Explore Now
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
