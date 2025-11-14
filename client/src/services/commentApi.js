import apiClient from './apiClient.js';

export function fetchComments(targetType, targetId) {
  return apiClient.get(`/comments/${targetType}/${targetId}`).then((res) => res.data);
}

export function createComment(payload) {
  return apiClient.post('/comments', payload).then((res) => res.data);
}

export function updateComment(id, content) {
  return apiClient.put(`/comments/${id}`, { content }).then((res) => res.data);
}

export function deleteComment(id) {
  return apiClient.delete(`/comments/${id}`).then((res) => res.data);
}
