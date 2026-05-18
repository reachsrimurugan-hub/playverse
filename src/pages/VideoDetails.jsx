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
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    if (!isHoverDevice) return;

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

  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // If cursor coordinates are in the top 100px of the viewport, reveal the navbar.
      if (e.clientY < 100) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="relative min-h-screen bg-[#070301] text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      {/* Floating Interactive Navbar Wrapper */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-[100] pointer-events-auto"
      >
        <CinematicNavbar onVideoSelect={handleVideoSelect} />
      </motion.div>

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
      <div 
        className="w-full flex flex-col transition-all duration-300 ease-out"
        style={{ paddingTop: showNavbar ? '110px' : '16px' }}
      >
        
        {/* Back navigation header */}
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-3 flex items-center justify-between">
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
          <div className="max-w-[1720px] mx-auto px-0 md:px-4 lg:px-6">
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

        {/* 2. Beautiful Centered Video Details Section */}
        <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-6 md:py-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-4 text-left"
          >
            <div className="space-y-2.5">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight max-w-4xl text-white">
                {video.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-white/30 font-mono">
                <span>{parseInt(video.views).toLocaleString()} Views</span>
                <span className="text-orange-500">•</span>
                <span>Published {new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar w-full pb-3 md:pb-0 md:w-auto md:flex-wrap whitespace-nowrap">
              {/* Like Pill */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border cursor-pointer select-none flex-shrink-0 ${
                  hasLiked 
                    ? 'bg-orange-500 border-orange-500/25 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600' 
                    : 'bg-white/5 border-white/10 hover:border-orange-500/40 text-white hover:bg-white/10 hover:text-orange-500'
                }`}
              >
                <ThumbsUp size={14} className={hasLiked ? 'fill-current' : 'text-white/60'} />
                <span>{likesCount.toLocaleString()} Likes</span>
              </button>

              {/* Watch Later Pill */}
              <button
                onClick={toggleWatchLater}
                className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border cursor-pointer select-none flex-shrink-0 ${
                  isSavedWatchLater 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 font-bold' 
                    : 'bg-white/5 border-white/10 hover:border-orange-500/40 text-white hover:bg-white/10 hover:text-orange-500'
                }`}
              >
                <Clock size={14} />
                <span>Watch Later</span>
              </button>

              {/* Share Pill */}
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border bg-white/5 border-white/10 hover:border-orange-500/40 text-white hover:bg-white/10 hover:text-orange-500 cursor-pointer select-none flex-shrink-0"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>

              {/* More Pill */}
              <button
                onClick={() => setShowInfoOverlay(true)}
                className="p-2.5 md:p-3.5 rounded-full border bg-white/5 border-white/10 hover:border-orange-500/40 text-white hover:bg-white/10 hover:text-orange-500 cursor-pointer transition-all flex-shrink-0"
                title="More Info"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default VideoDetails;
