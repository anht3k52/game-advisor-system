import store from '../data/store.js'

export function compareGames (gameIds) {
  return gameIds
    .map((id) => store.getGameById(id))
    .filter(Boolean)
    .map((game) => ({
      id: game.id,
      title: game.title,
      genre: game.genre,
      rating: game.rating,
      price: game.price,
      platforms: game.platforms,
      tags: game.tags
    }))
}
