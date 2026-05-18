import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Clock, Check, Plus } from 'lucide-react';
import { formatViews, formatTimeAgo } from './VideoListItem';

const FALLBACK =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';

const VideoGridCard = ({ video, onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const dropdownRef = useRef(null);

  const duration =
    video.duration ||
    `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}`;

  const videoId = video.videoId || video.id;

  // Track if video is already in Watch Later list
  useEffect(() => {
    const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    const exists = watchLater.some((item) => (item.videoId || item.id) === videoId);
    setIsSaved(exists);
  }, [videoId, showDropdown]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleToggleWatchLater = (e) => {
    e.stopPropagation();
    const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    const exists = watchLater.some((item) => (item.videoId || item.id) === videoId);

    let updatedList;
    if (exists) {
      updatedList = watchLater.filter((item) => (item.videoId || item.id) !== videoId);
      setIsSaved(false);
      setToastMessage('Removed from Watch Later');
    } else {
      updatedList = [...watchLater, video];
      setIsSaved(true);
      setToastMessage('Saved to Watch Later');
    }
    localStorage.setItem('nextube_watch_later', JSON.stringify(updatedList));
    setShowDropdown(false);

    // Auto-clear toast overlay feedback after 2.5s
    setTimeout(() => {
      setToastMessage('');
    }, 2500);

    // Dispatches a state update event so pages like LibraryPage can refresh lists instantly
    window.dispatchEvent(new Event('watch_later_updated'));
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(video)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(video)}
      className="group cursor-pointer text-left relative"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] mb-2">
        <img
          src={video.thumbnail || FALLBACK}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK;
          }}
        />
        <span className="absolute bottom-2 right-2 bg-black/85 text-[11px] font-semibold text-white px-1.5 py-0.5 rounded">
          {duration}
        </span>

        {/* Premium Glassmorphic Toast Overlay */}
        {toastMessage && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 transition-all duration-300 z-20">
            <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-lg">
              {isSaved ? <Check size={10} className="text-[#f97316]" /> : <Plus size={10} />}
              {toastMessage}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 pr-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#f97316] transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-[#8e8e93] mt-1 truncate">{video.channelTitle}</p>
          <p className="text-xs text-[#8e8e93] mt-0.5">
            {formatViews(video.views)} views • {formatTimeAgo(video.publishedAt)}
          </p>
        </div>

        {/* Three Dots Context Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="shrink-0 h-8 w-8 flex items-center justify-center text-[#8e8e93] hover:text-white rounded-full hover:bg-white/5 cursor-pointer relative z-10"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-52 bg-[#1c1c1e] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 text-left py-1 backdrop-blur-md">
              <button
                type="button"
                onClick={handleToggleWatchLater}
                className="w-full px-4 py-2.5 hover:bg-white/[0.04] text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check size={14} className="text-[#f97316]" />
                    <span>Watch Later (Saved)</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-[#8e8e93]" />
                    <span>Save to Watch Later</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default VideoGridCard;
