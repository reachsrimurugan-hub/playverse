import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicHero from '../components/CinematicHero';
import CinematicMovieGrid from '../components/CinematicMovieGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrendingTrailers, getPopularMovies, searchVideos } from '../services/cinematicApi';
import { Sparkles, Compass, Star, ChevronRight } from 'lucide-react';

const DASHBOARD_CATEGORIES = [
  'All',
  'Trending',
  'Music',
  'Gaming',
  'Podcasts',
  'Educational',
  'Live Streams',
  'Vlogs',
  'Tech',
  'Sports',
  'News',
  'Anime',
  'Web Series'
];

const CinematicDashboard = () => {
  const navigate = useNavigate();
  const [heroVideo, setHeroVideo] = useState(null);
  
  // Video lists & Infinite load
  const [allVideos, setAllVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loading, setLoading] = useState(true);
  
  // Query & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const mouseGlowRef = useRef(null);

  // Mouse Follow Glow Effect
  useEffect(() => {
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    if (!isHoverDevice) return;

    const handleMouseMove = (e) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = `${e.clientX}px`;
        mouseGlowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch Videos with dynamic category and query
  const fetchDashboardContent = useCallback(async (category = 'All', searchVal = '') => {
    setLoading(true);
    setVisibleCount(15); // Reset visible items on new query
    try {
      let results = [];
      if (searchVal) {
        results = await searchVideos(searchVal);
      } else if (category === 'All' || category === 'Trending') {
        // Fetch trending/popular lists (Backend caches these!)
        const popular = await getPopularMovies();
        results = popular || [];
        
        // Use #1 video as Featured Hero Banner
        if (popular && popular.length > 0 && !heroVideo) {
          setHeroVideo(popular[0]);
        }
      } else {
        // Fetch specific categories unrestricted globally
        results = await searchVideos(category);
      }
      setAllVideos(results);
    } catch (error) {
      console.error("Failed to fetch dashboard content", error);
    } finally {
      setLoading(false);
    }
  }, [heroVideo]);

  useEffect(() => {
    fetchDashboardContent(activeCategory, searchQuery);
  }, []);

  // Memoize visible slices of videos to optimize re-renders
  const displayedVideos = useMemo(() => {
    return allVideos.slice(0, visibleCount);
  }, [allVideos, visibleCount]);

  const hasMoreVideos = useMemo(() => {
    return visibleCount < allVideos.length;
  }, [visibleCount, allVideos]);

  const handleVideoSelect = useCallback((video) => {
    const id = video.videoId || video.id;
    navigate(`/watch/${id}`);
  }, [navigate]);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setActiveCategory('All');
    fetchDashboardContent('All', query);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    fetchDashboardContent(category, '');
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 15);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      {/* Dynamic atmospheric layer */}
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />
      
      {/* Ambient Radial Lights */}
      <div className="orb w-[700px] h-[700px] bg-orange-600/5 top-[-10%] right-[-10%]" />
      <div className="orb w-[550px] h-[550px] bg-red-950/15 bottom-[-10%] left-[-15%]" />

      <CinematicNavbar 
        onSearch={handleSearchSubmit} 
        searchResults={searchQuery ? allVideos.slice(0, 5) : []}
        onVideoSelect={handleVideoSelect}
        activeTag={activeCategory}
      />

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 lg:px-16 xl:px-24 max-w-[1800px] mx-auto space-y-16 md:space-y-24">
        {/* Widescreen Hero Trailer Banner */}
        <AnimatePresence mode="wait">
          {!searchQuery && activeCategory === 'All' && heroVideo && (
            <motion.div
              key="featured-hero"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
            >
              <CinematicHero video={heroVideo} onPlay={handleVideoSelect} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrolling Category Pill Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-500">
            <Compass size={16} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] font-mono">Stream Categories</span>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 select-none scrollbar-none custom-scrollbar">
            {DASHBOARD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Video Grid Catalog */}
        <div className="space-y-10">
          <CinematicMovieGrid 
            movies={displayedVideos} 
            title={
              searchQuery 
                ? `Search Matches for "${searchQuery}"` 
                : activeCategory === 'All' 
                  ? "Featured Recommendations" 
                  : `${activeCategory} Streams`
            }
            loading={loading}
            onVideoSelect={handleVideoSelect}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreVideos}
          />

          {!loading && displayedVideos.length === 0 && (
            <div className="glass-premium p-24 rounded-[3.5rem] text-center border-white/5 max-w-lg mx-auto">
              <Star size={32} className="text-orange-500 mx-auto mb-6 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">No videos discovered</h3>
              <p className="text-white/30 text-xs leading-relaxed mb-8">
                We couldn't retrieve results matching your current settings. Feel free to explore other premium categories or input a search term.
              </p>
              <button 
                onClick={() => handleCategorySelect('All')}
                className="bg-orange-500 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all cursor-pointer"
              >
                Reset Exploration
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Sparkles decorative button - Hidden on Mobile to prevent overlap with Bottom Nav */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-25 animate-pulse" />
          <button className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/20 border-orange-500/20 hover:scale-105 active:scale-95 transition-all">
            <Sparkles size={18} className="animate-pulse" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CinematicDashboard;
