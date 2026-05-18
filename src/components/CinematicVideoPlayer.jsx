import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings, 
  SkipForward, RotateCcw, RotateCw, List, Subtitles,
  ChevronUp, ChevronDown, Monitor, Tv
} from 'lucide-react';

const CinematicVideoPlayer = ({ videoId, title, onTheaterToggle }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressRef = useRef(null);

  // Auto-hide controls when playing
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowVolumeMenu(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Sync timeline interval when video is playing
  useEffect(() => {
    let interval;
    if (player && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 500);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcut interference in input text fields
      if (
        document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (!player) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          const rewindTime = Math.max(player.getCurrentTime() - 5, 0);
          player.seekTo(rewindTime, true);
          setCurrentTime(rewindTime);
          resetControlsTimeout();
          break;
        case 'arrowright':
          e.preventDefault();
          const forwardTime = Math.min(player.getCurrentTime() + 5, duration);
          player.seekTo(forwardTime, true);
          setCurrentTime(forwardTime);
          resetControlsTimeout();
          break;
        case 'arrowup':
          e.preventDefault();
          const volUp = Math.min(volume + 5, 100);
          setVolume(volUp);
          player.setVolume(volUp);
          if (isMuted && volUp > 0) {
            setIsMuted(false);
            player.unMute();
          }
          resetControlsTimeout();
          break;
        case 'arrowdown':
          e.preventDefault();
          const volDown = Math.max(volume - 5, 0);
          setVolume(volDown);
          player.setVolume(volDown);
          if (volDown === 0) {
            setIsMuted(true);
            player.mute();
          }
          resetControlsTimeout();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, isPlaying, isMuted, volume, duration]);

  // Player Handlers
  const handleReady = (event) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    setDuration(ytPlayer.getDuration());
    setIsBuffering(false);
    
    // Set starting volume
    ytPlayer.setVolume(volume);
    if (isMuted) {
      ytPlayer.mute();
    } else {
      ytPlayer.unMute();
    }
  };

  const handleStateChange = (event) => {
    // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    const state = event.data;
    
    if (state === 1) {
      setIsPlaying(true);
      setIsBuffering(false);
    } else if (state === 2) {
      setIsPlaying(false);
    } else if (state === 3) {
      setIsBuffering(true);
    } else if (state === 0) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume || 80);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const handleVolumeChange = (e) => {
    if (!player) return;
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    player.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      player.unMute();
    } else if (newVol === 0 && !isMuted) {
      setIsMuted(true);
      player.mute();
    }
  };

  const handleProgressSeek = (e) => {
    if (!player || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(clickX / width, 1));
    const seekTime = percentage * duration;
    
    player.seekTo(seekTime, true);
    setCurrentTime(seekTime);
    resetControlsTimeout();
  };

  const changeSpeed = (rate) => {
    if (!player) return;
    player.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen request failed", err);
      });
    } else {
      document.exitFullscreen();
    }
    resetControlsTimeout();
  };

  const toggleTheaterMode = () => {
    const updated = !isTheaterMode;
    setIsTheaterMode(updated);
    if (onTheaterToggle) onTheaterToggle(updated);
    resetControlsTimeout();
  };

  // Helper format time
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-black border border-white/5"
    >
      {/* react-youtube Component */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <YouTube
          videoId={videoId}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              mute: isMuted ? 1 : 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              enablejsapi: 1,
              disablekb: 1
            }
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          className="w-full h-full"
          containerClassName="w-full h-full absolute inset-0"
        />
      </div>

      {/* Click-to-Play Overlay */}
      <div 
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Buffering Loading Overlay */}
      <AnimatePresence>
        {isBuffering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="relative w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">Buffering Stream</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 bg-gradient-to-t from-black/90 via-transparent to-black/30 flex flex-col justify-between p-6 md:p-8 pointer-events-none"
          >
            {/* Top Bar info */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <div className="flex items-center gap-3">
                <span className="glass-orange px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase text-orange-500">
                  PlayVerse Live
                </span>
                <h4 className="text-white/60 font-bold text-xs uppercase tracking-wider line-clamp-1 max-w-sm md:max-w-md">
                  {title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 glass rounded-xl text-white/70 hover:text-white transition-all">
                  <Subtitles size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="space-y-4 md:space-y-6 w-full pointer-events-auto">
              {/* Timeline Seeking Progress Bar */}
              <div 
                ref={progressRef}
                onClick={handleProgressSeek}
                className="relative group/progress h-1.5 w-full bg-white/10 rounded-full overflow-visible cursor-pointer transition-all hover:h-2"
              >
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.6)] rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl scale-0 group-hover/progress:scale-100 transition-transform"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                />
              </div>

              {/* Action Buttons panel */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  {/* Play Pause button */}
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>

                  {/* Volume settings */}
                  <div 
                    className="relative flex items-center gap-2"
                    onMouseEnter={() => setShowVolumeMenu(true)}
                    onMouseLeave={() => setShowVolumeMenu(false)}
                  >
                    <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <AnimatePresence>
                      {showVolumeMenu && (
                        <motion.div 
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 80, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className="overflow-hidden flex items-center"
                        >
                          <input 
                            type="range" 
                            min="0" 
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clock timeline info */}
                  <div className="text-[11px] font-bold text-white/50 uppercase tracking-widest font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span className="mx-1 text-white/20">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Playback speed control */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="glass-button px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider"
                    >
                      {playbackRate}x
                    </button>

                    <AnimatePresence>
                      {showSpeedMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-3 w-28 glass-premium rounded-2xl overflow-hidden py-1"
                        >
                          {[0.5, 1, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changeSpeed(rate)}
                              className={`w-full text-left px-4 py-2 text-[10px] font-black ${playbackRate === rate ? 'text-orange-500' : 'text-white/60 hover:text-white'}`}
                            >
                              {rate}x Speed
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Theater mode toggle */}
                  <button 
                    onClick={toggleTheaterMode}
                    className={`p-2.5 rounded-xl transition-all ${isTheaterMode ? 'bg-orange-500/20 text-orange-500' : 'glass text-white/60 hover:text-white'}`}
                    title="Theater Mode"
                  >
                    <Tv size={16} />
                  </button>

                  {/* Fullscreen toggle */}
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicVideoPlayer;
