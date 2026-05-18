const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');

// Load environment variables from both root and server directories
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const app = express();
const port = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(cors());
app.use(express.json());

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
// Robust API Key configuration with production fallback
const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyCLRL7wxpn2MZqta0U9_iHwdPZk0SpFsgs';

// Normalize YouTube Response
const normalizeVideo = (item) => {
  const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
  
  // Safe default fallback thumbnail (sleek, high-quality cinematic abstract banner)
  const fallbackThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
  
  return {
    id: videoId,
    videoId: videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.maxres?.url || 
               item.snippet.thumbnails?.standard?.url || 
               item.snippet.thumbnails?.high?.url || 
               item.snippet.thumbnails?.medium?.url || 
               item.snippet.thumbnails?.default?.url || 
               fallbackThumbnail,
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
app.get(['/api/videos', '/videos'], async (req, res) => {
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
app.get(['/api/search', '/search'], async (req, res) => {
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
app.get(['/api/videos/:id', '/videos/:id'], async (req, res) => {
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

// 4. Get Related Videos (Robust fallback for deprecated relatedToVideoId)
app.get(['/api/videos/:id/related', '/videos/:id/related'], async (req, res) => {
  const { id } = req.params;
  const cacheKey = `related_${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    // 1. Get current video details to find its title and category
    const videoDetailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet',
        id: id,
        key: API_KEY
      }
    });

    let processed = [];

    if (videoDetailsResponse.data.items && videoDetailsResponse.data.items.length > 0) {
      const currentVideo = videoDetailsResponse.data.items[0];
      const title = currentVideo.snippet.title;
      const categoryId = currentVideo.snippet.categoryId;

      // Extract the first 3 words of the title to get relevant keyword suggestions
      const query = title.split(' ').slice(0, 3).join(' ').replace(/[^\w\s]/gi, '');

      // 2. Perform a keyword search using the title query (accurate fallback)
      try {
        const searchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 15,
            key: API_KEY
          }
        });

        const videoIds = searchResponse.data.items
          .map(item => item.id.videoId)
          .filter(videoId => videoId && videoId !== id)
          .join(',');

        if (videoIds) {
          const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
            params: {
              part: 'snippet,statistics,contentDetails',
              id: videoIds,
              key: API_KEY
            }
          });
          processed = processVideos(detailsResponse.data.items);
        }
      } catch (searchError) {
        console.error('Search-based related videos fallback failed, trying category fallback:', searchError.message);
      }

      // 3. Quota-friendly Category-based fallback if search failed or returned empty
      if (processed.length === 0 && categoryId) {
        try {
          const categoryResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
            params: {
              part: 'snippet,statistics,contentDetails',
              chart: 'mostPopular',
              videoCategoryId: categoryId,
              maxResults: 15,
              key: API_KEY
            }
          });
          processed = processVideos(categoryResponse.data.items.filter(item => item.id !== id));
        } catch (categoryError) {
          console.error('Category-based related videos fallback failed:', categoryError.message);
        }
      }
    }

    cache.set(cacheKey, processed);
    res.json(processed);
  } catch (error) {
    console.error('Related videos error:', error.message);
    res.json([]);
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Nextube Backend running on port ${port}`);
  });
}

module.exports = app;
