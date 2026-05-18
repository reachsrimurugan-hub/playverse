import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Plus, Info, Share2, ThumbsUp } from 'lucide-react';
import CinematicVideoPlayer from './CinematicVideoPlayer';

const CinematicHero = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!video) return null;

  const title = video.title?.split('|')[0].split('(')[0] || 'Untitled';
  const description = video.description || '';

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[21/9] min-h-[400px] max-h-[600px] rounded-[40px] overflow-hidden group shadow-2xl">
        <motion.div 
          className="absolute inset-0"
        >
          <img 
            src={video.thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 gap-4 md:gap-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <span className="glass-orange px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-orange-500 border-orange-500/20">
                Trending #1
              </span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/60">
                {video.channelTitle}
              </span>
            </motion.div>

            <div className="max-w-3xl space-y-4">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.1] text-glow"
              >
                {title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-base text-white/60 leading-relaxed max-w-xl line-clamp-3 font-medium"
              >
                {description}
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mt-4"
            >
              <button 
                onClick={() => onPlay && onPlay(video)}
                className="bg-white text-black px-8 md:px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-2xl shadow-white/5 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                Watch Trailer
              </button>
              
              <button className="glass px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all border-white/20">
                <Plus size={20} className="text-white/70" />
                My List
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />
    </motion.section>
  );
};


export default React.memo(CinematicHero);

