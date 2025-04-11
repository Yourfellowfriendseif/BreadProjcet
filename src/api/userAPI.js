import { apiClient } from './apiClient';

export const userAPI = {
  // Authentication
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: ({ username, email, password, phone_number, photo_url }) => 
    apiClient.post('/auth/register', { 
      username,
      email,
      password,
      phone_number,
      photo_url 
    }),

  logout: () => apiClient.post('/auth/logout'),

  // User Management
  getProfile: () => apiClient.get('/users/me'), // Assuming protected route
};