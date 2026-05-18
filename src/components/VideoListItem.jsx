import React from 'react';
import { MoreVertical } from 'lucide-react';

export const formatViews = (num) => {
  const n = parseInt(num) || 0;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n > 0 ? n.toString() : '0';
};

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '2 days ago';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop';

const VideoListItem = ({ video, onClick, showTrailerBadge = false }) => {
  const duration =
    video.duration ||
    `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(video)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(video)}
      className="flex gap-3 py-2 cursor-pointer group relative w-full text-left"
    >
      <div className="relative w-[168px] sm:w-[176px] aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] flex-shrink-0">
        <img
          src={video.thumbnail || FALLBACK_THUMB}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_THUMB;
          }}
        />
        {showTrailerBadge && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/80 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            TRAILER
          </span>
        )}
        <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-[10px] font-semibold text-white px-1.5 py-0.5 rounded">
          {duration}
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center pr-8">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#f97316] transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-[#8e8e93] mt-1 truncate">{video.channelTitle}</p>
        <p className="text-xs text-[#8e8e93] mt-0.5">
          {formatViews(video.views)} views • {formatTimeAgo(video.publishedAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#8e8e93] hover:text-white"
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default VideoListItem;
