import React from 'react';
import { MoreVertical } from 'lucide-react';
import { formatViews, formatTimeAgo } from './VideoListItem';

const FALLBACK =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';

const VideoGridCard = ({ video, onClick }) => {
  const duration =
    video.duration ||
    `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}`;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(video)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(video)}
      className="group cursor-pointer text-left"
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
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 h-8 w-8 flex items-center justify-center text-[#8e8e93] hover:text-white rounded-full hover:bg-white/5"
          aria-label="More"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </article>
  );
};

export default VideoGridCard;
