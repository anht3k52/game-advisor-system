const BASE_URL = import.meta.env.VITE_API_URL || ''

async function request (path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export function fetchUsers () {
  return request('/api/users')
}

export function createUser (payload) {
  return request('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchGames () {
  return request('/api/games')
}

export function createGame (payload) {
  return request('/api/games', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchRecommendationsForUser (userId) {
  return request(`/api/recommendations/user/${userId}`)
}

export function fetchAnonymousRecommendations (payload) {
  return request('/api/recommendations/anonymous', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchSimilarGames (gameId) {
  return request(`/api/recommendations/game/${gameId}`)
}

export function searchGames (params) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})
  )
  return request(`/api/search?${query.toString()}`)
}

export function fetchSearchFilters () {
  return request('/api/search/filters')
}

export function compareGames (payload) {
  return request('/api/comparisons', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchReviews (params = {}) {
  const query = new URLSearchParams(params)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return request(`/api/reviews${suffix}`)
}

export function createReview (payload) {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchAdminStats () {
  return request('/api/admin/stats')
}

export function fetchAdminActivity () {
  return request('/api/admin/activity')
}
