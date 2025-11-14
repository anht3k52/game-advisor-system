import fetch from 'node-fetch';

const RAWG_BASE_URL = 'https://api.rawg.io/api';

const ensureApiKey = () => {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    const error = new Error('RAWG_API_KEY chưa được cấu hình. Vui lòng tạo API key từ RAWG và cập nhật biến môi trường.');
    error.status = 500;
    throw error;
  }
  return apiKey;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const message = `RAWG API trả về lỗi ${response.status} - ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const formatSummary = (game) => ({
  id: String(game.id),
  title: game.name,
  released: game.released,
  rating: game.rating,
  ratingsCount: game.ratings_count,
  genres: (game.genres || []).map((genre) => genre.name),
  platforms: (game.parent_platforms || game.platforms || [])
    .map((entry) => entry?.platform?.name)
    .filter(Boolean),
  thumbnail: game.background_image,
  metacritic: game.metacritic
});

const formatStore = (store) => {
  if (!store?.store?.name) {
    return null;
  }

  const storeUrl = store.url
    || (store.store?.domain ? `https://${store.store.domain}` : null);

  return {
    id: String(store.id ?? store.store?.id ?? store.store?.slug ?? store.store?.name),
    name: store.store.name,
    url: storeUrl
  };
};

const formatDetails = (game) => ({
  source: 'rawg',
  id: String(game.id),
  title: game.name,
  description: game.description_raw || '',
  released: game.released,
  updated: game.updated,
  website: game.website,
  rating: game.rating,
  ratingsCount: game.ratings_count,
  genres: (game.genres || []).map((genre) => genre.name),
  platforms: (game.platforms || [])
    .map((entry) => entry?.platform?.name)
    .filter(Boolean),
  publishers: (game.publishers || []).map((publisher) => publisher.name),
  developers: (game.developers || []).map((developer) => developer.name),
  stores: (game.stores || []).map(formatStore).filter(Boolean),
  thumbnail: game.background_image,
  metacritic: game.metacritic,
  esrbRating: game.esrb_rating?.name || null,
  tags: (game.tags || []).slice(0, 8).map((tag) => tag.name)
});

export async function searchExternalGames(query = '', page = 1, pageSize = 10) {
  const apiKey = ensureApiKey();
  const url = new URL(`${RAWG_BASE_URL}/games`);

  url.searchParams.set('key', apiKey);
  url.searchParams.set('page', Number(page) || 1);
  url.searchParams.set('page_size', Number(pageSize) || 10);

  const normalizedQuery = typeof query === 'string' ? query : String(query ?? '');
  const trimmedQuery = normalizedQuery.trim();
  if (trimmedQuery) {
    url.searchParams.set('search', trimmedQuery);
  }

  const data = await fetchJson(url);

  return {
    source: 'rawg',
    total: data.count ?? data.results?.length ?? 0,
    nextPage: data.next ? Number(page) + 1 : null,
    previousPage: data.previous ? Math.max(Number(page) - 1, 1) : null,
    results: (data.results || []).map(formatSummary)
  };
}

export async function getExternalGameDetails(id) {
  const apiKey = ensureApiKey();
  const url = new URL(`${RAWG_BASE_URL}/games/${id}`);
  url.searchParams.set('key', apiKey);

  const data = await fetchJson(url);
  return formatDetails(data);
}
