import store from '../data/store.js'

function scoreGameByPreferences (game, preferences = {}) {
  const { genres = [], platforms = [], budget } = preferences

  let score = 0

  if (genres.length === 0 || genres.includes(game.genre)) {
    score += 0.4
  }

  if (platforms.length === 0 || platforms.some((platform) => game.platforms.includes(platform))) {
    score += 0.3
  }

  if (typeof budget === 'number' && game.price <= budget) {
    score += 0.2
  } else if (budget === undefined || budget === null) {
    score += 0.1
  }

  score += (game.rating / 5) * 0.3
  return score
}

export function getRecommendationsForUser (userId) {
  const user = store.users.find((candidate) => candidate.id === userId)
  if (!user) {
    return []
  }

  return getRecommendationsForPreferences(user.preferences).map(({ game }) => game)
}

export function getRecommendationsForPreferences (preferences) {
  return store.games
    .map((game) => ({ game, score: scoreGameByPreferences(game, preferences) }))
    .filter(({ score }) => score > 0.2)
    .sort((a, b) => b.score - a.score)
}

export function getSimilarGames (gameId) {
  const target = store.getGameById(gameId)
  if (!target) {
    return []
  }

  return store.games
    .filter((game) => game.id !== target.id)
    .map((game) => {
      const sharedTags = game.tags.filter((tag) => target.tags.includes(tag))
      const similarityScore =
        (sharedTags.length * 0.6) + (game.genre === target.genre ? 0.4 : 0)
      return { game, similarityScore }
    })
    .filter(({ similarityScore }) => similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .map(({ game, similarityScore }) => ({ ...game, similarityScore }))
}
