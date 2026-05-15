import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import { fetchFromAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFromAPI(`search?part=snippet&q=${searchTerm}&maxResults=50&relevanceLanguage=${selectedLanguage.code}`);
        setVideos(data?.items || []);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [searchTerm, selectedLanguage]);

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)]">
      <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-yt-bg">
        <h2 className="text-2xl font-bold text-white mb-6">
          Search Results for: <span className="text-red-600">{searchTerm}</span>
        </h2>
        <VideoGrid videos={videos} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SearchResults;
