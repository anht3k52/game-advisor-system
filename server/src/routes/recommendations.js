import { Router } from 'express'
import {
  getRecommendationsForUser,
  getSimilarGames,
  getRecommendationsForPreferences
} from '../services/recommendationService.js'

const router = Router()

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  const recommendations = getRecommendationsForUser(userId)
  res.json({ userId, recommendations })
})

router.get('/game/:gameId', (req, res) => {
  const { gameId } = req.params
  const similar = getSimilarGames(gameId)
  res.json({ gameId, similar })
})

router.post('/anonymous', (req, res) => {
  const { genres = [], platforms = [], budget = null } = req.body
  const preferences = { genres, platforms, budget }
  const recommendations = getRecommendationsForPreferences(preferences).map(({ game, score }) => ({
    ...game,
    score: Number(score.toFixed(2))
  }))

  res.json({ recommendations })
})

export default router
