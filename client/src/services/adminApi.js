import apiClient from './apiClient.js';

export function fetchDashboard() {
  return apiClient.get('/admin/dashboard').then((res) => res.data);
}

export function fetchAdminUsers(params) {
  return apiClient.get('/admin/users', { params }).then((res) => res.data);
}

export function updateAdminUser(id, payload) {
  return apiClient.patch(`/admin/users/${id}`, payload).then((res) => res.data);
}

export function fetchAdminArticles(params) {
  return apiClient.get('/admin/articles', { params }).then((res) => res.data);
}

export function createAdminArticle(payload) {
  return apiClient.post('/admin/articles', payload).then((res) => res.data);
}

export function updateAdminArticle(id, payload) {
  return apiClient.put(`/admin/articles/${id}`, payload).then((res) => res.data);
}

export function deleteAdminArticle(id) {
  return apiClient.delete(`/admin/articles/${id}`).then((res) => res.data);
}

export function fetchAdminComments(targetType, targetId) {
  return apiClient
    .get(`/admin/comments/${targetType}/${targetId}`, { params: { includeHidden: true } })
    .then((res) => res.data);
}

export function moderateAdminComment(id, payload) {
  return apiClient.patch(`/admin/comments/${id}/moderate`, payload).then((res) => res.data);
}
