import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CinematicNavbar from '../components/CinematicNavbar';
import CinematicHero from '../components/CinematicHero';
import VideoListItem from '../components/VideoListItem';
import VideoGridCard from '../components/VideoGridCard';
import { getPopularMovies, searchVideos } from '../services/cinematicApi';
import { LayoutGrid, Flame, Film, Music, Tv, Play } from 'lucide-react';

const DASHBOARD_CATEGORIES = [
  { name: 'All', icon: LayoutGrid, term: 'All' },
  { name: 'Trending', icon: Flame, term: 'Trending' },
  { name: 'Music', icon: Music, term: 'Music' },
  { name: 'Movies', icon: Film, term: 'Movies' },
  { name: 'TV Shows', icon: Tv, term: 'TV Series' },
];

const CinematicDashboard = () => {
  const navigate = useNavigate();
  const [heroVideo, setHeroVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('nextube_history') || '[]');
    setContinueWatching(history.slice(0, 8));
  }, []);

  const fetchDashboardContent = useCallback(
    async (category = 'All', searchVal = '') => {
      setLoading(true);
      setVisibleCount(20);
      try {
        let results = [];
        if (searchVal) {
          results = await searchVideos(searchVal);
        } else if (category === 'All' || category === 'Trending') {
          const popular = await getPopularMovies();
          results = popular || [];
          if (popular?.length > 0 && !heroVideo) setHeroVideo(popular[0]);
        } else {
          results = await searchVideos(category);
        }
        setAllVideos(results);
      } catch (error) {
        console.error('Failed to fetch dashboard content', error);
      } finally {
        setLoading(false);
      }
    },
    [heroVideo]
  );

  useEffect(() => {
    fetchDashboardContent(activeCategory, searchQuery);
  }, []);

  const displayedVideos = useMemo(() => allVideos.slice(0, visibleCount), [allVideos, visibleCount]);

  const heroId = heroVideo ? heroVideo.videoId || heroVideo.id : null;
  const withoutHero = useMemo(
    () => displayedVideos.filter((v) => (v.videoId || v.id) !== heroId),
    [displayedVideos, heroId]
  );

  const trendingRow = useMemo(() => withoutHero.slice(0, 5), [withoutHero]);
  const popularRow = useMemo(() => withoutHero.slice(5, 15), [withoutHero]);

  const handleVideoSelect = useCallback(
    (video) => {
      navigate(`/watch/${video.videoId || video.id}`);
    },
    [navigate]
  );

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    fetchDashboardContent(category, '');
  };

  const showWebRows =
    !searchQuery && activeCategory === 'All' && !loading && withoutHero.length > 0;

  return (
    <div className="min-h-screen bg-black text-white pb-24 lg:pb-10">
      <CinematicNavbar
        onSearch={(q) => navigate(`/search/${q}`)}
        searchResults={searchQuery ? allVideos.slice(0, 5) : []}
        onVideoSelect={handleVideoSelect}
      />

      <main className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-[4.5rem] lg:pt-24 space-y-8 lg:space-y-12">
        {!searchQuery && activeCategory === 'All' && heroVideo && (
          <CinematicHero video={heroVideo} onPlay={handleVideoSelect} />
        )}

        <section className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Stream Categories</h2>
            <Link to="/categories" className="text-sm font-semibold text-[#f97316] hover:text-orange-400">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
            {DASHBOARD_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.term;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.term)}
                  className={`flex-shrink-0 w-[88px] h-[88px] rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${
                    active
                      ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]'
                      : 'border-white/10 bg-[#1a1a1a] text-white/70'
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
                  <span className="text-[11px] font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Browse</h2>
            <Link to="/category/All" className="text-sm font-semibold text-[#f97316] hover:text-orange-400">
              View all videos
            </Link>
          </div>
        </section>

        {showWebRows && (
          <>
            <section>
              <div className="flex items-center justify-between mb-4 lg:mb-5">
                <h2 className="text-lg lg:text-xl font-bold text-white">Trending Now</h2>
                <Link to="/trending" className="text-sm font-semibold text-[#f97316] hover:text-orange-400">
                  View all
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {trendingRow.map((video, idx) => (
                  <VideoGridCard key={video.videoId || video.id || idx} video={video} onClick={handleVideoSelect} />
                ))}
              </div>
              <div className="md:hidden divide-y divide-white/[0.06]">
                {trendingRow.map((video, idx) => (
                  <VideoListItem
                    key={video.videoId || video.id || idx}
                    video={video}
                    onClick={handleVideoSelect}
                    showTrailerBadge={idx === 1}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 lg:mb-5">
                <h2 className="text-lg lg:text-xl font-bold text-white">Popular on PlayVerse</h2>
                <Link to="/category/All" className="text-sm font-semibold text-[#f97316] hover:text-orange-400">
                  View all
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {popularRow.map((video, idx) => (
                  <VideoGridCard key={video.videoId || video.id || `p-${idx}`} video={video} onClick={handleVideoSelect} />
                ))}
              </div>
              <div className="md:hidden divide-y divide-white/[0.06]">
                {popularRow.map((video, idx) => (
                  <VideoListItem key={video.videoId || video.id || `p-${idx}`} video={video} onClick={handleVideoSelect} />
                ))}
              </div>
            </section>
          </>
        )}

        {(!showWebRows || searchQuery || activeCategory !== 'All') && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base lg:text-xl font-bold text-white">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : activeCategory === 'All'
                    ? 'Featured'
                    : `${activeCategory} Streams`}
              </h2>
              {!loading && allVideos.length > visibleCount && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="text-sm font-semibold text-[#f97316]"
                >
                  Load more
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="aspect-video bg-[#1a1a1a] rounded-xl" />
                    <div className="h-3 bg-[#1a1a1a] rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {displayedVideos.map((video, idx) => (
                    <VideoGridCard key={video.videoId || video.id || idx} video={video} onClick={handleVideoSelect} />
                  ))}
                </div>
                <div className="md:hidden divide-y divide-white/[0.06]">
                  {displayedVideos.map((video, idx) => (
                    <VideoListItem
                      key={video.videoId || video.id || idx}
                      video={video}
                      onClick={handleVideoSelect}
                      showTrailerBadge={idx === 1}
                    />
                  ))}
                </div>
              </>
            )}

            {!loading && displayedVideos.length === 0 && (
              <p className="text-center py-16 text-[#8e8e93] text-sm">No videos found.</p>
            )}
          </section>
        )}

        {!searchQuery && activeCategory === 'All' && continueWatching.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-xl font-bold text-white">Continue Watching</h2>
              <Link to="/history" className="text-sm font-semibold text-[#f97316] hover:text-orange-400">
                View all
              </Link>
            </div>
            <div className="flex gap-3 lg:gap-4 overflow-x-auto hide-scrollbar pb-1">
              {continueWatching.map((item, idx) => {
                const progress = [72, 45, 30, 60, 20, 85, 50, 35][idx % 8];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/watch/${item.id}`)}
                    className="flex-shrink-0 w-[110px] sm:w-[130px] lg:w-[140px] text-left group"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] mb-2 ring-1 ring-white/[0.06]">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={28} className="text-white" fill="white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full bg-[#f97316]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-white line-clamp-2 leading-snug">{item.title}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CinematicDashboard;
