import apiClient from './apiClient.js';

export function compareGames(ids) {
  return apiClient.post('/comparisons', { ids }).then((res) => res.data);
}
