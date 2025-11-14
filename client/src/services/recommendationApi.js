import apiClient from './apiClient.js';

export function fetchRecommendations(userId) {
  if (userId) {
    return apiClient.get(`/recommend/games/${userId}`).then((res) => res.data);
  }
  return apiClient.get('/recommend/games/guest').then((res) => res.data);
}
