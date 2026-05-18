import React from 'react';
import { Play, Plus } from 'lucide-react';

const CinematicHero = ({ video, onPlay }) => {
  if (!video) return null;

  const title = video.title?.split('|')[0].split('(')[0] || 'Untitled';
  const description = video.description || '';

  return (
    <section className="relative w-full mb-6">
      <div className="relative w-full aspect-[16/11] md:aspect-[21/9] min-h-[220px] max-h-[420px] lg:max-h-[520px] xl:max-h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#1a1a1a]">
        <img
          src={
            video.thumbnail ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
          }
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#f97316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Trending #1
            </span>
            <span className="bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
              {video.channelTitle}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-tight line-clamp-2">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={() => onPlay?.(video)}
              className="flex flex-1 items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <Play size={18} fill="currentColor" />
              Watch Now
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm sm:flex-initial"
            >
              <Plus size={18} />
              My List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CinematicHero);
