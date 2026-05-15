import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { fetchFromAPI } from '../services/api';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const data = await fetchFromAPI(`search?part=snippet&q=${searchTerm}&type=video&maxResults=5`);
          setSuggestions(data?.items || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching search suggestions", error);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowDropdown(false);
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setShowDropdown(false);
    navigate(`/search/${title}`);
  };

  return (
    <div className="relative w-full group flex items-center" ref={dropdownRef}>
      <form 
        onSubmit={handleSubmit}
        className="flex w-full items-center"
      >
        <div className="flex w-full items-center bg-yt-bg border border-[#303030] rounded-l-full px-4 py-2 focus-within:border-blue-500 ml-4 transition-colors">
          <FiSearch className="text-yt-textMuted mr-2 hidden sm:block group-focus-within:text-yt-text" />
          <input 
            type="text" 
            className="w-full bg-transparent outline-none text-yt-text placeholder-yt-textMuted" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowDropdown(true) }}
          />
        </div>
        <button 
          type="submit" 
          className="px-5 py-2.5 bg-yt-light border border-l-0 border-[#303030] rounded-r-full hover:bg-yt-hover transition-colors"
        >
          <FiSearch className="text-yt-text" size={18} />
        </button>
      </form>
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-[58px] mt-1 bg-yt-light border border-[#303030] rounded-xl shadow-2xl z-50 overflow-hidden py-2">
          {suggestions.map((item, idx) => {
            const title = item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            return (
              <div 
                key={idx}
                className="px-4 py-2.5 hover:bg-yt-hover cursor-pointer flex items-center gap-4 text-yt-text transition-colors"
                onClick={() => handleSuggestionClick(title)}
              >
                <FiSearch className="text-yt-textMuted shrink-0" size={16} />
                <span className="line-clamp-1 text-sm font-medium">
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
