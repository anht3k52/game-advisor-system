import apiClient from './apiClient.js';

export async function requestGameAdvice(payload) {
  const response = await apiClient.post('/chatbot', payload);
  return response.data;
}
