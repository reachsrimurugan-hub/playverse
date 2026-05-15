import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFromAPI } from '../services/api';
import Loader from '../components/Loader';
import RelatedVideos from '../components/RelatedVideos';
import { formatDistanceToNow } from 'date-fns';
import { FiThumbsUp, FiShare2, FiDownload, FiMoreHorizontal } from 'react-icons/fi';

const VideoDetails = () => {
  const { id } = useParams();
  const [videoDetail, setVideoDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFromAPI(`videos?part=snippet,statistics&id=${id}`);
        setVideoDetail(data?.items?.[0] || null);
      } catch (error) {
        console.error('Failed to fetch video details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (isLoading) return <Loader />;
  if (!videoDetail) return <div className="text-white text-center mt-10 w-full">Video not found.</div>;

  const { snippet: { title, channelTitle, description, publishedAt }, statistics: { viewCount, likeCount } } = videoDetail;

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar bg-yt-bg p-4 md:p-6 gap-6">
      <div className="flex-1 lg:max-w-[70%]">
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-4 shadow-xl">
          <iframe 
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            className="w-full h-full border-none"
            allowFullScreen
            title="Video Player"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg text-white">
                {channelTitle.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white text-[16px]">{channelTitle}</h3>
                <p className="text-xs text-yt-textMuted">1.2M subscribers</p>
              </div>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold md:ml-4 hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            <div className="flex items-center bg-yt-light rounded-full overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-yt-hover transition-colors border-r border-[#404040]">
                <FiThumbsUp /> {parseInt(likeCount).toLocaleString()}
              </button>
              <button className="px-4 py-2 hover:bg-yt-hover transition-colors">
                <FiThumbsUp className="rotate-180" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-yt-light hover:bg-yt-hover transition-colors rounded-full whitespace-nowrap">
              <FiShare2 /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-yt-light hover:bg-yt-hover transition-colors rounded-full whitespace-nowrap hidden sm:flex">
              <FiDownload /> Download
            </button>
            <button className="p-2.5 bg-yt-light hover:bg-yt-hover transition-colors rounded-full shrink-0">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>
        <div 
          className="bg-yt-light rounded-xl p-4 hover:bg-yt-hover transition-colors cursor-pointer"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          <p className="text-sm font-semibold text-white mb-2">
            {parseInt(viewCount).toLocaleString()} views • {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
          </p>
          <p className={`text-sm text-yt-text whitespace-pre-wrap ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
            {description}
          </p>
          <p className="text-sm font-semibold mt-2 text-yt-textMuted">
            {isDescriptionExpanded ? 'Show less' : '...more'}
          </p>
        </div>
      </div>
      <div className="w-full lg:w-[30%] lg:min-w-[350px]">
        <RelatedVideos videoId={id} />
      </div>
    </div>
  );
};

export default VideoDetails;
