import * as http from '../api/client.js'
import * as mock from '../mockData.js'

const useMock = (import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true'

function proxied (method, ...args) {
  const source = useMock ? mock : http
  return source[method](...args)
}

export const fetchUsers = (...args) => proxied('fetchUsers', ...args)
export const createUser = (...args) => proxied('createUser', ...args)
export const fetchGames = (...args) => proxied('fetchGames', ...args)
export const createGame = (...args) => proxied('createGame', ...args)
export const fetchAnonymousRecommendations = (...args) => proxied('fetchAnonymousRecommendations', ...args)
export const fetchRecommendationsForUser = (...args) => proxied('fetchRecommendationsForUser', ...args)
export const fetchSimilarGames = (...args) => proxied('fetchSimilarGames', ...args)
export const searchGames = (...args) => proxied('searchGames', ...args)
export const fetchSearchFilters = (...args) => proxied('fetchSearchFilters', ...args)
export const compareGames = (...args) => proxied('compareGames', ...args)
export const fetchReviews = (...args) => proxied('fetchReviews', ...args)
export const createReview = (...args) => proxied('createReview', ...args)
export const fetchAdminStats = (...args) => proxied('fetchAdminStats', ...args)
export const fetchAdminActivity = (...args) => proxied('fetchAdminActivity', ...args)
export const fetchRawgTrending = (...args) => proxied('fetchRawgTrending', ...args)
