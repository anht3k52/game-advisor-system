import { v4 as uuid } from 'uuid'

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

export default games
