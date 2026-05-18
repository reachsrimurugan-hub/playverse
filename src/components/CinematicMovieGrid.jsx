import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';

const MovieCard = ({ movie, index, onSelect }) => {
  // Use normalized data or fallback
  const id = movie.videoId || movie.id;
  const title = movie.title || 'Untitled Video';
  const thumbnail = movie.thumbnail || '';
  const channel = movie.channelTitle || 'Unknown Creator';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
      onClick={() => onSelect && onSelect(movie)}
    >
      <div className="relative aspect-[2/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-white/5">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2">
              <span className="glass-orange px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase text-orange-500">
                Premium
              </span>
              <div className="flex items-center gap-1 text-orange-500">
                <Star size={10} fill="currentColor" />
                <span className="text-[10px] font-bold">4.9</span>
              </div>
            </div>
            
            <h3 className="text-white font-black text-sm leading-tight line-clamp-2">{title}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{channel}</span>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                <Play size={14} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CinematicMovieGrid = ({ movies, title = "Popular Videos", loading = false, onVideoSelect }) => {
  const displayMovies = movies?.length > 0 ? movies : [];

  return (
    <section className="w-full pb-20">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-black tracking-tighter text-white"
          >
            {title}
          </motion.h2>
          <div className="h-1 w-20 bg-orange-500 rounded-full" />
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-orange-500 transition-colors">
          View All Library
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] md:aspect-video rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          ))
        ) : (
          displayMovies.map((movie, index) => (
            <MovieCard 
              key={movie.videoId || movie.id || index} 
              movie={movie} 
              index={index}
              onSelect={onVideoSelect}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CinematicMovieGrid;
