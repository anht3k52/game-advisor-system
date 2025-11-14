import apiClient from './apiClient.js';

export function fetchPopularGames(params) {
  return apiClient.get('/games/popular', { params }).then((res) => res.data);
}

export function fetchGameDetails(id) {
  return apiClient.get(`/games/${id}`).then((res) => res.data);
}

export function searchGames(params) {
  return apiClient.get('/games/search', { params }).then((res) => res.data);
}

export function batchGames(ids) {
  return apiClient.get('/games/batch', { params: { ids: ids.join(',') } }).then((res) => res.data);
}
