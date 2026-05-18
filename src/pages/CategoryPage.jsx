import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicMovieGrid from '../components/CinematicMovieGrid';
import { motion } from 'framer-motion';
import { searchVideos } from '../services/cinematicApi';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mouseGlowRef = useRef(null);

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

  const fetchCategoryVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await searchVideos(categoryName);
      setVideos(results || []);
    } catch (error) {
      console.error(`Failed to fetch ${categoryName} videos`, error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchCategoryVideos();
    window.scrollTo(0, 0);
  }, [fetchCategoryVideos]);

  const handleVideoSelect = (video) => {
    const id = video.videoId || video.id;
    navigate(`/watch/${id}`);
  };

  const handleSearch = (q) => {
    navigate(`/search/${q}`);
  };

  const handleTagSelect = (tag) => {
    if (tag === 'Home') navigate('/');
    else navigate(`/category/${tag}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar 
        onSearch={handleSearch} 
        onTagSelect={handleTagSelect}
        searchResults={videos.slice(0, 5)}
        onVideoSelect={handleVideoSelect}
        activeTag={categoryName}
      />

      <main className="max-w-[1800px] mx-auto pt-32 pb-20 px-6 md:px-12 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
              {categoryName}
            </h1>
            <div className="h-1 w-24 bg-orange-500 rounded-full" />
          </div>

          <CinematicMovieGrid 
            movies={videos} 
            title={`Browse ${categoryName}`} 
            loading={isLoading} 
            onVideoSelect={handleVideoSelect}
          />
        </motion.div>
      </main>

      {/* Decorative Atmosphere */}
      <div className="orb w-[600px] h-[600px] bg-orange-500/5 top-[-10%] right-[-5%]" />
      <div className="orb w-[400px] h-[400px] bg-orange-900/10 bottom-[-5%] left-[-5%]" />
    </div>
  );
};

export default CategoryPage;
