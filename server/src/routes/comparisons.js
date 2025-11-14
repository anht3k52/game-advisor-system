import { Router } from 'express'
import { compareGames } from '../services/comparisonService.js'

const router = Router()

router.post('/', (req, res) => {
  const { gameIds = [] } = req.body
  if (!Array.isArray(gameIds) || gameIds.length === 0) {
    return res.status(400).json({ error: 'Provide at least one game id to compare' })
  }

  const comparison = compareGames(gameIds)
  res.json({ comparison })
})

export default router
