import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import DesktopBrowseSidebar from '../components/DesktopBrowseSidebar';
import VideoListItem from '../components/VideoListItem';
import VideoGridCard from '../components/VideoGridCard';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, Disc3 } from 'lucide-react';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState({
    watchLater: [],
    favorites: [],
    custom: [],
  });
  const [activeTab, setActiveTab] = useState('Videos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    setPlaylists({
      watchLater: JSON.parse(localStorage.getItem('nextube_watch_later') || '[]'),
      favorites: JSON.parse(localStorage.getItem('nextube_favorites') || '[]'),
      custom: JSON.parse(localStorage.getItem('nextube_custom_playlists') || '[]'),
    });
  }, []);

  const createPlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPlaylist = { id: `playlist_${Date.now()}`, name: newPlaylistName, videos: [] };
    const updatedCustom = [...playlists.custom, newPlaylist];
    setPlaylists((prev) => ({ ...prev, custom: updatedCustom }));
    localStorage.setItem('nextube_custom_playlists', JSON.stringify(updatedCustom));
    setNewPlaylistName('');
    setShowCreateModal(false);
  };

  const deleteCustomPlaylist = (id) => {
    const updatedCustom = playlists.custom.filter((p) => p.id !== id);
    setPlaylists((prev) => ({ ...prev, custom: updatedCustom }));
    localStorage.setItem('nextube_custom_playlists', JSON.stringify(updatedCustom));
  };

  const allSavedVideos = [];
  const seenIds = new Set();
  [...playlists.watchLater, ...playlists.favorites].forEach((video) => {
    const id = video.videoId || video.id;
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      allSavedVideos.push(video);
    }
  });

  const handleVideoSelect = (video) => {
    navigate(`/watch/${video.videoId || video.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
      <CinematicNavbar onSearch={(q) => navigate(`/search/${q}`)} />

      <div className="flex w-full max-w-[1920px] mx-auto pt-[4.5rem] lg:pt-20">
        <DesktopBrowseSidebar />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        <header className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <h1 className="text-2xl font-bold text-white">My List</h1>
          <button
            type="button"
            className="p-2 text-white hover:text-[#f97316] transition-colors"
            aria-label="Edit list"
          >
            <Pencil size={22} />
          </button>
        </header>

        <div className="flex gap-8 border-b border-white/[0.08] mb-2">
          {['Videos', 'Playlists'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pv-tab ${activeTab === tab ? 'pv-tab-active' : 'pv-tab-inactive'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="myListTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f97316]"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Videos' && (
          <>
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {allSavedVideos.map((video) => (
                <VideoGridCard key={video.videoId || video.id} video={video} onClick={handleVideoSelect} />
              ))}
            </div>
            <div className="md:hidden divide-y divide-white/[0.06]">
              {allSavedVideos.map((video, idx) => (
                <VideoListItem
                  key={video.videoId || video.id}
                  video={video}
                  onClick={handleVideoSelect}
                  showTrailerBadge={idx === 1}
                />
              ))}
            </div>
            {allSavedVideos.length === 0 && (
              <p className="text-center py-20 text-[#8e8e93] text-sm">No videos saved yet.</p>
            )}
          </>
        )}

        {activeTab === 'Playlists' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#8e8e93]">Custom Collections</p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 bg-[#f97316] hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                <Plus size={14} /> Create Playlist
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.custom.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-[#1a1a1a] border border-white/[0.06] rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#f97316]/15 rounded-xl">
                        <Disc3 size={20} className="text-[#f97316]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{playlist.name}</h4>
                        <p className="text-xs text-[#8e8e93]">{playlist.videos.length} videos</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCustomPlaylist(playlist.id)}
                      className="p-2 text-[#8e8e93] hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {playlists.custom.length === 0 && (
                <p className="col-span-full text-center py-12 text-[#8e8e93] text-sm">
                  No custom playlists yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">New Playlist</h3>
            <form onSubmit={createPlaylist} className="space-y-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#f97316]"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-[#8e8e93] hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f97316] text-white rounded-lg text-sm font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;

