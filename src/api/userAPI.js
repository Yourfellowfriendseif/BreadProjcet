import { apiClient } from './apiClient';
import { UserRoles } from '../types/dbTypes';

export const userAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/users', { 
    ...userData, 
    role: UserRoles.BUYER // Default role
  }),
  updateRole: (userId, newRole) => apiClient.patch(`/users/${userId}/role`, { newRole })
};