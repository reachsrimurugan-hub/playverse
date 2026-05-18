import axios from 'axios';
import { quotaTracker } from '../utils/quotaTracker';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
