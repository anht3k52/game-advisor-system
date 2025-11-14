import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import usersRouter from './routes/userRoutes.js'
import gamesRouter from './routes/games.js'
import recommendationsRouter from './routes/recommendations.js'
import searchRouter from './routes/search.js'
import comparisonsRouter from './routes/comparisons.js'
import reviewsRouter from './routes/reviews.js'
import adminRouter from './routes/admin.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Game Advisor System API' })
})

app.use('/api/users', usersRouter)
app.use('/api/games', gamesRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/search', searchRouter)
app.use('/api/comparisons', comparisonsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/admin', adminRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

export default app
