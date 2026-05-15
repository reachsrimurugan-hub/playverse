import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}&key=${API_KEY}`);
    return data;
  } catch (error) {
    console.error('Error fetching from YouTube API', error);
    throw error;
  }
};
