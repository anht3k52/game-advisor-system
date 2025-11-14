import apiClient from './apiClient.js';

export function submitRating(payload) {
  return apiClient.post('/ratings', payload).then((res) => res.data);
}

export function fetchGameRating(rawgGameId) {
  return apiClient.get(`/ratings/${rawgGameId}`).then((res) => res.data);
}
