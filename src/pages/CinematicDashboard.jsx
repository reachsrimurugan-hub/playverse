import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicHero from '../components/CinematicHero';
import CinematicMovieGrid from '../components/CinematicMovieGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrendingTrailers, getPopularMovies, searchVideos } from '../services/cinematicApi';
import { useSidebar } from '../context/SidebarContext';
import { Sparkles } from 'lucide-react';

const CinematicDashboard = () => {
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const [heroVideo, setHeroVideo] = useState(null);
  const [popularVideos, setPopularVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('Home');
  
  const mouseGlowRef = useRef(null);

  // Mouse Follow Glow Effect
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

  const fetchData = useCallback(async (tag = 'Home', query = '') => {
    setLoading(true);
    try {
      let results = [];
      if (query) {
        results = await searchVideos(query);
      } else {
        const trending = await getTrendingTrailers();
        if (trending && trending.length > 0) setHeroVideo(trending[0]);
        results = await getPopularMovies();
      }
      setPopularVideos(results);
      setFilteredVideos(results);
    } catch (error) {
      console.error("Failed to fetch cinematic data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVideoSelect = (video) => {
    const id = video.videoId || video.id;
    navigate(`/watch/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredVideos(popularVideos);
      return;
    }
    fetchData(activeTag, query);
  };

  const handleTagSelect = (tag) => {
    if (tag === 'Home') {
      setActiveTag('Home');
      fetchData('Home');
    } else {
      navigate(`/category/${tag}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />
      
      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] bg-orange-600/10 top-[-20%] right-[-10%]" />
      <div className="orb w-[500px] h-[500px] bg-orange-900/20 bottom-[-10%] left-[-10%]" />

      <CinematicNavbar 
        onSearch={handleSearch} 
        onTagSelect={handleTagSelect} 
        searchResults={searchQuery ? filteredVideos.slice(0, 5) : []}
        onVideoSelect={handleVideoSelect}
        activeTag={activeTag}
      />

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-10">
        <div className="max-w-[1800px] mx-auto space-y-16">
          {loading && !popularVideos.length ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full"
              />
              <p className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">Initializing PlayVerse</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {!searchQuery && activeTag === 'Home' && heroVideo && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                  >
                    <CinematicHero video={heroVideo} onPlay={handleVideoSelect} />
                  </motion.div>
                )}
              </AnimatePresence>

              <CinematicMovieGrid 
                movies={filteredVideos} 
                title={searchQuery ? `Results for "${searchQuery}"` : activeTag === 'Home' ? "Featured for You" : activeTag}
                loading={loading}
                onVideoSelect={handleVideoSelect}
              />

              {!loading && filteredVideos.length === 0 && (
                <div className="glass-premium p-20 rounded-[3rem] text-center border-white/5">
                  <h3 className="text-xl font-bold text-white mb-2">No videos found</h3>
                  <p className="text-white/30 text-sm">Try searching for something else or explore a different category.</p>
                  <button 
                    onClick={() => fetchData()}
                    className="mt-6 glass-button px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-orange-500"
                  >
                    Retry Loading
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Atmospheric Pulse Icon */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/20 border-orange-500/30">
            <Sparkles size={20} className="animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicDashboard;
