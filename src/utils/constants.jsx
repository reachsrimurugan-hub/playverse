import React from 'react';
import { 
  FiHome, FiTrendingUp, FiMusic, 
  FiFilm, FiMonitor, FiCpu, FiMessageSquare 
} from 'react-icons/fi';

export const categories = [
  { name: 'Home', icon: <FiHome size={20} />, id: '' },
  { name: 'Trending', icon: <FiTrendingUp size={20} />, id: 'trending' },
  { name: 'Music', icon: <FiMusic size={20} />, id: 'music' },
  { name: 'Movies', icon: <FiFilm size={20} />, id: 'movies' },
  { name: 'Gaming', icon: <FiMonitor size={20} />, id: 'gaming' },
  { name: 'Tech', icon: <FiCpu size={20} />, id: 'tech' },
  { name: 'Podcasts', icon: <FiMessageSquare size={20} />, id: 'podcasts' },
];
