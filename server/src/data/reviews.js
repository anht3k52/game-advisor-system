import { v4 as uuid } from 'uuid'
import games from './games.js'

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

export default reviews
