import { apiClient } from './apiClient';
import { UserRoles } from '../types/dbTypes';

export const userAPI = {
  // Auth
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData) => 
    apiClient.post('/users', { 
      ...userData,
      role: UserRoles.BUYER,
      createdAt: new Date().toISOString() 
    }),

  // User Management
  getProfile: (userId) => 
    apiClient.get(`/users/${userId}`),
    
  updateRole: (userId, newRole) => 
    apiClient.patch(`/users/${userId}`, { 
      role: newRole,
      updatedAt: new Date().toISOString() 
    }),

  // Listings (MongoDB references)
  getUserListings: (userId) => 
    apiClient.get(`/users/${userId}/listings`),
    
  deactivateUser: (userId) => 
    apiClient.patch(`/users/${userId}/status`, { 
      active: false 
    })
};