import React, { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';

const CinematicHero = ({ video, onPlay }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!video) return null;

  const title = video.title?.split('|')[0].split('(')[0] || 'Untitled';
  const videoId = video.videoId || video.id;

  useEffect(() => {
    if (!videoId) return;
    const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    const exists = watchLater.some((item) => (item.videoId || item.id) === videoId);
    setIsSaved(exists);
  }, [videoId]);

  const handleToggleMyList = (e) => {
    e.stopPropagation();
    const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    const exists = watchLater.some((item) => (item.videoId || item.id) === videoId);

    let updatedList;
    if (exists) {
      updatedList = watchLater.filter((item) => (item.videoId || item.id) !== videoId);
      setIsSaved(false);
      setToastMessage('Removed from My List');
    } else {
      updatedList = [...watchLater, video];
      setIsSaved(true);
      setToastMessage('Saved to My List');
    }
    localStorage.setItem('nextube_watch_later', JSON.stringify(updatedList));

    // Auto-clear toast overlay feedback after 2.5s
    setTimeout(() => {
      setToastMessage('');
    }, 2500);

    // Dispatches a state update event so other pages/components can update
    window.dispatchEvent(new Event('watch_later_updated'));
  };

  return (
    <section className="relative w-full mb-6">
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] md:aspect-[21/9] min-h-[200px] max-h-[420px] lg:max-h-[520px] xl:max-h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#1a1a1a]">
        <img
          src={
            video.thumbnail ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
          }
          alt={title}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {toastMessage && (
          <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-2xl z-30 animate-bounce">
            {isSaved ? <Check size={12} className="text-[#f97316]" /> : <Plus size={12} />}
            {toastMessage}
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-6 gap-2 sm:gap-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="bg-[#f97316] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wide">
              Trending #1
            </span>
            <span className="bg-black/50 backdrop-blur-sm text-white/90 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase">
              {video.channelTitle}
            </span>
          </div>

          <h1 className="text-sm sm:text-2xl md:text-4xl font-bold text-white leading-tight line-clamp-2">
            {title}
          </h1>

          <div className="flex gap-2 sm:gap-3 mt-1">
            <button
              type="button"
              onClick={() => onPlay?.(video)}
              className="flex flex-1 items-center justify-center gap-1.5 bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 rounded-xl transition-colors text-xs sm:text-sm"
            >
              <Play size={16} fill="currentColor" />
              Watch Now
            </button>
            <button
              type="button"
              onClick={handleToggleMyList}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 border font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors text-xs sm:text-sm ${
                isSaved
                  ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {isSaved ? <Check size={16} /> : <Plus size={16} />}
              My List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CinematicHero);
