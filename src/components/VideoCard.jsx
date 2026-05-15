import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
  const { id: { videoId }, snippet } = video;

  if (!videoId) return null;

  return (
    <Link to={`/video/${videoId}`} className="flex flex-col group cursor-pointer w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
        <img 
          src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url} 
          alt={snippet?.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 overflow-hidden flex items-center justify-center mt-0.5">
          <span className="text-sm font-bold text-white">{snippet?.channelTitle?.charAt(0)}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-[15px] font-semibold text-yt-text line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors">
            {snippet?.title?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")}
          </h3>
          <p className="text-[13px] text-yt-textMuted hover:text-white transition-colors">
            {snippet?.channelTitle}
          </p>
          <p className="text-[13px] text-yt-textMuted">
            {snippet?.publishTime ? formatDistanceToNow(new Date(snippet?.publishTime), { addSuffix: true }) : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
