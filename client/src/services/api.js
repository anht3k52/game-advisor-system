import axios from 'axios';
import { mockUsers, mockGames, mockComments, mockBroadcasts } from '../mockData.js';

const api = axios.create({
  baseURL: '/api'
});

const shouldMock = import.meta.env.VITE_USE_MOCK === 'true';

const mockState = {
  users: mockUsers.map((user) => ({ ...user })),
  games: mockGames.map((game) => ({ ...game })),
  comments: mockComments.map((comment) => ({ ...comment })),
  broadcasts: mockBroadcasts
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const randomId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

async function withMock(realCall, mockCall) {
  if (!shouldMock) {
    try {
      return await realCall();
    } catch (error) {
      if (!mockCall) throw error;
      console.warn('Không kết nối được API thật, chuyển sang dữ liệu mô phỏng.', error);
    }
  }

  if (!mockCall) {
    return undefined;
  }

  await delay();
  return mockCall();
}

const recommendationWeights = {
  genre: 3,
  platform: 2,
  budget: 1,
  playStyle: 2,
  rating: 1
};

const scoreGame = (game, preferences = {}) => {
  const {
    favoriteGenres = [],
    preferredPlatforms = [],
    budget,
    playStyles = []
  } = preferences;

  let score = 0;

  if (favoriteGenres.includes(game.genre)) {
    score += recommendationWeights.genre;
  }

  if (game.platform.some((platform) => preferredPlatforms.includes(platform))) {
    score += recommendationWeights.platform;
  }

  if (typeof budget === 'number' && Number.isFinite(budget) && game.price <= budget) {
    score += recommendationWeights.budget;
  }

  if (game.tags.some((tag) => playStyles.includes(tag))) {
    score += recommendationWeights.playStyle;
  }

  score += (game.rating / 5) * recommendationWeights.rating;

  return score;
};

const matchesQuery = (game, query) => {
  const keyword = query.keyword?.trim().toLowerCase();
  const genre = query.genre?.trim().toLowerCase();
  const platform = query.platform?.trim().toLowerCase();
  const tag = query.tag?.trim().toLowerCase();
  const releaseYear = query.releaseYear ? Number(query.releaseYear) : undefined;
  const minRating = query.minRating ? Number(query.minRating) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  if (keyword && !game.title.toLowerCase().includes(keyword)) {
    return false;
  }

  if (genre && game.genre.toLowerCase() !== genre) {
    return false;
  }

  if (platform && !game.platform.some((p) => p.toLowerCase().includes(platform))) {
    return false;
  }

  if (typeof minRating === 'number' && game.rating < minRating) {
    return false;
  }

  if (typeof maxPrice === 'number' && game.price > maxPrice) {
    return false;
  }

  if (typeof releaseYear === 'number' && game.releaseYear !== releaseYear) {
    return false;
  }

  if (tag && !game.tags.some((t) => t.toLowerCase().includes(tag))) {
    return false;
  }

  return true;
};

const calculateMetrics = () => {
  const ratings = mockState.comments.filter((comment) => typeof comment.rating === 'number');
  const avgRating = ratings.length
    ? ratings.reduce((sum, comment) => sum + comment.rating, 0) / ratings.length
    : 0;

  return {
    totalUsers: mockState.users.length,
    totalGames: mockState.games.length,
    totalComments: mockState.comments.length,
    averageRating: Number(avgRating.toFixed(2)),
    latestComments: clone(
      mockState.comments
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    )
  };
};

export const apiClient = {
  async fetchUsers() {
    return withMock(
      () => api.get('/users').then((res) => res.data),
      () => clone(mockState.users)
    );
  },

  async createUser(payload) {
    return withMock(
      () => api.post('/users', payload).then((res) => res.data),
      () => {
        const created = { id: randomId('u'), ...payload };
        mockState.users.push(created);
        return clone(created);
      }
    );
  },

  async fetchGames() {
    return withMock(
      () => api.get('/games').then((res) => res.data),
      () => clone(mockState.games)
    );
  },

  async createGame(payload) {
    return withMock(
      () => api.post('/games', payload).then((res) => res.data),
      () => {
        const created = { id: randomId('g'), ...payload };
        mockState.games.push(created);
        return clone(created);
      }
    );
  },

  async recommend(preferences) {
    return withMock(
      () =>
        api
          .post('/recommendations', { preferences })
          .then((res) => res.data.recommendations),
      () => {
        const scored = mockState.games
          .map((game) => ({ ...game, score: scoreGame(game, preferences) }))
          .filter((game) => game.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        return scored;
      }
    );
  },

  async searchGames(query) {
    return withMock(
      () => api.get('/search', { params: query }).then((res) => res.data.results),
      () => mockState.games.filter((game) => matchesQuery(game, query))
    );
  },

  async searchExternalGames({ query = '', page = 1 } = {}) {
    return withMock(
      () =>
        api
          .get('/external-games/search', { params: { query, page } })
          .then((res) => res.data),
      () => {
        const keyword = query.trim().toLowerCase();
        const filtered = mockState.games
          .filter((game) => !keyword || game.title.toLowerCase().includes(keyword))
          .slice(0, 10)
          .map((game) => ({
            id: game.id,
            title: game.title,
            released: game.releaseYear ? String(game.releaseYear) : 'Đang cập nhật',
            rating: game.rating,
            genres: [game.genre],
            platforms: game.platform,
            thumbnail: null,
            metacritic: null,
            description: game.description
          }));

        return {
          source: 'mock',
          total: filtered.length,
          results: filtered
        };
      }
    );
  },

  async fetchExternalGameDetails(gameId) {
    return withMock(
      () => api.get(`/external-games/${gameId}`).then((res) => res.data),
      () => {
        const found = mockState.games.find((game) => game.id === gameId);
        if (!found) {
          return {
            source: 'mock',
            id: gameId,
            title: 'Không tìm thấy game trong dữ liệu mô phỏng',
            description: 'Hãy thử gọi API RAWG khi đã cấu hình API key.',
            genres: [],
            platforms: [],
            ratingsCount: null,
            publishers: [],
            developers: [],
            tags: [],
            stores: [],
            thumbnail: null,
            metacritic: null,
            esrbRating: null,
            website: null
          };
        }

        return {
          source: 'mock',
          id: found.id,
          title: found.title,
          description: found.description,
          released: found.releaseYear ? String(found.releaseYear) : undefined,
          rating: found.rating,
          ratingsCount: null,
          genres: [found.genre],
          platforms: found.platform,
          publishers: [],
          developers: [],
          tags: found.tags || [],
          stores: [],
          thumbnail: null,
          metacritic: null,
          esrbRating: null,
          website: null
        };
      }
    );
  },

  async compareGames(gameIds) {
    return withMock(
      () => api.post('/comparisons', { gameIds }).then((res) => res.data.comparison),
      () => mockState.games.filter((game) => gameIds.includes(game.id))
    );
  },

  async fetchComments() {
    return withMock(
      () => api.get('/comments').then((res) => res.data),
      () => clone(mockState.comments)
    );
  },

  async createComment(payload) {
    return withMock(
      () => api.post('/comments', payload).then((res) => res.data),
      () => {
        const user = mockState.users.find((candidate) => candidate.id === payload.userId);
        const created = {
          id: randomId('c'),
          createdAt: new Date().toISOString(),
          userName: user?.name || 'Ẩn danh',
          ...payload
        };
        mockState.comments.push(created);
        return clone(created);
      }
    );
  },

  async deleteComment(commentId) {
    return withMock(
      () => api.delete(`/comments/${commentId}`).then((res) => res.data),
      () => {
        mockState.comments = mockState.comments.filter((comment) => comment.id !== commentId);
        return { id: commentId };
      }
    );
  },

  async fetchMetrics() {
    return withMock(
      () => api.get('/admin/metrics').then((res) => res.data),
      () => calculateMetrics()
    );
  },

  async broadcastMessage(message) {
    return withMock(
      () => api.post('/admin/broadcast', { message }).then((res) => res.data),
      () => {
        const entry = { id: randomId('m'), message, createdAt: new Date().toISOString() };
        mockState.broadcasts.push(entry);
        return clone(entry);
      }
    );
  }
};
