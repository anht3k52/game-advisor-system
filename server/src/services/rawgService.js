const RAWG_API_BASE = 'https://api.rawg.io/api'

function buildQuery (params) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

export async function fetchRawgGames ({ page = 1, pageSize = 10, search } = {}) {
  const apiKey = process.env.RAWG_API_KEY
  if (!apiKey) {
    throw new Error('Thiếu RAWG_API_KEY trong biến môi trường')
  }

  const query = buildQuery({ key: apiKey, page, page_size: pageSize, search })
  const response = await fetch(`${RAWG_API_BASE}/games?${query}`)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(`RAWG request failed: ${response.status} ${message}`)
  }

  const payload = await response.json()
  return {
    count: payload.count,
    next: payload.next,
    previous: payload.previous,
    results: payload.results.map((game) => ({
      id: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      ratingsCount: game.ratings_count,
      backgroundImage: game.background_image,
      platforms: game.parent_platforms?.map((item) => item.platform.name) ?? [],
      genres: game.genres?.map((genre) => genre.name) ?? []
    }))
  }
}
