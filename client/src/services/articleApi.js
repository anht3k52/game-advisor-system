import apiClient from './apiClient.js';

export function fetchArticles(params) {
  return apiClient.get('/articles', { params }).then((res) => res.data);
}

export function fetchArticle(slug) {
  return apiClient.get(`/articles/${slug}`).then((res) => res.data);
}

export function markArticleAsRead(articleId) {
  return apiClient.post(`/articles/${articleId}/read`).then((res) => res.data);
}

export function createArticle(payload) {
  return apiClient.post('/articles', payload).then((res) => res.data);
}

export function updateArticle(id, payload) {
  return apiClient.put(`/articles/${id}`, payload).then((res) => res.data);
}

export function deleteArticle(id) {
  return apiClient.delete(`/articles/${id}`).then((res) => res.data);
}
