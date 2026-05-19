import axios from 'axios';
import { quotaTracker } from '../utils/quotaTracker';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If VITE_API_URL points to localhost, but we're accessing from another device (e.g. local network IP)
    if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return envUrl.replace('localhost', hostname).replace('127.0.0.1', hostname);
      }
      return envUrl;
    }
    
    // Fallback if VITE_API_URL is not defined
    if (!envUrl) {
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
      }
      // If accessing via local IP, point to port 5000 on the same host IP
      if (/^[0-9.]+$/.test(hostname) || hostname.endsWith('.local')) {
        return `http://${hostname}:5000/api`;
      }
      return '/api';
    }
  }
  
  return envUrl || '/api';
};

const API_URL = getApiUrl();

export const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, { params });
    quotaTracker.track(endpoint);
    return response.data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    if (error.response?.status === 404) return null;
    throw error;
  }
};
