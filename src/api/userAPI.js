import { apiClient } from './apiClient';

export const userAPI = {
  // Authentication
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData) => apiClient.post('/auth/register', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    phone_number: userData.phone_number || '', // Default empty if not provided
    photo_url: userData.photo_url || 'https://example.com/default-avatar.jpg' // Default image
  }),

  logout: () => apiClient.post('/auth/logout'),

  // User Management
  getProfile: () => apiClient.get('/users/me'),

  // New method for error testing
  testError: () => apiClient.get('/auth/test-error')
};