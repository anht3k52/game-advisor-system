import { v4 as uuid } from 'uuid'

const categories = ['RPG', 'Action', 'Strategy', 'Indie', 'Sports']
const platforms = ['PC', 'PlayStation', 'Xbox', 'Switch']

const games = [
  {
    id: uuid(),
    title: 'Elder Quest',
    genre: 'RPG',
    platforms: ['PC', 'PlayStation'],
    rating: 4.8,
    price: 59.99,
    description: 'An expansive open-world fantasy adventure.',
    tags: ['open-world', 'story-rich']
  },
  {
    id: uuid(),
    title: 'Sky Raiders',
    genre: 'Action',
    platforms: ['PC', 'Xbox'],
    rating: 4.3,
    price: 49.99,
    description: 'High-octane aerial combat with multiplayer.',
    tags: ['multiplayer', 'shooter']
  },
  {
    id: uuid(),
    title: 'Mind Masters',
    genre: 'Strategy',
    platforms: ['PC'],
    rating: 4.6,
    price: 39.99,
    description: 'A tactical strategy game with deep AI opponents.',
    tags: ['turn-based', 'tactical']
  }
]

const users = [
  {
    id: uuid(),
    name: 'Linh Nguyen',
    email: 'linh@example.com',
    preferences: {
      genres: ['RPG', 'Strategy'],
      platforms: ['PC'],
      budget: 60
    }
  },
  {
    id: uuid(),
    name: 'Minh Tran',
    email: 'minh@example.com',
    preferences: {
      genres: ['Action'],
      platforms: ['Xbox', 'PC'],
      budget: 50
    }
  }
]

const reviews = [
  {
    id: uuid(),
    gameId: games[0].id,
    userName: 'GameLover99',
    rating: 5,
    comment: 'Một game RPG cực kỳ hấp dẫn với cốt truyện cuốn hút.',
    createdAt: new Date().toISOString()
  }
]

function getGameById (id) {
  return games.find((game) => game.id === id)
}

function addReview (review) {
  const entry = { ...review, id: uuid(), createdAt: new Date().toISOString() }
  reviews.push(entry)
  return entry
}

const store = {
  users,
  games,
  reviews,
  categories,
  platforms,
  getGameById,
  addReview
}

export default store
