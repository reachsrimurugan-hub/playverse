const CACHE_PREFIX = 'nextube_cache_';

export const cache = {
  get: (key) => {
    const item = localStorage.getItem(CACHE_PREFIX + key) || sessionStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    try {
      const { value, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(CACHE_PREFIX + key);
        sessionStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return value;
    } catch (e) {
      return null;
    }
  },

  set: (key, value, ttlMinutes = 15, useSession = false) => {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    const item = JSON.stringify({ value, expiry });
    const storage = useSession ? sessionStorage : localStorage;
    storage.setItem(CACHE_PREFIX + key, item);
  },

  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(key);
    });
  }
};

// In-memory cache for ultra-fast access within the same session
const memoryStore = new Map();

export const memoryCache = {
  get: (key) => {
    const item = memoryStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },
  set: (key, value, ttlMinutes = 5) => {
    memoryStore.set(key, {
      value,
      expiry: Date.now() + ttlMinutes * 60 * 1000
    });
  }
};
