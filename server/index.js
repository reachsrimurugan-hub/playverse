const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(cors());
app.use(express.json());

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Normalize YouTube Response
const normalizeVideo = (item) => {
  const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
  return {
    id: videoId,
    videoId: videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    category: item.snippet.categoryId,
    tags: item.snippet.tags || [],
    duration: item.contentDetails?.duration || 'PT0M0S',
    views: item.statistics?.viewCount || '0',
    likes: item.statistics?.likeCount || '0',
    embedUrl: `https://www.youtube.com/embed/${videoId}`
  };
};

// Return all videos without filtering
const processVideos = (videos) => {
  return videos.map(normalizeVideo);
};

// 1. Get Popular Videos (Dashboard)
app.get('/api/videos', async (req, res) => {
  const cacheKey = 'popular_videos_all';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        maxResults: 50, // Increased results
        key: API_KEY
      }
    });

    const processed = processVideos(response.data.items);
    
    cache.set(cacheKey, processed);
    res.json(processed);
  } catch (error) {
    console.error('Error fetching popular videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// 2. Search Videos
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query required' });

  const cacheKey = `search_all_${q}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    // Search first to get IDs
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: q, // Remove ' trailer' append
        type: 'video',
        maxResults: 50,
        key: API_KEY
      }
    });

    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

    // Get full details (contentDetails, statistics)
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY
      }
    });

    const processed = processVideos(detailsResponse.data.items);

    cache.set(cacheKey, processed);
    res.json(processed);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 3. Get Video Details
app.get('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `video_${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: id,
        key: API_KEY
      }
    });

    if (!response.data.items.length) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const normalized = normalizeVideo(response.data.items[0]);
    cache.set(cacheKey, normalized);
    res.json(normalized);
  } catch (error) {
    console.error('Video detail error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// 4. Get Related Videos
app.get('/api/videos/:id/related', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `related_${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        relatedToVideoId: id,
        type: 'video',
        maxResults: 10,
        key: API_KEY
      }
    });

    // For related, we might not have contentDetails easily without another call
    // But for the sidebar, simple normalization is often enough
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY
      }
    });

    const processed = processVideos(detailsResponse.data.items);
    cache.set(cacheKey, processed);
    res.json(processed);
  } catch (error) {
    console.error('Related videos error:', error.message);
    // Fallback to empty instead of 500
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Nextube Backend running on port ${port}`);
});
