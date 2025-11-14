import { Router } from 'express'
import store from '../data/store.js'
import { searchGames } from '../services/searchService.js'

const router = Router()

router.get('/filters', (req, res) => {
  res.json({ genres: store.categories, platforms: store.platforms })
})

router.get('/', (req, res) => {
  const { query, genre, platform, minPrice, maxPrice } = req.query
  const priceRange =
    minPrice !== undefined || maxPrice !== undefined
      ? [minPrice ? Number(minPrice) : null, maxPrice ? Number(maxPrice) : null]
      : undefined

  const results = searchGames({
    query,
    genre,
    platform,
    priceRange
  })

  res.json({ query, results })
})

export default router
