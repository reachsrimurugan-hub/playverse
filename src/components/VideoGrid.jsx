import VideoCard from './VideoCard';
import Loader from './Loader';

const VideoGrid = ({ videos, isLoading }) => {
  if (isLoading) return <Loader />;
  
  if (!videos?.length) return (
    <div className="flex justify-center items-center w-full min-h-[50vh] text-yt-textMuted text-lg font-medium">
      No videos found. Try a different search.
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
      {videos.map((video, idx) => (
        <VideoCard key={idx} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
