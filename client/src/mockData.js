const clone = (value) => (typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)))
const delay = (value, ms = 200) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms))
const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const mockGames = [
  {
    id: generateId(),
    title: 'Elder Quest',
    genre: 'RPG',
    platforms: ['PC', 'PlayStation'],
    rating: 4.8,
    price: 59.99,
    description: 'Một hành trình phiêu lưu kỳ ảo rộng lớn với cốt truyện sâu sắc.',
    tags: ['open-world', 'story-rich']
  },
  {
    id: generateId(),
    title: 'Sky Raiders',
    genre: 'Action',
    platforms: ['PC', 'Xbox'],
    rating: 4.3,
    price: 49.99,
    description: 'Game bắn súng góc nhìn thứ nhất với chế độ co-op hấp dẫn.',
    tags: ['multiplayer', 'shooter']
  },
  {
    id: generateId(),
    title: 'Mind Masters',
    genre: 'Strategy',
    platforms: ['PC'],
    rating: 4.6,
    price: 39.99,
    description: 'Chiến thuật theo lượt với trí tuệ nhân tạo thông minh.',
    tags: ['turn-based', 'tactical']
  }
]

const mockUsers = [
  {
    id: generateId(),
    name: 'Linh Nguyen',
    email: 'linh@example.com',
    preferences: {
      genres: ['RPG', 'Strategy'],
      platforms: ['PC'],
      budget: 60
    }
  },
  {
    id: generateId(),
    name: 'Minh Tran',
    email: 'minh@example.com',
    preferences: {
      genres: ['Action'],
      platforms: ['Xbox', 'PC'],
      budget: 50
    }
  }
]

const mockReviews = [
  {
    id: generateId(),
    gameId: mockGames[0].id,
    userName: 'GameLover99',
    rating: 5,
    comment: 'Một game RPG cực kỳ hấp dẫn với cốt truyện cuốn hút.',
    createdAt: new Date().toISOString()
  }
]

const genres = Array.from(new Set(mockGames.map((game) => game.genre)))
const platforms = Array.from(new Set(mockGames.flatMap((game) => game.platforms)))

const scoreGameByPreferences = (game, preferences = {}) => {
  const { genres: prefGenres = [], platforms: prefPlatforms = [], budget } = preferences
  let score = 0
  if (prefGenres.length === 0 || prefGenres.includes(game.genre)) score += 0.4
  if (prefPlatforms.length === 0 || prefPlatforms.some((platform) => game.platforms.includes(platform))) score += 0.3
  if (typeof budget === 'number' && game.price <= budget) score += 0.2
  else if (budget === undefined || budget === null) score += 0.1
  score += (game.rating / 5) * 0.3
  return score
}

export function fetchUsers () {
  return delay(mockUsers)
}

export function createUser (payload) {
  const entry = {
    id: generateId(),
    name: payload.name,
    email: payload.email,
    preferences: {
      genres: payload.preferences?.genres ?? [],
      platforms: payload.preferences?.platforms ?? [],
      budget: payload.preferences?.budget ?? null
    }
  }
  mockUsers.push(entry)
  return delay(entry)
}

export function fetchGames () {
  return delay(mockGames)
}

export function createGame (payload) {
  const entry = {
    id: generateId(),
    title: payload.title,
    genre: payload.genre,
    platforms: payload.platforms ?? [],
    rating: Number(payload.rating ?? 0),
    price: Number(payload.price ?? 0),
    tags: payload.tags ?? [],
    description: payload.description ?? ''
  }
  mockGames.push(entry)
  if (entry.genre && !genres.includes(entry.genre)) {
    genres.push(entry.genre)
  }
  entry.platforms.forEach((platform) => {
    if (!platforms.includes(platform)) platforms.push(platform)
  })
  return delay(entry)
}

export function fetchRecommendationsForUser (userId) {
  const user = mockUsers.find((item) => item.id === userId)
  const recommendations = user ? buildRecommendations(user.preferences) : []
  return delay({ userId, recommendations })
}

export function fetchAnonymousRecommendations (preferences) {
  return delay({ recommendations: buildRecommendations(preferences) })
}

export function fetchSimilarGames (gameId) {
  const target = mockGames.find((game) => game.id === gameId)
  if (!target) {
    return delay({ gameId, similar: [] })
  }
  const similar = mockGames
    .filter((game) => game.id !== target.id)
    .map((game) => {
      const sharedTags = game.tags.filter((tag) => target.tags.includes(tag))
      const similarityScore = (sharedTags.length * 0.6) + (game.genre === target.genre ? 0.4 : 0)
      return { ...game, similarityScore }
    })
    .filter((entry) => entry.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
  return delay({ gameId, similar })
}

export function searchGames ({ query, genre, platform, minPrice, maxPrice }) {
  const normalizedQuery = query?.toLowerCase() ?? ''
  const min = minPrice ? Number(minPrice) : null
  const max = maxPrice ? Number(maxPrice) : null
  const results = mockGames.filter((game) => {
    const matchesQuery =
      !normalizedQuery ||
      game.title.toLowerCase().includes(normalizedQuery) ||
      game.description.toLowerCase().includes(normalizedQuery)
    const matchesGenre = !genre || game.genre === genre
    const matchesPlatform = !platform || game.platforms.includes(platform)
    const matchesMin = min === null || game.price >= min
    const matchesMax = max === null || game.price <= max
    return matchesQuery && matchesGenre && matchesPlatform && matchesMin && matchesMax
  })
  return delay({ results })
}

export function fetchSearchFilters () {
  return delay({ genres, platforms })
}

export function compareGames ({ gameIds = [] }) {
  const comparison = mockGames.filter((game) => gameIds.includes(game.id))
  return delay({ comparison })
}

export function fetchReviews ({ gameId } = {}) {
  const results = gameId ? mockReviews.filter((review) => review.gameId === gameId) : mockReviews
  return delay(results)
}

export function createReview ({ gameId, userName, rating, comment }) {
  const review = {
    id: generateId(),
    gameId,
    userName,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  }
  mockReviews.unshift(review)
  return delay(review)
}

export function fetchAdminStats () {
  const totalUsers = mockUsers.length
  const totalGames = mockGames.length
  const averageRating =
    mockGames.reduce((acc, game) => acc + game.rating, 0) / Math.max(totalGames, 1)
  const totalReviews = mockReviews.length
  return delay({
    totalUsers,
    totalGames,
    totalReviews,
    averageRating: Number(averageRating.toFixed(2))
  })
}

export function fetchAdminActivity () {
  const recentReviews = [...mockReviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
  return delay({ recentReviews })
}

export function fetchRawgTrending () {
  // Provide deterministic sample data to keep UI working without network calls
  return delay({
    count: 3,
    next: null,
    previous: null,
    results: mockGames.map((game) => ({
      id: game.id,
      name: game.title,
      released: '2023-01-01',
      rating: game.rating,
      ratingsCount: 1200,
      backgroundImage: null,
      platforms: game.platforms,
      genres: [game.genre]
    }))
  })
}

function buildRecommendations (preferences = {}) {
  return mockGames
    .map((game) => ({ game, score: scoreGameByPreferences(game, preferences) }))
    .filter(({ score }) => score > 0.2)
    .sort((a, b) => b.score - a.score)
    .map(({ game, score }) => ({ ...game, score: Number(score.toFixed(2)) }))
}
