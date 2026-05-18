import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Loader from './Loader';

const RelatedVideos = ({ videoId }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFromAPI(
          `search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=20`,
          { ttl: 60, cancelPrevious: true }
        );
        setVideos(data.items);
      } catch (error) {
        console.error('Failed to fetch related videos', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) fetchRelatedVideos();
  }, [videoId]);

  if (isLoading) return <div className="h-40"><Loader /></div>;

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video, idx) => {
        const { id: { videoId: relatedVideoId }, snippet } = video;
        if (!relatedVideoId) return null;

        return (
          <Link to={`/video/${relatedVideoId}`} key={idx} className="flex gap-3 group w-full">
            <div className="relative w-[160px] min-w-[160px] aspect-video rounded-xl overflow-hidden">
              <img 
                src={snippet?.thumbnails?.medium?.url} 
                alt={snippet?.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden pt-0.5">
              <h4 className="text-[14px] font-semibold text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                {snippet?.title?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")}
              </h4>
              <p className="text-[12px] text-yt-textMuted group-hover:text-gray-300 transition-colors">
                {snippet?.channelTitle}
              </p>
              <p className="text-[12px] text-yt-textMuted">
                {snippet?.publishTime ? formatDistanceToNow(new Date(snippet?.publishTime), { addSuffix: true }) : ''}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RelatedVideos;
