import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import store from '../data/store.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(store.users)
})

router.post('/', (req, res) => {
  const { name, email, preferences = {} } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    preferences: {
      genres: preferences.genres || [],
      platforms: preferences.platforms || [],
      budget: preferences.budget ?? null
    }
  }

  store.users.push(newUser)
  res.status(201).json(newUser)
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const user = store.users.find((candidate) => candidate.id === id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { name, email, preferences } = req.body
  if (name) user.name = name
  if (email) user.email = email
  if (preferences) {
    user.preferences = {
      genres: preferences.genres || user.preferences.genres,
      platforms: preferences.platforms || user.preferences.platforms,
      budget: preferences.budget ?? user.preferences.budget
    }
  }

  res.json(user)
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = store.users.findIndex((candidate) => candidate.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }

  store.users.splice(index, 1)
  res.status(204).send()
})

export default router
