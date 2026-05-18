import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, Film, Tv, User } from 'lucide-react';

const CinematicBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Trending', icon: Sparkles, path: '/trending' },
    { label: 'Movies', icon: Film, path: '/category/Movies' },
    { label: 'TV Shows', icon: Tv, path: '/category/TV Series' },
    { label: 'My Profile', icon: User, path: '/profile' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0502]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-2 pb-5 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.path);

        return (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center gap-1 py-1 px-3 relative cursor-pointer select-none transition-all duration-300"
          >
            <div className="relative">
              <IconComponent 
                size={20} 
                className={`transition-all duration-300 ${
                  active ? 'text-orange-500 scale-110' : 'text-white/40 hover:text-white'
                }`} 
              />
              {active && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute -inset-2 bg-orange-500/10 rounded-full blur-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
            <span 
              className={`text-[9px] font-black tracking-wider uppercase font-mono transition-all duration-300 ${
                active ? 'text-orange-500' : 'text-white/40'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CinematicBottomNav;
