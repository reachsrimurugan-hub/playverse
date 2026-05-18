import React, { useState, useEffect, useRef } from 'react';
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
  
  const mouseGlowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = `${e.clientX}px`;
        mouseGlowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  if (loading && !video) return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#0a0502] text-white">
      <div className="cinematic-bg" />
      <div className="grain" />
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
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#0a0502] text-white">
      <div className="cinematic-bg" />
      <div className="glass-premium p-12 rounded-[3rem] text-center max-w-md mx-4 relative z-10">
        <Info size={32} className="text-orange-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2">Content Unavailable</h2>
        <p className="text-white/40 text-sm mb-8">This video may have been removed or is restricted in your region.</p>
        <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">
          Explore More Content
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />
      
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

      <main className={`max-w-[1800px] mx-auto px-4 md:px-10 pb-20 transition-all ${isTheaterMode ? 'pt-24' : 'pt-32'}`}>
        
        {/* Back Button */}
        {!isTheaterMode && (
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors mb-8 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </motion.button>
        )}

        {/* Widescreen Theater Mode Video block */}
        {isTheaterMode && (
          <div className="w-full mb-10">
            <CinematicVideoPlayer 
              videoId={videoId} 
              title={video.title} 
              onTheaterToggle={setIsTheaterMode}
            />
          </div>
        )}

        {/* Two column layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Standard Widescreen Video Player */}
            {!isTheaterMode && (
              <motion.div 
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full"
              >
                <CinematicVideoPlayer 
                  videoId={videoId} 
                  title={video.title} 
                  onTheaterToggle={setIsTheaterMode}
                />
              </motion.div>
            )}

            {/* Video metadata Details */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">{video.title}</h1>
                  <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                    <span>{parseInt(video.views).toLocaleString()} Views</span>
                    <span>•</span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Video actions panel */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Like Button */}
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${hasLiked ? 'bg-orange-500 border-orange-500/20 text-white shadow-lg shadow-orange-500/20' : 'glass-button text-white'}`}
                  >
                    <ThumbsUp size={16} className={hasLiked ? 'fill-current' : 'text-white/60'} />
                    {likesCount.toLocaleString()} Likes
                  </button>

                  {/* Share button */}
                  <button onClick={copyShareLink} className="glass-button p-3.5 rounded-2xl hover:text-orange-500" title="Copy Link">
                    <Share2 size={18} />
                  </button>

                  {/* Add to Watch Later */}
                  <button 
                    onClick={toggleWatchLater} 
                    className={`p-3.5 rounded-2xl border transition-all ${isSavedWatchLater ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'glass-button text-white/60'}`}
                    title="Watch Later"
                  >
                    <Clock size={18} />
                  </button>

                  {/* Add to Favorites */}
                  <button 
                    onClick={toggleFavorite} 
                    className={`p-3.5 rounded-2xl border transition-all ${isSavedFavorites ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'glass-button text-white/60'}`}
                    title="Add to Favorites"
                  >
                    <Heart size={18} className={isSavedFavorites ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>

              {/* Creator details panel */}
              <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center font-black text-white text-lg">
                      {video.channelTitle?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{video.channelTitle}</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-mono">Premium Partner</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSubscribe}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isSubscribed ? 'bg-white/10 text-white/60 border border-white/10' : 'bg-white text-black hover:bg-orange-500 hover:text-white'}`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
                <div className="h-px bg-white/5 w-full" />
                <div className="space-y-4">
                  <p className={`text-sm text-white/60 leading-relaxed font-medium ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                    {video.description}
                  </p>
                  <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-xs font-black uppercase tracking-widest text-orange-500">
                    {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              </div>

              {/* Enhanced Comments System UI */}
              <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3 text-orange-500">
                  <MessageSquare size={20} />
                  <h3 className="font-bold text-lg text-white">Discussions ({comments.length})</h3>
                </div>

                {/* Comment Submission form */}
                <form onSubmit={handleCommentSubmit} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center font-black text-sm flex-shrink-0">
                    A
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add public comment..." 
                      className="w-full bg-white/5 border border-white/10 px-5 py-3.5 pr-12 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-medium text-xs"
                    />
                    <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-orange-500 transition-all">
                      <Send size={14} />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6 pt-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img src={comment.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{comment.author}</span>
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-wide">{comment.time}</span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-medium">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <h2 className="text-xl font-black tracking-tight uppercase tracking-wider text-white/40">Recommended for You</h2>
            <div className="flex flex-col gap-6">
              {relatedVideos.map((v) => (
                <div 
                  key={v.videoId} 
                  onClick={() => handleVideoSelect(v)} 
                  className="flex gap-4 cursor-pointer group glass-premium p-3 rounded-3xl hover:border-orange-500/30 transition-all"
                >
                  <div className="w-36 aspect-video rounded-2xl overflow-hidden flex-shrink-0 relative bg-white/5">
                    <img src={v.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <h4 className="text-xs font-black text-white line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-[9px] font-black text-white/30 uppercase truncate">{v.channelTitle}</p>
                  </div>
                </div>
              ))}
              
              {relatedVideos.length === 0 && (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex gap-4 p-3 animate-pulse">
                    <div className="w-36 aspect-video bg-white/5 rounded-2xl" />
                    <div className="flex-1 py-2 space-y-3">
                      <div className="h-3 bg-white/10 rounded w-5/6" />
                      <div className="h-2.5 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center text-orange-500"><Sparkles size={20} /></div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
