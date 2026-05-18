import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicMovieGrid from '../components/CinematicMovieGrid';
import { searchVideos } from '../services/cinematicApi';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await searchVideos(searchTerm);
        setVideos(results || []);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleVideoSelect = (video) => {
    const id = video.videoId || video.id;
    navigate(`/watch/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar 
        onSearch={(q) => navigate(`/search/${q}`)} 
        searchResults={videos.slice(0, 5)}
        onVideoSelect={handleVideoSelect}
      />

      <main className="max-w-[1800px] mx-auto pt-32 pb-20 px-4 md:px-10">
        <CinematicMovieGrid 
          movies={videos} 
          title={`Search Results: ${searchTerm}`} 
          loading={isLoading} 
          onVideoSelect={handleVideoSelect}
        />
      </main>
    </div>
  );
};

export default SearchResults;
