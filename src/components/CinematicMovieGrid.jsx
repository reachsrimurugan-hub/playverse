import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const MovieCard = ({ movie, index, onSelect }) => {
  // Safe default fallback thumbnail (sleek, high-quality cinematic abstract banner)
  const fallbackThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';

  // Use normalized data properties or fallback
  const id = movie.videoId || movie.id;
  const title = movie.title || 'Untitled Video';
  const thumbnail = movie.thumbnail || 
                    movie.thumbnails?.high?.url || 
                    movie.thumbnails?.medium?.url || 
                    fallbackThumbnail;
  const channel = movie.channelTitle || 'Unknown Creator';
  const views = movie.views ? parseInt(movie.views) : 0;
  
  // Format views count cleanly
  const formatViews = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num > 0 ? num.toString() : '0';
  };

  return (
    <div
      className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 md:hover:-translate-y-1"
      onClick={() => onSelect && onSelect(movie)}
    >
      {/* 16:9 Landscape Card with hover scale */}
      <div className="relative aspect-video rounded-[1.5rem] overflow-hidden shadow-lg border border-white/5 bg-white/5 flex-shrink-0">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackThumbnail;
          }}
        />
        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={18} fill="currentColor" className="ml-1" />
          </div>
        </div>
      </div>
      
      {/* Readability Metadata underneath card */}
      <div className="space-y-1.5 px-1.5 flex-1 flex flex-col justify-between">
        <h4 className="text-white font-bold text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
          {title}
        </h4>
        <div className="flex items-center justify-between text-[10px] font-black text-white/40 uppercase tracking-widest mt-auto">
          <span className="truncate max-w-[120px]">{channel}</span>
          {views > 0 && <span>{formatViews(views)} views</span>}
        </div>
      </div>
    </div>
  );
};

const CinematicMovieGrid = ({ movies, title = "Popular Videos", loading = false, onVideoSelect, onLoadMore, hasMore = true }) => {
  const displayMovies = movies?.length > 0 ? movies : [];

  return (
    <section className="w-full space-y-8">
      {/* Title segment */}
      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-glow text-white">
            {title}
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {displayMovies.map((movie, index) => (
          <MovieCard 
            key={movie.videoId || movie.id || index} 
            movie={movie} 
            index={index}
            onSelect={onVideoSelect}
          />
        ))}

        {loading && (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-white/5 animate-pulse rounded-[1.5rem] border border-white/5" />
              <div className="space-y-2 px-1">
                <div className="h-3.5 bg-white/10 rounded w-5/6 animate-pulse" />
                <div className="h-2.5 bg-white/5 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {!loading && onLoadMore && hasMore && displayMovies.length > 0 && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={onLoadMore}
            className="px-8 py-3.5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-orange-500 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all shadow-xl shadow-orange-500/5 active:scale-95 cursor-pointer"
          >
            Load More Content
          </button>
        </div>
      )}
    </section>
  );
};

export default CinematicMovieGrid;
