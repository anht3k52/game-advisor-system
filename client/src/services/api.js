import axios from 'axios';
import {
  mockUsers,
  mockGames,
  mockComments,
  mockBroadcasts,
  mockPosts,
  mockPostComments
} from '../mockData.js';

const api = axios.create({
  baseURL: '/api'
});

const shouldMock = import.meta.env.VITE_USE_MOCK === 'true';

const mockState = {
  users: mockUsers.map((user) => ({ ...user })),
  games: mockGames.map((game) => ({ ...game })),
  comments: mockComments.map((comment) => ({ ...comment })),
  posts: mockPosts.map((post) => ({ ...post })),
  postComments: mockPostComments.map((comment) => ({ ...comment })),
  broadcasts: mockBroadcasts.map((entry) => ({ ...entry })),
  credentials: {
    'minh@example.com': { password: 'User123!', userId: 'u1' },
    'linh@example.com': { password: 'Admin123!', userId: 'u2' }
  },
  sessions: {}
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const randomId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

let authToken = null;

function applyToken(token) {
  authToken = token || null;
  if (authToken) {
    api.defaults.headers.common['x-auth-token'] = authToken;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
}

async function withMock(realCall, mockCall) {
  if (!shouldMock) {
    try {
      const result = await realCall();
      return result;
    } catch (error) {
      if (!mockCall) {
        throw error;
      }
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
  const { favoriteGenres = [], preferredPlatforms = [], budget, playStyles = [] } = preferences;

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

const toPublicUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return { ...rest };
};

const ensureMockCredential = (email, password, userId) => {
  mockState.credentials[email.toLowerCase()] = { password, userId };
};

const startMockSession = (userId) => {
  const token = randomId('token');
  mockState.sessions[token] = { userId, createdAt: Date.now() };
  return token;
};

const resolveMockSession = (token) => {
  const session = token ? mockState.sessions[token] : undefined;
  if (!session) return null;
  return mockState.users.find((user) => user.id === session.userId) ?? null;
};

export const apiClient = {
  setAuthToken(token) {
    applyToken(token);
  },

  async register(payload) {
    return withMock(
      () => api.post('/auth/register', payload).then((res) => res.data),
      () => {
        const { name, email, password } = payload;
        if (!name || !email || !password) {
          throw new Error('Thiếu thông tin đăng ký');
        }

        const exists = mockState.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          const error = new Error('Email đã được đăng ký.');
          error.status = 409;
          throw error;
        }

        const user = {
          id: randomId('u'),
          name,
          email,
          role: 'user',
          preferences: { favoriteGenres: [], preferredPlatforms: [], budget: null, playStyles: [] },
          createdAt: new Date().toISOString()
        };
        mockState.users.push(user);
        ensureMockCredential(email, password, user.id);
        const token = startMockSession(user.id);
        applyToken(token);
        return { token, user: clone(user) };
      }
    ).then((result) => {
      if (result?.token) {
        applyToken(result.token);
      }
      return result;
    });
  },

  async login(payload) {
    return withMock(
      () => api.post('/auth/login', payload).then((res) => res.data),
      () => {
        const { email, password } = payload;
        const credential = mockState.credentials[email.toLowerCase()];
        if (!credential || credential.password !== password) {
          const error = new Error('Thông tin đăng nhập không chính xác.');
          error.status = 401;
          throw error;
        }
        const user = mockState.users.find((candidate) => candidate.id === credential.userId);
        const token = startMockSession(user.id);
        applyToken(token);
        return { token, user: clone(user) };
      }
    ).then((result) => {
      if (result?.token) {
        applyToken(result.token);
      }
      return result;
    });
  },

  async logout() {
    return withMock(
      () => api.post('/auth/logout').then((res) => res.data),
      () => {
        if (authToken) {
          delete mockState.sessions[authToken];
        }
        applyToken(null);
        return { success: true };
      }
    ).finally(() => {
      applyToken(null);
    });
  },

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
        const { name, email, password, role = 'user', preferences = {} } = payload;
        if (!name || !email || !password) {
          throw new Error('Thiếu thông tin tạo người dùng.');
        }
        const exists = mockState.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          const error = new Error('Email đã được sử dụng.');
          error.status = 409;
          throw error;
        }
        const user = {
          id: randomId('u'),
          name,
          email,
          role,
          preferences,
          createdAt: new Date().toISOString()
        };
        mockState.users.push(user);
        ensureMockCredential(email, password, user.id);
        return clone(user);
      }
    );
  },

  async updateUser(userId, payload) {
    return withMock(
      () => api.put(`/users/${userId}`, payload).then((res) => res.data),
      () => {
        const user = mockState.users.find((candidate) => candidate.id === userId);
        if (!user) {
          const error = new Error('Người dùng không tồn tại.');
          error.status = 404;
          throw error;
        }
        if (payload.email && payload.email !== user.email) {
          const duplicate = mockState.users.find(
            (candidate) => candidate.email.toLowerCase() === payload.email.toLowerCase()
          );
          if (duplicate) {
            const error = new Error('Email đã được sử dụng.');
            error.status = 409;
            throw error;
          }
          user.email = payload.email;
        }
        if (payload.name !== undefined) user.name = payload.name;
        if (payload.role !== undefined) user.role = payload.role;
        if (payload.preferences !== undefined) {
          user.preferences = payload.preferences;
        }
        if (payload.password) {
          ensureMockCredential(user.email, payload.password, user.id);
        }
        return clone(user);
      }
    );
  },

  async deleteUser(userId) {
    return withMock(
      () => api.delete(`/users/${userId}`).then((res) => res.data),
      () => {
        const index = mockState.users.findIndex((candidate) => candidate.id === userId);
        if (index === -1) {
          const error = new Error('Người dùng không tồn tại.');
          error.status = 404;
          throw error;
        }
        const [removed] = mockState.users.splice(index, 1);
        delete mockState.credentials[removed.email.toLowerCase()];
        Object.entries(mockState.sessions).forEach(([token, session]) => {
          if (session.userId === removed.id) {
            delete mockState.sessions[token];
          }
        });
        return clone(removed);
      }
    );
  },

  async fetchPosts() {
    return withMock(
      () => api.get('/posts').then((res) => res.data),
      () => clone(
        mockState.posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      )
    );
  },

  async fetchPost(postId) {
    return withMock(
      () => api.get(`/posts/${postId}`).then((res) => res.data),
      () => {
        const post = mockState.posts.find((candidate) => candidate.id === postId);
        if (!post) {
          const error = new Error('Bài viết không tồn tại.');
          error.status = 404;
          throw error;
        }
        return clone(post);
      }
    );
  },

  async createPost(payload) {
    return withMock(
      () => api.post('/posts', payload).then((res) => res.data),
      () => {
        const post = {
          id: randomId('p'),
          title: payload.title,
          summary: payload.summary,
          content: payload.content,
          tags: payload.tags ?? [],
          coverUrl: payload.coverUrl || null,
          authorId: resolveMockSession(authToken)?.id ?? 'u2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockState.posts.push(post);
        return clone(post);
      }
    );
  },

  async updatePost(postId, payload) {
    return withMock(
      () => api.put(`/posts/${postId}`, payload).then((res) => res.data),
      () => {
        const post = mockState.posts.find((candidate) => candidate.id === postId);
        if (!post) {
          const error = new Error('Bài viết không tồn tại.');
          error.status = 404;
          throw error;
        }
        Object.assign(post, payload, { updatedAt: new Date().toISOString() });
        return clone(post);
      }
    );
  },

  async deletePost(postId) {
    return withMock(
      () => api.delete(`/posts/${postId}`).then((res) => res.data),
      () => {
        const index = mockState.posts.findIndex((candidate) => candidate.id === postId);
        if (index === -1) {
          const error = new Error('Bài viết không tồn tại.');
          error.status = 404;
          throw error;
        }
        const [removed] = mockState.posts.splice(index, 1);
        mockState.postComments = mockState.postComments.filter((comment) => comment.postId !== postId);
        return clone(removed);
      }
    );
  },

  async fetchPostComments(postId) {
    return withMock(
      () => api.get(`/posts/${postId}/comments`).then((res) => res.data),
      () => clone(
        mockState.postComments
          .filter((comment) => comment.postId === postId)
          .map((comment) => ({
            ...comment,
            userName: mockState.users.find((user) => user.id === comment.userId)?.name || 'Ẩn danh'
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      )
    );
  },

  async createPostComment(postId, payload) {
    return withMock(
      () => api.post(`/posts/${postId}/comments`, payload).then((res) => res.data),
      () => {
        const user = resolveMockSession(authToken);
        if (!user) {
          const error = new Error('Yêu cầu đăng nhập.');
          error.status = 401;
          throw error;
        }
        const comment = {
          id: randomId('pc'),
          postId,
          userId: user.id,
          content: payload.content,
          createdAt: new Date().toISOString()
        };
        mockState.postComments.push(comment);
        return clone(comment);
      }
    );
  },

  async deletePostComment(postId, commentId) {
    return withMock(
      () => api.delete(`/posts/${postId}/comments/${commentId}`).then((res) => res.data),
      () => {
        const index = mockState.postComments.findIndex(
          (comment) => comment.id === commentId && comment.postId === postId
        );
        if (index === -1) {
          const error = new Error('Bình luận không tồn tại.');
          error.status = 404;
          throw error;
        }
        const [removed] = mockState.postComments.splice(index, 1);
        return clone(removed);
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
      () => api.post('/recommendations', { preferences }).then((res) => res.data.recommendations),
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
      () => api.get('/external-games/search', { params: { query, page } }).then((res) => res.data),
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
