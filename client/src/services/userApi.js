import apiClient from './apiClient.js';

export function updateProfile(payload) {
  return apiClient.put('/users/me', payload).then((res) => res.data);
}

export function fetchFavorites() {
  return apiClient.get('/users/me/favorites').then((res) => res.data);
}

export function addFavorite(rawgGameId) {
  return apiClient.post('/users/me/favorites', { rawgGameId }).then((res) => res.data);
}

export function removeFavorite(rawgGameId) {
  return apiClient.delete(`/users/me/favorites/${rawgGameId}`).then((res) => res.data);
}
