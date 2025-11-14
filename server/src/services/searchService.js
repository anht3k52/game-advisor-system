import store from '../data/store.js'

export function searchGames ({ query, genre, platform, priceRange }) {
  return store.games.filter((game) => {
    const matchesQuery =
      !query || game.title.toLowerCase().includes(query.toLowerCase()) ||
      game.description.toLowerCase().includes(query.toLowerCase())

    const matchesGenre = !genre || game.genre === genre
    const matchesPlatform = !platform || game.platforms.includes(platform)

    let matchesPrice = true
    if (priceRange) {
      const [min, max] = priceRange
      matchesPrice = (min === null || game.price >= min) && (max === null || game.price <= max)
    }

    return matchesQuery && matchesGenre && matchesPlatform && matchesPrice
  })
}
