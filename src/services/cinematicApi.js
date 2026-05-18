import { fetchFromAPI } from './api';

/**
 * Get popular videos (Dashboard)
 */
export const getPopularMovies = async () => {
  return await fetchFromAPI('/videos');
};

/**
 * Search videos
 */
export const searchVideos = async (query) => {
  return await fetchFromAPI('/search', { q: query });
};

/**
 * Get trending trailers (Actually same as popular for now, or filtered)
 */
export const getTrendingTrailers = async () => {
  return await fetchFromAPI('/videos'); // Backend already filters for popular/trending
};

/**
 * Get video details by ID
 */
export const getVideoDetails = async (id) => {
  return await fetchFromAPI(`/videos/${id}`);
};

/**
 * Get related videos
 */
export const getRelatedVideos = async (id) => {
  return await fetchFromAPI(`/videos/${id}/related`);
};
