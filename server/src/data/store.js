import { v4 as uuid } from 'uuid'
import games from './games.js'
import users from './users.js'
import reviews from './reviews.js'
import { categories, platforms } from './taxonomy.js'

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
