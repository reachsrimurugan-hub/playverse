import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicVideoPlayer from '../components/CinematicVideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideoDetails, getRelatedVideos } from '../services/cinematicApi';
import {
  ChevronLeft, Share2, Plus, ThumbsUp, Info, Sparkles,
  Heart, Bookmark, Clock, Check, Send, MessageSquare
} from 'lucide-react';

const VideoDetails = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Interactive Stats & Subscriptions
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSavedWatchLater, setIsSavedWatchLater] = useState(false);
  const [isSavedFavorites, setIsSavedFavorites] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Comment System
  const [comments, setComments] = useState([
    { id: 1, author: 'Sarah Mitchell', text: 'The cinematography here is genuinely breathtaking. The sound design completely pulls you in!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', likes: 184, time: '2 hours ago' },
    { id: 2, author: 'David K.', text: 'Absolutely stellar! PlayVerse UI wraps this YouTube playback in such a premium way.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', likes: 92, time: '4 hours ago' },
    { id: 3, author: 'Emma Watson', text: 'Stunning direction. Looking forward to sharing this with my circle.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', likes: 45, time: '1 day ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const details = await getVideoDetails(videoId);
        if (details) {
          setVideo(details);
          setLikesCount(parseInt(details.likes) || 0);

          // Save video to history in LocalStorage
          const history = JSON.parse(localStorage.getItem('nextube_history') || '[]');
          const newEntry = {
            id: videoId,
            title: details.title,
            thumbnail: details.thumbnail,
            channelTitle: details.channelTitle,
            watchedAt: new Date().toISOString()
          };
          const filteredHistory = history.filter(item => item.id !== videoId);
          localStorage.setItem('nextube_history', JSON.stringify([newEntry, ...filteredHistory].slice(0, 50)));

          // Check if already saved in Watch Later / Favorites
          const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
          const favorites = JSON.parse(localStorage.getItem('nextube_favorites') || '[]');
          setIsSavedWatchLater(watchLater.some(v => v.id === videoId));
          setIsSavedFavorites(favorites.some(v => v.id === videoId));

          const related = await getRelatedVideos(videoId);
          setRelatedVideos(related || []);
        }
      } catch (error) {
        console.error("Failed to fetch video details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
    window.scrollTo(0, 0);
  }, [videoId]);

  const handleVideoSelect = (newVideo) => {
    const id = newVideo.videoId || newVideo.id;
    navigate(`/watch/${id}`);
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
      triggerToast('Added to liked videos');
    }
  };

  const toggleWatchLater = () => {
    const watchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    if (isSavedWatchLater) {
      const updated = watchLater.filter(v => v.id !== videoId);
      localStorage.setItem('nextube_watch_later', JSON.stringify(updated));
      setIsSavedWatchLater(false);
      triggerToast('Removed from Watch Later');
    } else {
      const newVideo = { id: videoId, title: video.title, thumbnail: video.thumbnail, channelTitle: video.channelTitle };
      localStorage.setItem('nextube_watch_later', JSON.stringify([...watchLater, newVideo]));
      setIsSavedWatchLater(true);
      triggerToast('Added to Watch Later');
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('nextube_favorites') || '[]');
    if (isSavedFavorites) {
      const updated = favorites.filter(v => v.id !== videoId);
      localStorage.setItem('nextube_favorites', JSON.stringify(updated));
      setIsSavedFavorites(false);
      triggerToast('Removed from Favorites');
    } else {
      const newVideo = { id: videoId, title: video.title, thumbnail: video.thumbnail, channelTitle: video.channelTitle };
      localStorage.setItem('nextube_favorites', JSON.stringify([...favorites, newVideo]));
      setIsSavedFavorites(true);
      triggerToast('Added to Favorites');
    }
  };

  const handleSubscribe = () => {
    const next = !isSubscribed;
    setIsSubscribed(next);
    triggerToast(next ? `Subscribed to ${video.channelTitle}` : `Unsubscribed from ${video.channelTitle}`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: 'Alex Smith',
      text: newComment,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      likes: 0,
      time: 'Just now'
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    triggerToast('Comment posted successfully');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast('Link copied to clipboard!');
  };

  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  if (loading && !video) return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-6 z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
        <p className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">Initializing PlayVerse Stream</p>
      </div>
    </div>
  );

  if (!video && !loading) return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="glass-premium p-6 sm:p-12 rounded-2xl sm:rounded-[3rem] text-center max-w-md mx-4 relative z-10">
        <Info size={32} className="text-orange-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2">Content Unavailable</h2>
        <p className="text-white/40 text-sm mb-8">This video may have been removed or is restricted in your region.</p>
        <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-orange-500/25">
          Explore More Content
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden pb-10">
      <CinematicNavbar onVideoSelect={handleVideoSelect} />

      {/* Floating Notifications Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-10 z-[600] glass-dark px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-3 text-sm font-bold shadow-2xl"
          >
            <Check size={18} className="text-orange-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Overlay Panel */}
      <AnimatePresence>
        {showInfoOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="glass-premium max-w-2xl w-full rounded-[3.5rem] border border-white/10 p-8 md:p-10 relative overflow-hidden shadow-2xl text-left"
            >
              {/* Backglow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-500/10 blur-[100px] rounded-full" />
              
              <button 
                onClick={() => setShowInfoOverlay(false)}
                className="absolute top-8 right-8 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft size={20} className="rotate-180" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-orange-500">
                  <Info size={24} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Stream Specifications</span>
                </div>
                
                <h2 className="text-2xl font-black tracking-tight leading-snug">{video.title}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 font-mono">Publisher</p>
                    <p className="text-xs font-extrabold text-orange-500 truncate">{video.channelTitle}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 font-mono">Views</p>
                    <p className="text-xs font-extrabold text-white">{parseInt(video.views).toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 font-mono">Published</p>
                    <p className="text-xs font-extrabold text-white">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/40 font-mono">Description Summary</h4>
                  <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-xs text-white/60 leading-relaxed font-medium whitespace-pre-line">
                      {video.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-orange-500/10 px-5 py-4 rounded-2xl border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest font-mono">
                  <Sparkles size={16} className="flex-shrink-0" />
                  <span>Licensed PlayVerse stream authorization via YouTube API</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Watch Page Layout with dynamic animated top padding */}
      <div className="w-full flex flex-col pt-[4.5rem] lg:pt-20">
        
        {/* Back navigation header */}
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-orange-500 transition-colors group cursor-pointer"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">Back</span>
          </button>
          
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 select-none hidden md:inline font-mono">
            Now Playing • PlayVerse Cinema Immersive
          </span>
        </div>

        {/* 1. Immersive Video Player Container (optimized to fit window) */}
        <div className="w-full bg-black/40 border-y border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
          <div className="max-w-[1720px] mx-auto px-0 lg:px-4">
            <motion.div
              initial={{ scale: 0.99, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full relative overflow-hidden md:rounded-[2.5rem]"
            >
              <CinematicVideoPlayer
                videoId={videoId}
                title={video.title}
                channelTitle={video.channelTitle}
                isSavedWatchLater={isSavedWatchLater}
                onWatchLaterToggle={toggleWatchLater}
                onInfoClick={() => setShowInfoOverlay(true)}
                onTheaterToggle={setIsTheaterMode}
              />
            </motion.div>
          </div>
        </div>

        {/* 2. Beautiful Responsive Grid Content Details Section */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Player Details, Channel, Description, Comments */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Actions Row */}
              <div className="space-y-4 pt-4 border-b border-white/5 pb-6">
                <div className="space-y-2.5 text-left">
                  <h1 className="text-lg sm:text-xl font-bold leading-snug text-white">
                    {video.title}
                  </h1>
                  <p className="text-sm text-[#8e8e93]">
                    {parseInt(video.views || 0).toLocaleString()} views •{' '}
                    {video.publishedAt
                      ? new Date(video.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </p>
                </div>

                {/* Actions Row stacked vertically exactly like mockup */}
                <div className="flex items-center justify-around py-4 border-t border-b border-white/5 text-center">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex flex-col items-center gap-1.5 cursor-pointer transition-colors group ${
                      hasLiked ? 'text-orange-500' : 'text-white/60 hover:text-orange-500'
                    }`}
                  >
                    <ThumbsUp size={18} className={`group-hover:scale-110 transition-transform ${hasLiked ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                      {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(0)}K` : likesCount}
                    </span>
                  </button>

                  {/* Watch Later Button */}
                  <button
                    onClick={toggleWatchLater}
                    className={`flex flex-col items-center gap-1.5 cursor-pointer transition-colors group ${
                      isSavedWatchLater ? 'text-orange-500' : 'text-white/60 hover:text-orange-500'
                    }`}
                  >
                    <Clock size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                      Watch Later
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={copyShareLink}
                    className="flex flex-col items-center gap-1.5 cursor-pointer text-white/60 hover:text-orange-500 transition-colors group"
                  >
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                      Share
                    </span>
                  </button>

                  {/* More Button */}
                  <button
                    onClick={() => setShowInfoOverlay(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer text-white/60 hover:text-orange-500 transition-colors group"
                  >
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                      More
                    </span>
                  </button>
                </div>
              </div>

              {/* Publisher/Channel Row exactly like mockup */}
              <div className="flex items-center justify-between py-2 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${video.channelTitle}&backgroundColor=f97316`} 
                      alt={video.channelTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm tracking-tight leading-snug">
                      {video.channelTitle}
                    </h3>
                    <p className="text-[10px] text-white/40 font-medium">
                      1.2M subscribers
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleSubscribe}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSubscribed 
                      ? 'bg-white/10 text-white/80 border border-white/10 hover:bg-white/15' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/10 active:scale-95'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Description Section exactly like mockup */}
              <div className="pt-2 text-left space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Description</h4>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                  <p className={`text-xs text-white/60 leading-relaxed font-medium ${
                    isDescriptionExpanded ? '' : 'line-clamp-2'
                  }`}>
                    {video.description || "No description provided."}
                  </p>
                  <button 
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-white transition-colors font-mono mt-2 block cursor-pointer"
                  >
                    {isDescriptionExpanded ? '...less' : '...more'}
                  </button>
                </div>
              </div>

              {/* Comments Section (desktop) */}
              <div className="hidden md:block space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-orange-500" />
                  <h3 className="text-lg font-black tracking-tight text-white uppercase font-mono">
                    Comments ({comments.length})
                  </h3>
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleCommentSubmit} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <img 
                      src="https://api.dicebear.com/7.x/initials/svg?seed=Alex+Smith&backgroundColor=f97316" 
                      alt="My Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a public comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/10 px-5 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/40 transition-colors"
                    />
                    <button 
                      type="submit"
                      className="p-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-white">{comment.author}</span>
                          <span className="text-[9px] text-white/30 font-mono uppercase">{comment.time}</span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-medium">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-white/40 uppercase tracking-widest font-mono pt-1">
                          <ThumbsUp size={10} className="text-white/30" />
                          <span>{comment.likes} Likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Recommended Sidebar (desktop) */}
            <div className="hidden lg:block lg:col-span-1 space-y-6 lg:border-l lg:border-white/5 lg:pl-8 text-left">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-orange-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-widest font-mono text-white">
                  Next to Stream
                </h3>
              </div>

              {/* Recommended List */}
              <div className="space-y-4">
                {relatedVideos.map((item) => {
                  const id = item.videoId || item.id;
                  if (!id) return null;

                  return (
                    <div 
                      key={id}
                      onClick={() => handleVideoSelect(item)}
                      className="flex gap-3 group cursor-pointer p-2 rounded-2xl bg-white/[0.01] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                    >
                      {/* 16:9 Thumbnail */}
                      <div className="relative w-32 min-w-32 aspect-video rounded-xl overflow-hidden border border-white/5 bg-white/5 flex-shrink-0">
                        <img 
                          src={item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex flex-col justify-between py-0.5 overflow-hidden flex-grow text-left">
                        <h4 className="text-white font-bold text-xs leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {item.title}
                        </h4>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest truncate">
                            {item.channelTitle}
                          </p>
                          {item.views && (
                            <p className="text-[8px] font-extrabold text-orange-500/80 font-mono uppercase tracking-wider">
                              {parseInt(item.views).toLocaleString()} Views
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {relatedVideos.length === 0 && (
                  <div className="text-center py-12 text-white/20 text-xs italic bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                    No recommendations found.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoDetails;
