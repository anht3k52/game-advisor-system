import { Router } from 'express'
import store from '../data/store.js'

const router = Router()

router.get('/stats', (req, res) => {
  const totalUsers = store.users.length
  const totalGames = store.games.length
  const averageRating =
    store.games.reduce((acc, game) => acc + game.rating, 0) / Math.max(totalGames, 1)
  const totalReviews = store.reviews.length

  res.json({
    totalUsers,
    totalGames,
    totalReviews,
    averageRating: Number(averageRating.toFixed(2))
  })
})

router.get('/activity', (req, res) => {
  const recentReviews = [...store.reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  res.json({ recentReviews })
})

export default router
