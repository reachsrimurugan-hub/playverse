const QUOTA_KEY = 'nextube_quota_usage';

const ENDPOINT_COSTS = {
  'search': 100,
  'videos': 1,
  'channels': 1,
  'playlistItems': 1,
  'commentThreads': 1,
  'subscriptions': 1,
};

export const quotaTracker = {
  getUsage: () => {
    const data = localStorage.getItem(QUOTA_KEY);
    return data ? JSON.parse(data) : { total: 0, endpoints: {}, dailyLimit: 10000 };
  },

  track: (url) => {
    const usage = quotaTracker.getUsage();
    let cost = 1; // Default cost

    for (const [endpoint, endpointCost] of Object.entries(ENDPOINT_COSTS)) {
      if (url.includes(endpoint)) {
        cost = endpointCost;
        break;
      }
    }

    usage.total += cost;
    const endpointBase = url.split('?')[0];
    usage.endpoints[endpointBase] = (usage.endpoints[endpointBase] || 0) + cost;
    
    localStorage.setItem(QUOTA_KEY, JSON.stringify(usage));
    
    if (usage.total > usage.dailyLimit * 0.8) {
      console.warn(`YouTube API Quota Warning: Using ${usage.total}/${usage.dailyLimit}`);
    }

    return cost;
  },

  reset: () => {
    localStorage.setItem(QUOTA_KEY, JSON.stringify({ total: 0, endpoints: {}, dailyLimit: 10000 }));
  }
};
