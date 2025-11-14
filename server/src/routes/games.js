import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import store from '../data/store.js'
import { fetchRawgGames } from '../services/rawgService.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(store.games)
})

router.post('/', (req, res) => {
  const { title, genre, platforms = [], rating = null, price = 0, description = '', tags = [] } = req.body
  if (!title || !genre) {
    return res.status(400).json({ error: 'Title and genre are required' })
  }

  const newGame = {
    id: uuid(),
    title,
    genre,
    platforms,
    rating: Number(rating) || 0,
    price: Number(price) || 0,
    description,
    tags
  }

  store.games.push(newGame)
  res.status(201).json(newGame)
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const game = store.games.find((candidate) => candidate.id === id)
  if (!game) {
    return res.status(404).json({ error: 'Game not found' })
  }

  const { title, genre, platforms, rating, price, description, tags } = req.body
  if (title) game.title = title
  if (genre) game.genre = genre
  if (platforms) game.platforms = platforms
  if (rating !== undefined) game.rating = Number(rating)
  if (price !== undefined) game.price = Number(price)
  if (description) game.description = description
  if (tags) game.tags = tags

  res.json(game)
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = store.games.findIndex((candidate) => candidate.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Game not found' })
  }

  store.games.splice(index, 1)
  res.status(204).send()
})

router.get('/external/trending', async (req, res) => {
  try {
    const { page = 1, pageSize, search } = req.query
    const results = await fetchRawgGames({ page, pageSize, search })
    res.json(results)
  } catch (error) {
    res.status(502).json({ error: error.message || 'Không thể lấy dữ liệu từ RAWG' })
  }
})

export default router
