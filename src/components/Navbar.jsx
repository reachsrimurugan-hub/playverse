import { Link } from 'react-router-dom';
import { FiMenu, FiBell, FiGlobe } from 'react-icons/fi';
import SearchBar from './SearchBar';
import { useSidebar } from '../context/SidebarContext';
import { useLanguage, languages } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-2 h-16 bg-yt-bg sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-yt-light rounded-full transition-colors text-yt-text hidden md:block"
        >
          <FiMenu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold tracking-tighter shadow-lg shadow-red-600/20">
            NX
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">Nextube</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center max-w-2xl px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="p-2 hover:bg-yt-light rounded-full transition-colors flex items-center gap-1"
          >
            <FiGlobe size={20} />
            <span className="text-xs hidden lg:block uppercase font-bold">{selectedLanguage.code}</span>
          </button>
          
          {showLangDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-yt-light border border-[#303030] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2 text-xs font-bold text-yt-textMuted border-b border-[#303030] uppercase">Select Language</div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-yt-hover transition-colors ${selectedLanguage.code === lang.code ? 'bg-yt-hover text-white font-bold' : 'text-yt-text'}`}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="p-2 hover:bg-yt-light rounded-full transition-colors hidden sm:block">
          <FiBell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-semibold cursor-pointer shadow-lg shadow-blue-500/20">
          U
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
