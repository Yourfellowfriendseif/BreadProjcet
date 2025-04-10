import { apiClient } from './apiClient';
import { BreadStates } from '../types/dbTypes';

export const breadAPI = {
  getAll: () => apiClient.get('/breads'),
  getByState: (state) => apiClient.get(`/breads?state=${state}`),
  create: (breadData) => apiClient.post('/breads', {
    ...breadData,
    state: BreadStates.DAY_OLD // Default state
  }),
  updateState: (breadId, newState) => apiClient.patch(`/breads/${breadId}/state`, { newState })
};