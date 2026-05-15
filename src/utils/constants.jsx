import React from 'react';
import { FiHome, FiTrendingUp, FiMusic, FiMonitor, FiRadio, FiCpu, FiBookOpen } from 'react-icons/fi';

export const categories = [
  { name: 'New', icon: <FiHome />, type: 'home' },
  { name: 'Trending', icon: <FiTrendingUp />, type: 'category' },
  { name: 'Music', icon: <FiMusic />, type: 'category' },
  { name: 'Gaming', icon: <FiMonitor />, type: 'category' },
  { name: 'Podcasts', icon: <FiRadio />, type: 'category' },
  { name: 'Technology', icon: <FiCpu />, type: 'category' },
  { name: 'Education', icon: <FiBookOpen />, type: 'category' },
];
