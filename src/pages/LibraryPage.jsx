import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderHeart, Clock, Plus, Play, Trash2, Library, Disc3 } from 'lucide-react';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState({
    watchLater: [],
    favorites: [],
    custom: []
  });
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
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

  // Load playlists from localStorage on mount
  useEffect(() => {
    const savedWatchLater = JSON.parse(localStorage.getItem('nextube_watch_later') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('nextube_favorites') || '[]');
    const savedCustomPlaylists = JSON.parse(localStorage.getItem('nextube_custom_playlists') || '[]');

    setPlaylists({
      watchLater: savedWatchLater,
      favorites: savedFavorites,
      custom: savedCustomPlaylists
    });
  }, []);

  const createPlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: `playlist_${Date.now()}`,
      name: newPlaylistName,
      videos: []
    };

    const updatedCustom = [...playlists.custom, newPlaylist];
    setPlaylists(prev => ({ ...prev, custom: updatedCustom }));
    localStorage.setItem('nextube_custom_playlists', JSON.stringify(updatedCustom));
    setNewPlaylistName('');
    setShowCreateModal(false);
  };

  const deleteCustomPlaylist = (id) => {
    const updatedCustom = playlists.custom.filter(p => p.id !== id);
    setPlaylists(prev => ({ ...prev, custom: updatedCustom }));
    localStorage.setItem('nextube_custom_playlists', JSON.stringify(updatedCustom));
  };

  const handleVideoSelect = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      <div className="cinematic-bg" />
      <div className="grain" />
      <div ref={mouseGlowRef} className="mouse-glow" />

      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 lg:px-16 xl:px-24 max-w-[1800px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-orange-500">
              <Library size={24} />
              <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">My Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Your Library</h1>
            <div className="h-1.5 w-24 bg-orange-500 rounded-full" />
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 w-fit active:scale-95 text-xs uppercase tracking-wider"
          >
            <Plus size={16} />
            Create Playlist
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
          {['all', 'watchLater', 'favorites', 'custom'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === tab 
                  ? 'bg-white/10 border-white/20 text-orange-500' 
                  : 'bg-transparent border-transparent text-white/40 hover:text-white'
              }`}
            >
              {tab === 'all' && 'All Items'}
              {tab === 'watchLater' && 'Watch Later'}
              {tab === 'favorites' && 'Favorites'}
              {tab === 'custom' && 'Playlists'}
            </button>
          ))}
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Watch Later Collection */}
          {(activeTab === 'all' || activeTab === 'watchLater') && (
            <motion.div layout className="glass-premium p-6 rounded-[2.5rem] border-white/5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-orange-500">
                  <div className="p-3 bg-orange-500/10 rounded-2xl"><Clock size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg">Watch Later</h3>
                    <p className="text-xs text-white/30 font-bold uppercase">{playlists.watchLater.length} videos</p>
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {playlists.watchLater.map((video) => (
                    <div 
                      key={video.id} 
                      onClick={() => handleVideoSelect(video.id)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                    >
                      <img src={video.thumbnail} className="w-16 aspect-video object-cover rounded-lg" alt="" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-orange-500 transition-colors">{video.title}</p>
                        <p className="text-[10px] text-white/30 truncate">{video.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                  {playlists.watchLater.length === 0 && (
                    <p className="text-xs text-white/20 italic text-center py-6">No saved items.</p>
                  )}
                </div>
              </div>
              {playlists.watchLater.length > 0 && (
                <button 
                  onClick={() => handleVideoSelect(playlists.watchLater[0].id)}
                  className="w-full bg-white/5 hover:bg-orange-500 hover:text-white text-orange-500 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider mt-4"
                >
                  <Play size={14} fill="currentColor" /> Play All
                </button>
              )}
            </motion.div>
          )}

          {/* Favorites Collection */}
          {(activeTab === 'all' || activeTab === 'favorites') && (
            <motion.div layout className="glass-premium p-6 rounded-[2.5rem] border-white/5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-red-500">
                  <div className="p-3 bg-red-500/10 rounded-2xl"><FolderHeart size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Favorites</h3>
                    <p className="text-xs text-white/30 font-bold uppercase">{playlists.favorites.length} videos</p>
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {playlists.favorites.map((video) => (
                    <div 
                      key={video.id} 
                      onClick={() => handleVideoSelect(video.id)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                    >
                      <img src={video.thumbnail} className="w-16 aspect-video object-cover rounded-lg" alt="" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-red-500 transition-colors">{video.title}</p>
                        <p className="text-[10px] text-white/30 truncate">{video.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                  {playlists.favorites.length === 0 && (
                    <p className="text-xs text-white/20 italic text-center py-6">No favorites added yet.</p>
                  )}
                </div>
              </div>
              {playlists.favorites.length > 0 && (
                <button 
                  onClick={() => handleVideoSelect(playlists.favorites[0].id)}
                  className="w-full bg-white/5 hover:bg-red-600 hover:text-white text-red-500 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider mt-4"
                >
                  <Play size={14} fill="currentColor" /> Play Favorites
                </button>
              )}
            </motion.div>
          )}

          {/* Custom Playlists */}
          {(activeTab === 'all' || activeTab === 'custom') && playlists.custom.map((playlist) => (
            <motion.div layout key={playlist.id} className="glass-premium p-6 rounded-[2.5rem] border-white/5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-amber-500">
                    <div className="p-3 bg-amber-500/10 rounded-2xl"><Disc3 size={24} /></div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{playlist.name}</h3>
                      <p className="text-xs text-white/30 font-bold uppercase">{playlist.videos.length} videos</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteCustomPlaylist(playlist.id)}
                    className="p-2.5 hover:bg-red-500/10 text-white/30 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {playlist.videos.map((video) => (
                    <div 
                      key={video.id} 
                      onClick={() => handleVideoSelect(video.id)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                    >
                      <img src={video.thumbnail} className="w-16 aspect-video object-cover rounded-lg" alt="" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-amber-500 transition-colors">{video.title}</p>
                        <p className="text-[10px] text-white/30 truncate">{video.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                  {playlist.videos.length === 0 && (
                    <p className="text-xs text-white/20 italic text-center py-6">Playlist is empty.</p>
                  )}
                </div>
              </div>
              {playlist.videos.length > 0 && (
                <button 
                  onClick={() => handleVideoSelect(playlist.videos[0].id)}
                  className="w-full bg-white/5 hover:bg-amber-500 hover:text-white text-amber-500 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider mt-4"
                >
                  <Play size={14} fill="currentColor" /> Play Playlist
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Playlist Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-dark p-8 rounded-[2.5rem] border-white/10 shadow-2xl relative"
            >
              <h3 className="text-xl font-black mb-4">Create New Playlist</h3>
              <form onSubmit={createPlaylist} className="space-y-6">
                <input 
                  type="text" 
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist Name" 
                  className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-medium text-sm"
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
