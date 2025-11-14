import apiClient from './apiClient.js';

export function registerRequest(payload) {
  return apiClient.post('/auth/register', payload).then((res) => res.data);
}

export function loginRequest(payload) {
  return apiClient.post('/auth/login', payload).then((res) => res.data);
}

export function fetchCurrentUser(token) {
  return apiClient
    .get('/auth/me', {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    })
    .then((res) => res.data);
}
