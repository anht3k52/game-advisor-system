import axios from 'axios';

const rawgClient = axios.create({
  baseURL: 'https://api.rawg.io/api'
});

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function buildCacheKey(url, params) {
  return `${url}:${JSON.stringify(params || {})}`;
}

function setCache(key, value) {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

async function request(url, params = {}) {
  const key = buildCacheKey(url, params);
  const cached = getCache(key);
  if (cached) {
    return cached;
  }

  const response = await rawgClient.get(url, {
    params: {
      key: process.env.RAWG_API_KEY,
      ...params
    }
  });

  setCache(key, response.data);
  return response.data;
}

export async function fetchPopularGames({ page = 1, pageSize = 20 } = {}) {
  return request('/games/lists/popular', {
    page,
    page_size: pageSize
  });
}

export async function fetchGameDetails(id) {
  return request(`/games/${id}`);
}

export async function searchGames(params) {
  return request('/games', params);
}

export async function fetchGamesByIds(ids = []) {
  const results = await Promise.all(ids.map((id) => fetchGameDetails(id)));
  return results;
}

export async function fetchGamesByGenres(genres = [], { pageSize = 20 } = {}) {
  if (!genres.length) {
    return fetchPopularGames({ pageSize });
  }

  return request('/games', {
    genres: genres.join(','),
    ordering: '-rating',
    page_size: pageSize
  });
}
