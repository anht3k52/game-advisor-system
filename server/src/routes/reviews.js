import { Router } from 'express'
import store from '../data/store.js'

const router = Router()

router.get('/', (req, res) => {
  const { gameId } = req.query
  const results = gameId
    ? store.reviews.filter((review) => review.gameId === gameId)
    : store.reviews
  res.json(results)
})

router.post('/', (req, res) => {
  const { gameId, userName, rating, comment } = req.body
  if (!gameId || !userName || !rating) {
    return res.status(400).json({ error: 'gameId, userName và rating là bắt buộc' })
  }

  const review = store.addReview({ gameId, userName, rating: Number(rating), comment })
  res.status(201).json(review)
})

export default router
