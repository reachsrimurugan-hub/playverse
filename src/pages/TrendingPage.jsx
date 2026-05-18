import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicMovieGrid from '../components/CinematicMovieGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrendingTrailers } from '../services/cinematicApi';
import { Flame, Sparkles, TrendingUp, Award } from 'lucide-react';

const TrendingPage = () => {
  const navigate = useNavigate();
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [heroVideo, setHeroVideo] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const results = await getTrendingTrailers();
        if (results && results.length > 0) {
          setHeroVideo(results[0]);
          setTrendingVideos(results.slice(1));
        }
      } catch (error) {
        console.error('Failed to fetch trending videos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    window.scrollTo(0, 0);
  }, []);

  const handleVideoSelect = (video) => {
    const id = video.videoId || video.id;
    navigate(`/watch/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      {/* Atmospheric Orbs */}
      <div className="orb w-[600px] h-[600px] bg-red-600/10 top-[-10%] right-[-10%]" />
      <div className="orb w-[500px] h-[500px] bg-orange-950/20 bottom-[-10%] left-[-10%]" />

      <CinematicNavbar 
        onSearch={(q) => navigate(`/search/${q}`)}
        searchResults={trendingVideos.slice(0, 5)}
        onVideoSelect={handleVideoSelect}
        activeTag="Trending"
      />

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-10 max-w-[1800px] mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-orange-500">
              <Flame size={28} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">Realtime Ranking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Trending Content
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full" />
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl">
            <TrendingUp className="text-orange-500" size={20} />
            <div className="text-left">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">Top Category</p>
              <p className="text-xs font-bold text-white">Gaming & Entertainment</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full"
            />
            <p className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">
              Analyzing Global Trends
            </p>
          </div>
        ) : (
          <>
            {/* Top Trending Feature */}
            <AnimatePresence>
              {heroVideo && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleVideoSelect(heroVideo)}
                >
                  <div className="relative w-full aspect-[21/9] min-h-[350px] max-h-[500px] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 shadow-3xl">
                    <img 
                      src={heroVideo.thumbnail} 
                      alt={heroVideo.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0502]/95 via-[#0a0502]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                          <Award size={12} />
                          Number 1
                        </div>
                        <span className="text-xs text-white/50 font-bold uppercase tracking-wider">
                          {parseInt(heroVideo.views).toLocaleString()} Views
                        </span>
                      </div>
                      
                      <div className="max-w-2xl space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
                          {heroVideo.title}
                        </h2>
                        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                          {heroVideo.description}
                        </p>
                      </div>
                      
                      <button className="w-fit mt-4 bg-orange-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
                        Stream Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trending Grid */}
            <CinematicMovieGrid 
              movies={trendingVideos} 
              title="Rising Fast"
              loading={loading}
              onVideoSelect={handleVideoSelect}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default TrendingPage;
